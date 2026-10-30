import { runCli } from "../../shared/cli-runner.ts";

export interface ProductAffiliateItem {
  id: string;
  name: string;
  price: number;
  commissionRate: number; // Ví dụ: 15 (%)
  commissionAmount: number; // Hoa hồng ước tính (VND)
  affiliateLink: string;
  merchantName: string;
  gmv?: number;
  notes?: string;
}

/**
 * Đọc danh sách sản phẩm, link affiliate và chính sách hoa hồng từ Google Sheets.
 */
export async function readProducts(
  spreadsheetId: string,
  range: string = "Sheet1!A2:H"
): Promise<ProductAffiliateItem[]> {
  const result = await runCli("gsheets", ["readonly", "read", spreadsheetId, range], { json: true });

  if (!result || !Array.isArray(result.values)) {
    return [];
  }

  return result.values.map((row: any[]) => ({
    id: row[0] ?? "",
    name: row[1] ?? "",
    price: Number(row[2]) || 0,
    commissionRate: Number(row[3]) || 0,
    commissionAmount: Number(row[4]) || 0,
    affiliateLink: row[5] ?? "",
    merchantName: row[6] ?? "",
    gmv: Number(row[7]) || 0,
    notes: row[8] ?? "",
  }));
}

/**
 * Thêm một sản phẩm mới vào Google Sheets.
 */
export async function appendProduct(
  spreadsheetId: string,
  product: ProductAffiliateItem,
  sheetName: string = "Sheet1"
): Promise<any> {
  const rowValue = formatRow(product);
  return runCli("gsheets", ["mutate", "append", spreadsheetId, sheetName, rowValue], { json: true });
}

/**
 * Ghi đè danh sách sản phẩm vào phạm vi chỉ định.
 */
export async function writeProducts(
  spreadsheetId: string,
  products: ProductAffiliateItem[],
  range: string = "Sheet1!A2:H"
): Promise<any> {
  if (products.length === 0) return;
  const serialized = products.map(formatRow).join("|");
  return runCli("gsheets", ["mutate", "write", spreadsheetId, range, serialized], { json: true });
}

/**
 * Tạo bảng tính Google Sheets mới với tiêu đề mặc định cho TikTok Affiliate.
 */
export async function createAffiliateSheet(title: string): Promise<{ id: string; url: string }> {
  const created = await runCli("gsheets", ["mutate", "create", title], { json: true });
  const spreadsheetId = created.spreadsheetId || created.id;

  // Khởi tạo dòng tiêu đề header
  const headers = "ID,Tên sản phẩm,Giá niêm yết (VND),Hoa hồng (%),Tiền hoa hồng (VND),Link Affiliate,Nhà bán hàng (Merchant),GMV,Ghi chú";
  await runCli("gsheets", ["mutate", "write", spreadsheetId, "Sheet1!A1:I1", headers]);

  return {
    id: spreadsheetId,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/**
 * Đọc dữ liệu thô từ một vùng ô (range) trên Google Sheets.
 */
export async function readRange(
  spreadsheetId: string,
  range: string
): Promise<any[][]> {
  const result = await runCli("gsheets", ["readonly", "read", spreadsheetId, range], { json: true });
  if (!result) return [];
  if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
    return result;
  }
  return result.values || [];
}

/**
 * Nối các dòng dữ liệu (rows) vào cuối một tab trên Google Sheets.
 */
export async function appendRows(
  spreadsheetId: string,
  sheetName: string,
  rows: (string | number)[][]
): Promise<any> {
  if (!rows || rows.length === 0) return;
  const serialized = rows.map((r) => r.map(formatCellValue).join(",")).join("|");
  return runCli("gsheets", ["mutate", "append", spreadsheetId, sheetName, serialized], { json: true });
}

/**
 * Ghi dữ liệu vào một vùng ô (range) cụ thể trên Google Sheets.
 */
export async function writeRange(
  spreadsheetId: string,
  range: string,
  rows: (string | number)[][]
): Promise<any> {
  if (!rows || rows.length === 0) return;
  const serialized = rows.map((r) => r.map(formatCellValue).join(",")).join("|");
  return runCli("gsheets", ["mutate", "write", spreadsheetId, range, serialized], { json: true });
}

function formatCellValue(val: any): string {
  return String(val ?? "")
    .replace(/%/g, "%%")
    .replace(/,/g, "\\,")
    .replace(/\|/g, "/");
}

function formatRow(p: ProductAffiliateItem): string {
  const clean = (val: any) =>
    String(val ?? "")
      .replace(/%/g, "%%")
      .replace(/,/g, "\\,")
      .replace(/\|/g, "/");
  return [
    clean(p.id),
    clean(p.name),
    clean(p.price),
    clean(p.commissionRate),
    clean(p.commissionAmount || (p.price * p.commissionRate) / 100),
    clean(p.affiliateLink),
    clean(p.merchantName),
    clean(p.gmv || 0),
    clean(p.notes || ""),
  ].join(",");
}
