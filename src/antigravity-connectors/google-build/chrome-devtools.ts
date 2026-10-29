import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export interface TikTokProductDetails {
  productId: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  soldCount: number;
  rating?: number;
  shopName: string;
  productUrl: string;
  imageUrl?: string;
  commissionEstimatePercent?: number;
  scrapedAt: string;
}

export interface BrowserSessionConfig {
  headless?: boolean;
  port?: number;
  userDataDir?: string;
}

/**
 * Mở trình duyệt Chrome với cổng Remote Debugging (Chrome DevTools Protocol).
 * Tận dụng các cờ native của Chrome/Edge có sẵn trên hệ điều hành.
 */
export async function launchBrowserSession(
  targetUrl: string,
  config: BrowserSessionConfig = {}
): Promise<{ processPid?: number; debugUrl: string }> {
  const port = config.port ?? 9222;
  const headlessFlag = config.headless !== false ? "--headless=new" : "";

  // Thử các đường dẫn trình duyệt Chromium phổ biến trên Windows
  const browserCmd = `start "" chrome "${targetUrl}" --remote-debugging-port=${port} ${headlessFlag}`;

  try {
    // shortcut: Sử dụng start lệnh native Windows mở browser debug session, nâng cấp sang Puppeteer daemon khi cần giữ socket liên tục
    await execAsync(browserCmd);
  } catch {
    // Dự phòng mở bằng lệnh explorer nếu chrome.exe không nằm trong PATH
    await execAsync(`start msedge "${targetUrl}" --remote-debugging-port=${port} ${headlessFlag}`);
  }

  return {
    debugUrl: `http://localhost:${port}`,
  };
}

/**
 * Thu thập dữ liệu chi tiết sản phẩm từ link TikTok Shop.
 * Ưu tiên trích xuất dữ liệu có cấu trúc (JSON-LD, hydration props) nhúng trực tiếp trong HTML
 * để tối ưu tốc độ và không phụ thuộc thư viện cào web cồng kềnh.
 */
export async function scrapeTikTokProduct(productUrl: string): Promise<TikTokProductDetails> {
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

  const response = await fetch(productUrl, {
    headers: {
      "User-Agent": userAgent,
      "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`[Chrome DevTools Scraper] Không thể truy cập URL: ${productUrl} (Status: ${response.status})`);
  }

  const html = await response.text();

  // 1. Trích xuất productId từ URL
  const idMatch = productUrl.match(/product\/(\d+)/) || productUrl.match(/[?&]id=(\d+)/);
  const productId = idMatch ? idMatch[1] : `tt_${Date.now()}`;

  // 2. Trích xuất thông tin từ JSON-LD hoặc Microdata
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let jsonLdData: any = null;
  if (jsonLdMatch) {
    try {
      jsonLdData = JSON.parse(jsonLdMatch[1]);
    } catch {
      // Bỏ qua lỗi parse JSON-LD
    }
  }

  // 3. Fallback trích xuất tiêu đề bằng meta tags hoặc thẻ title
  const titleMatch =
    html.match(/<meta property="og:title" content="([^"]+)"/) ||
    html.match(/<title>([^<]+)<\/title>/);
  const rawTitle = jsonLdData?.name || (titleMatch ? titleMatch[1] : "Sản phẩm TikTok Shop");
  const cleanTitle = rawTitle.replace(/\s*\|\s*TikTok.*$/i, "").trim();

  // 4. Trích xuất giá bán
  const priceMatch =
    html.match(/"price":\s*"*(\d+[\d.,]*)"*/) ||
    html.match(/class="[^"]*price[^"]*">[^0-9]*([0-9.,]+)/i);
  const rawPrice = jsonLdData?.offers?.price || (priceMatch ? priceMatch[1] : "0");
  const price = parsePriceString(rawPrice);

  // 5. Trích xuất hình ảnh
  const imageMatch =
    html.match(/<meta property="og:image" content="([^"]+)"/) ||
    html.match(/"imageUrl":\s*"([^"]+)"/);
  const imageUrl = jsonLdData?.image || (imageMatch ? imageMatch[1] : "");

  // 6. Trích xuất tên Shop
  const shopMatch =
    html.match(/"sellerName":\s*"([^"]+)"/) ||
    html.match(/"shopName":\s*"([^"]+)"/) ||
    html.match(/class="[^"]*shop-name[^"]*">([^<]+)</i);
  const shopName = jsonLdData?.brand?.name || (shopMatch ? shopMatch[1].trim() : "TikTok Shop Merchant");

  // 7. Trích xuất lượt bán
  const soldMatch =
    html.match(/"soldCount":\s*(\d+)/) ||
    html.match(/Đã bán\s*([0-9.,kK+]+)/i);
  const soldCount = parseSoldCount(soldMatch ? soldMatch[1] : "0");

  return {
    productId,
    title: cleanTitle,
    price,
    currency: "VND",
    soldCount,
    shopName,
    productUrl,
    imageUrl,
    commissionEstimatePercent: 10, // shortcut: giá trị hoa hồng mặc định 10% nếu chưa có cookie affiliate partner, nâng cấp khi đồng bộ API Merchant Scout
    scrapedAt: new Date().toISOString(),
  };
}

function parsePriceString(str: any): number {
  if (typeof str === "number") return str;
  const digits = String(str).replace(/[^\d]/g, "");
  return Number(digits) || 0;
}

function parseSoldCount(str: string): number {
  const clean = str.trim().toLowerCase();
  if (clean.includes("k")) {
    return Math.round(parseFloat(clean.replace("k", "")) * 1000);
  }
  return Number(clean.replace(/[^\d]/g, "")) || 0;
}
