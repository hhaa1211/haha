import { runCli } from "../../shared/cli-runner.ts";

export interface TikTokVideoScript {
  title: string;
  productName: string;
  hook3s: string; // Móc câu giữ chân 3 giây đầu
  body: string; // Thân bài: nêu vấn đề, trải nghiệm thực tế và giải pháp
  callToAction: string; // Kêu gọi nhấp vào giỏ hàng vàng
  targetDurationSeconds?: number; // Thời lượng mục tiêu (ví dụ: 30s - 45s)
  productAffiliateLink?: string;
  visualNotes?: string; // Ghi chú góc máy, text overlay, âm thanh
}

/**
 * Tạo mới một Google Doc để chứa kịch bản video TikTok.
 */
export async function createScriptDoc(
  title: string,
  folderId?: string
): Promise<{ docId: string; url: string }> {
  const args = ["mutate", "create", "--title", title];
  if (folderId) {
    args.push("--folder", folderId);
  }

  const result = await runCli("gdocs", args, { json: true });
  const docId = result.documentId || result.id;

  return {
    docId,
    url: `https://docs.google.com/document/d/${docId}/edit`,
  };
}

/**
 * Ghi và cấu trúc kịch bản video TikTok hoàn chỉnh lên Google Docs.
 */
export async function saveVideoScript(docId: string, script: TikTokVideoScript): Promise<void> {
  // Tiêu đề & Thông tin cơ bản
  await runCli("gdocs", ["mutate", "heading", docId, `Kịch Bản TikTok: ${script.title}`, "--level", "1"]);
  await runCli("gdocs", [
    "mutate",
    "append",
    docId,
    `Sản phẩm: ${script.productName}\nThời lượng dự kiến: ${script.targetDurationSeconds ?? 35} giây\nLink Affiliate: ${script.productAffiliateLink ?? "N/A"}\nNgày tạo: ${new Date().toLocaleDateString("vi-VN")}\n\n`,
  ]);

  // Hook 3 Giây Đầu
  await runCli("gdocs", ["mutate", "heading", docId, "1. HOOK 3 GIÂY ĐẦU (STOP THE SCROLL)", "--level", "2"]);
  await runCli("gdocs", ["mutate", "append", docId, `${script.hook3s}\n\n`]);

  // Thân bài kịch bản
  await runCli("gdocs", ["mutate", "heading", docId, "2. NỘI DUNG CHÍNH (VẤN ĐỀ & GIẢI PHÁP)", "--level", "2"]);
  await runCli("gdocs", ["mutate", "append", docId, `${script.body}\n\n`]);

  // Call To Action
  await runCli("gdocs", ["mutate", "heading", docId, "3. KÊU GỌI HÀNH ĐỘNG (CTA)", "--level", "2"]);
  await runCli("gdocs", ["mutate", "append", docId, `${script.callToAction}\n\n`]);

  // Ghi chú hình ảnh & âm thanh
  if (script.visualNotes) {
    await runCli("gdocs", ["mutate", "heading", docId, "4. GHI CHÚ HÌNH ẢNH & VISUAL", "--level", "2"]);
    await runCli("gdocs", ["mutate", "append", docId, `${script.visualNotes}\n`]);
  }
}

/**
 * Hàm tiện ích: vừa tạo tài liệu vừa lưu nội dung kịch bản.
 */
export async function createAndSaveScript(
  script: TikTokVideoScript,
  folderId?: string
): Promise<{ docId: string; url: string }> {
  const { docId, url } = await createScriptDoc(`[Kịch Bản TikTok] ${script.title}`, folderId);
  await saveVideoScript(docId, script);
  return { docId, url };
}

/**
 * Đọc nội dung văn bản thuần của kịch bản từ Google Docs.
 */
export async function readScriptDoc(docId: string): Promise<string> {
  return runCli("gdocs", ["readonly", "read", docId]);
}
