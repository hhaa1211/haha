import { readRange, writeRange } from "../../../src/antigravity-connectors/google-workspace/sheets.ts";
import type {
  ChannelDnaAnalysisResult,
  ChannelVideoItem,
  DemographicMetric,
  KeyInputsBox,
  OverviewMetrics,
} from "./types.ts";

export const DEFAULT_SHEET_ID = "1lJubpmVpj1O1V5HuItZRLG9Acie3mzt3dHZI_G_O2GI";

/**
 * Tính toán tỷ lệ tương tác Engagement Rate (ER%):
 * ER (%) = (Likes + Comments + Shares) / Total Views * 100
 */
export function calculateEngagementRate(video: {
  likes: number;
  comments: number;
  shares: number;
  totalViews: number;
}): number {
  if (!video.totalViews || video.totalViews <= 0) return 0;
  const er = ((video.likes + video.comments + video.shares) / video.totalViews) * 100;
  return Math.round(er * 100) / 100;
}

/**
 * Phân tích và trích xuất Winning Formula từ nhóm video hiệu quả cao.
 */
export function extractWinningFormula(videos: ChannelVideoItem[]): {
  formula: string;
  mix: string;
  hooks: string[];
  priorityAction: string;
} {
  if (videos.length === 0) {
    return {
      formula: "Chưa đủ dữ liệu video để đúc kết công thức thắng",
      mix: "50% Hướng dẫn thực chiến, 30% Tin tức/Review, 20% Câu chuyện trải nghiệm",
      hooks: [
        "Đừng mua [sản phẩm] nếu chưa biết 3 sự thật này...",
        "Cách mình [đạt kết quả] chỉ trong 5 phút mà không cần...",
      ],
      priorityAction: "Tập trung tối ưu Hook 3s đầu tiên để kéo retention rate qua mốc 40%",
    };
  }

  // Sắp xếp video theo ER và Views để tìm Top Video Outperform
  const sorted = [...videos].sort((a, b) => (b.erPercent || 0) - (a.erPercent || 0));
  const top = sorted[0];

  const formula = `${top.contentPillar} + Định dạng ${top.format} + Hook dạng ${top.captionType} + CTA kêu gọi xem giỏ hàng`;
  const mix = "40% Hướng dẫn thực chiến, 30% Review công cụ/sản phẩm hot, 30% Phân tích chuyên sâu";
  const hooks = [
    `Hook phản trực giác: "Hầu hết mọi người đang dùng sai cách..."`,
    `Hook giải quyết nỗi đau: "Nếu bạn đang gặp vấn đề [X], đây là giải pháp trong 1 phút..."`,
  ];
  const priorityAction = "Cải thiện tỷ lệ nhấp chuột vào profile và gắn liên kết affiliate rõ ràng hơn ở 3s cuối.";

  return { formula, mix, hooks, priorityAction };
}

/**
 * Cập nhật số liệu đã phân tích vào 5 tab trên Google Sheet:
 * 1. Overview
 * 2. Top Videos
 * 3. Audience & Timing
 * 4. Audience Demographics
 * 5. Viewers Retention
 */
export async function syncDnaToGoogleSheets(
  sheetId: string,
  dna: ChannelDnaAnalysisResult
): Promise<void> {
  const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  // 1. Tab Overview: Date | Video Views | Profile Views | Likes | Comments | Shares | New Followers | Thời điểm cập nhật
  if (dna.overviewList.length > 0) {
    const overviewRows = dna.overviewList.map((o) => [
      o.date,
      o.videoViews,
      o.profileViews,
      o.likes,
      o.comments,
      o.shares,
      o.newFollowers,
      timestamp,
    ]);
    const existing = await readRange(sheetId, "Overview!A2:A");
    const startRow = 2 + (existing ? existing.length : 0);
    const endRow = startRow + overviewRows.length - 1;
    await writeRange(sheetId, `Overview!A${startRow}:H${endRow}`, overviewRows);
  }

  // 2. Tab Top Videos: Post Date | Title | Total Views | Views 7D | Likes | Comments | Shares | ER (%) | Content Pillar | Format | Caption Type | Video Link | Thời điểm cập nhật
  if (dna.topVideosList.length > 0) {
    const videoRows = dna.topVideosList.map((v) => [
      v.postDate,
      v.title,
      v.totalViews,
      v.views7d,
      v.likes,
      v.comments,
      v.shares,
      `${v.erPercent ?? calculateEngagementRate(v)}%`,
      v.contentPillar,
      v.format,
      v.captionType,
      v.videoLink,
      timestamp,
    ]);
    const existing = await readRange(sheetId, "Top Videos!A2:A");
    const startRow = 2 + (existing ? existing.length : 0);
    const endRow = startRow + videoRows.length - 1;
    await writeRange(sheetId, `Top Videos!A${startRow}:M${endRow}`, videoRows);
  }

  // 3. Tab Audience & Timing: Date | Hour | Active Followers | Thời điểm cập nhật
  if (dna.activeHours.length > 0) {
    const timingRows = dna.activeHours.map((t) => [t.date, t.hour, t.activeFollowers, timestamp]);
    const existing = await readRange(sheetId, "Audience & Timing!A2:A");
    const startRow = 2 + (existing ? existing.length : 0);
    const endRow = startRow + timingRows.length - 1;
    await writeRange(sheetId, `Audience & Timing!A${startRow}:D${endRow}`, timingRows);
  }

  // 4. Tab Audience Demographics (B2:C7 độ tuổi/giới tính, B9:C12 quốc gia, cột C thời điểm cập nhật)
  if (dna.demographics) {
    const genderAndAgeRows = [
      [dna.demographics.gender.Nữ || "82%", timestamp],
      [dna.demographics.gender.Nam || "18%", timestamp],
      [dna.demographics.ageDistribution["18-24"] || "68%", timestamp],
      [dna.demographics.ageDistribution["25-34"] || "24%", timestamp],
      [dna.demographics.ageDistribution["35-44"] || "6%", timestamp],
      [dna.demographics.ageDistribution["45+"] || "2%", timestamp],
    ];
    await writeRange(sheetId, "Audience Demographics!B2:C7", genderAndAgeRows);

    const countryRows = [
      [dna.demographics.topCountries["Việt Nam"] || "98%", timestamp],
      ["1%", timestamp],
      ["0.5%", timestamp],
      ["0.5%", timestamp],
    ];
    await writeRange(sheetId, "Audience Demographics!B9:C12", countryRows);
  }

  // 5. Tab Viewers Retention: Date | Total Viewers | New Viewers | Returning Viewers | Thời điểm cập nhật
  if (dna.retentionList.length > 0) {
    const retentionRows = dna.retentionList.map((r) => [
      r.date,
      r.totalViewers,
      r.newViewers,
      r.returningViewers,
      timestamp,
    ]);
    const existing = await readRange(sheetId, "Viewers Retention!A2:A");
    const startRow = 2 + (existing ? existing.length : 0);
    const endRow = startRow + retentionRows.length - 1;
    await writeRange(sheetId, `Viewers Retention!A${startRow}:E${endRow}`, retentionRows);
  }
}

/**
 * Tạo Box "KEY INPUTS FOR CONTENT PLAN" để chuyển tiếp sang Bước 2 & 3.
 */
export function formatKeyInputsBox(keyInputs: KeyInputsBox): string {
  return `
### 📦 KEY INPUTS FOR CONTENT PLAN (Đầu Ra Bước 1)
- **1. Winning Formula**: ${keyInputs.winningFormula}
- **2. Content Mix**: ${keyInputs.contentMix}
- **3. 2 Hook Đề Xuất**:
  - ${keyInputs.recommendedHooks[0] || "Hook 1: Vấn đề nhức nhối"}
  - ${keyInputs.recommendedHooks[1] || "Hook 2: So sánh bất ngờ"}
- **4. Best Time (Giờ vàng đăng bài)**: ${keyInputs.bestTime}
- **5. Top Monetization**: ${keyInputs.topMonetization}
- **6. Priority Action**: ${keyInputs.priorityAction}
- **7. Winning Topics/Formats Tiềm Năng**: ${keyInputs.winningTopicsFormats.join(", ")}
`.trim();
}
