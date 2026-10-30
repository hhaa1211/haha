import type {
  IndustryNewsItem,
  NewToolProductItem,
  TrendingVideoItem,
  WeeklyAnglesBox,
  WideResearchReport,
} from "./types.ts";

/**
 * Lọc và kiểm tra điều kiện Trending Video:
 * - Views >= 5.000
 * - Nhãn [OUTLIER] nếu lượt xem gấp >= 3 lần trung bình kênh
 */
export function validateTrendingVideo(
  video: TrendingVideoItem,
  channelAvgViews: number
): TrendingVideoItem {
  const isOutlier = video.views >= channelAvgViews * 3;
  return {
    ...video,
    isOutlier,
  };
}

/**
 * Tổng hợp hộp "GÓC KHAI THÁC CHO TUẦN NÀY" từ dữ liệu 3 luồng quét.
 */
export function buildWeeklyAnglesBox(
  news: IndustryNewsItem[],
  videos: TrendingVideoItem[],
  tools: NewToolProductItem[]
): WeeklyAnglesBox {
  // Top 3 Content Opportunities
  const top3ContentOpportunities = [
    news[0] ? `Khai thác góc nhìn từ tin tức: ${news[0].title} (${news[0].contentAngle})` : "Chia sẻ cẩm nang tối ưu quy trình",
    videos[0] ? `Học hỏi góc tiếp cận viral từ video: ${videos[0].title}` : "Review so sánh top sản phẩm thịnh hành",
    tools[0] ? `Trải nghiệm thực tế công cụ/sản phẩm mới: ${tools[0].name}` : "Giải mã các sai lầm phổ biến người mới hay mắc",
  ];

  // Top 3 Formats nên tham khảo (ưu tiên video gắn nhãn OUTLIER)
  const outliers = videos.filter((v) => v.isOutlier);
  const top3FormatsToModel = [
    outliers[0]?.format || videos[0]?.format || "Trước & Sau (Before - After Transformation)",
    outliers[1]?.format || videos[1]?.format || "Từng bước thực chiến (Step-by-step Tutorial)",
    outliers[2]?.format || videos[2]?.format || "Thử thách 24h giải quyết vấn đề",
  ];

  // 1 Công cụ / Sản phẩm ưu tiên
  const priorityToolProduct = tools[0]
    ? `${tools[0].name}: ${tools[0].oneLineDescription} (${tools[0].officialUrl})`
    : "Sản phẩm chiến lược của tuần";

  return {
    top3ContentOpportunities,
    top3FormatsToModel,
    priorityToolProduct,
  };
}

/**
 * Định dạng Markdown Báo cáo Wide Research và Hộp Góc Khai Thác.
 */
export function formatWideResearchReport(report: WideResearchReport): string {
  const newsText = report.industryNews
    .map(
      (n, i) =>
        `${i + 1}. **${n.title}** (${n.publishDate})\n   - *Tóm tắt*: ${n.summary}\n   - *Lý do khán giả quan tâm*: ${n.audienceRelevance}\n   - *Góc khai thác*: ${n.contentAngle}\n   - *Nguồn*: ${n.sourceUrl}`
    )
    .join("\n\n");

  const videoText = report.trendingVideos
    .map(
      (v, i) =>
        `${i + 1}. **${v.title}** ${v.isOutlier ? "🔥 `[OUTLIER]`" : ""} - Kênh: ${v.channelName} (${v.platform})\n   - *Lượt xem*: ${v.views.toLocaleString()} | *Ngày đăng*: ${v.publishDate}\n   - *Hook 3s*: "${v.hookOpening}"\n   - *Format*: ${v.format} | *Lý do hiệu quả*: ${v.whyItWorks}\n   - *Điểm học hỏi*: ${v.takeawayForChannel}\n   - *Link*: ${v.videoUrl}`
    )
    .join("\n\n");

  const toolText = report.newTools
    .map(
      (t, i) =>
        `${i + 1}. **${t.name}**: ${t.oneLineDescription}\n   - *Lý do quan tâm*: ${t.whyAudienceCares}\n   - *Góc khai thác*: ${t.contentAngle}\n   - *Link chính thức*: ${t.officialUrl}`
    )
    .join("\n\n");

  return `
# 🌐 BÁO CÁO WIDE RESEARCH TRENDS (NGHIÊN CỨU XU HƯỚNG RỘNG)
**Niche**: ${report.niche} | **Ngày quét**: ${new Date().toLocaleDateString("vi-VN")}

---

## 1. Tin Tức Ngành Nổi Bật (5–6 Tin)
${newsText || "Không có tin tức mới xác minh được."}

---

## 2. Trending Videos (Lượt xem $\\ge$ 5.000)
${videoText || "Không có video xu hướng đủ điều kiện."}

---

## 3. Công Cụ / Sản Phẩm Mới (3 Mục)
${toolText || "Không có công cụ mới ghi nhận."}

---

### 💡 GÓC KHAI THÁC CHO TUẦN NÀY (Đầu Ra Bước 2 Chuyển Sang Bước 3)
- **Top 3 Cơ Hội Nội Dung**:
${report.weeklyAngles.top3ContentOpportunities.map((o) => `  - ${o}`).join("\n")}
- **Top 3 Format Nên Học Hỏi**:
${report.weeklyAngles.top3FormatsToModel.map((f) => `  - ${f}`).join("\n")}
- **Công Cụ / Sản Phẩm Ưu Tiên**:
  - ${report.weeklyAngles.priorityToolProduct}
`.trim();
}
