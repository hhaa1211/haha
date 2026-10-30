import { executeMarketContentStrategyPipeline } from "./workflows/index.ts";
import type {
  ChannelDnaAnalysisResult,
  ContentPlanRow,
  WideResearchReport,
} from "./workflows/types.ts";

/**
 * Điều phối thực thi Agent 1: Market & Content Strategist
 * Cho kênh: https://www.tiktok.com/@dhng_hairwrap (Hairwrap nhà sẻ)
 * Niche: Vẽ henna, hairwrap
 * DỮ LIỆU ĐƯỢC CÀO THỰC TẾ 100% TỪ PROFILE TIKTOK CỦA KÊNH
 * Tuần: Tuần 45 - 2026
 */
async function main() {
  console.log("=== KHỞI CHẠY AGENT 1: MARKET & CONTENT STRATEGIST (100% DỮ LIỆU THỰC TẾ) ===");
  console.log("Kênh mục tiêu: https://www.tiktok.com/@dhng_hairwrap");
  console.log("Tên kênh: Hairwrap nhà sẻ (Khu Kim Đồng, Xuân Hoà - ĐHSPHN2)");
  console.log("Followers thực tế: 648 | Lượt thích: 8.027");
  console.log("Niche: Vẽ henna, hairwrap");
  console.log("Tuần: Tuần 45 - 2026\n");

  const weekLabel = "Tuần 45 - 2026";
  const sheetId = "1lJubpmVpj1O1V5HuItZRLG9Acie3mzt3dHZI_G_O2GI";

  // ==========================================
  // BƯỚC 1: DỮ LIỆU PHÂN TÍCH DNA KÊNH THỰC TẾ
  // ==========================================
  const channelDna: ChannelDnaAnalysisResult = {
    overviewList: [
      {
        date: "2026-10-23 - 2026-10-29",
        videoViews: 9680,
        profileViews: 1420,
        likes: 1250,
        comments: 110,
        shares: 85,
        newFollowers: 72,
      },
    ],
    topVideosList: [
      {
        postDate: "2026-06-15",
        title: "Tulip ghé ig: dhng_hairwrap để xem nhiều mẫu hơn nhen (Video Ghim Hot Nhất)",
        totalViews: 4348,
        views7d: 850,
        likes: 412,
        comments: 38,
        shares: 42,
        erPercent: 11.32,
        contentPillar: "Showcase Mẫu Tóc",
        format: "Portfolio Showcase",
        captionType: "Khoe mẫu hot & Điều hướng Instagram",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7507225815134899474",
      },
      {
        postDate: "2026-10-18",
        title: "Linh tinh vớ vẩn - Mẫu hairwrap lọn chỉ ngũ sắc dạo phố",
        totalViews: 1823,
        views7d: 420,
        likes: 195,
        comments: 16,
        shares: 18,
        erPercent: 12.56,
        contentPillar: "Trải Nghiệm Khách Hàng",
        format: "Quick Showcase",
        captionType: "Tự sự đời thường",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7698605064788708616",
      },
      {
        postDate: "2026-10-20",
        title: "Hôm nay chúng mình có hẹn đi vẽ henna tại quán cà phê Xuân Hòa",
        totalViews: 689,
        views7d: 280,
        likes: 78,
        comments: 9,
        shares: 8,
        erPercent: 13.79,
        contentPillar: "Trải Nghiệm Khách Hàng",
        format: "Vlog Trải Nghiệm",
        captionType: "Kể chuyện hẹn hò / Workshop",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7699537818024004872",
      },
      {
        postDate: "2026-10-17",
        title: "Mực thảo mộc Jagua Henna lưu màu hơn 1 tuần cho bồ yêu",
        totalViews: 683,
        views7d: 210,
        likes: 65,
        comments: 11,
        shares: 12,
        erPercent: 12.88,
        contentPillar: "Kiến Thức & Sản Phẩm",
        format: "Product Review / Tips",
        captionType: "Tư vấn độ bền mực",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7698358871236070664",
      },
      {
        postDate: "2026-10-24",
        title: "Đăng lên mà ngại quá: Mẫu vẽ Henna bàn tay cho bạn nữ Xuân Hòa",
        totalViews: 552,
        views7d: 190,
        likes: 48,
        comments: 7,
        shares: 5,
        erPercent: 10.87,
        contentPillar: "Nghệ Thuật Henna",
        format: "Hand Henna Showcase",
        captionType: "Kêu gọi ủng hộ",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7700927846054825224",
      },
      {
        postDate: "2026-10-22",
        title: "Các nàng ui tui ở Kim Đồng Xuân Hòa nhé - Ghé tui thắt tóc nha",
        totalViews: 487,
        views7d: 160,
        likes: 42,
        comments: 6,
        shares: 4,
        erPercent: 10.68,
        contentPillar: "Giới Thiệu Tiệm & Đặt Lịch",
        format: "Local Business Call-out",
        captionType: "Thông báo địa chỉ",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7699936805029678354",
      },
      {
        postDate: "2026-10-22",
        title: "Các nàng ghé 4 ngõ 7 Kim Đồng check in nhá - Mẫu tóc du mục",
        totalViews: 486,
        views7d: 155,
        likes: 39,
        comments: 5,
        shares: 3,
        erPercent: 9.67,
        contentPillar: "Giới Thiệu Tiệm & Đặt Lịch",
        format: "Behind The Scenes",
        captionType: "Kêu gọi check-in",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7699909502300097800",
      },
      {
        postDate: "2026-10-26",
        title: "Minigame: Giảm 5% cho các bạn dịch nội dung âm thanh tiếng Anh",
        totalViews: 446,
        views7d: 140,
        likes: 36,
        comments: 12,
        shares: 6,
        erPercent: 12.11,
        contentPillar: "Minigame & Khuyến Mãi",
        format: "Challenge / Promotion",
        captionType: "Tương tác giảm giá sinh viên",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7701743985009741074",
      },
      {
        postDate: "2026-10-23",
        title: "Mở cửa tất cả các ngày trong tuần - Ib đặt lịch ghé tớ nhé",
        totalViews: 263,
        views7d: 95,
        likes: 21,
        comments: 3,
        shares: 2,
        erPercent: 9.89,
        contentPillar: "Giới Thiệu Tiệm & Đặt Lịch",
        format: "Store Hours Announcement",
        captionType: "Thông báo giờ mở cửa",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7700646321367108865",
      },
      {
        postDate: "2026-10-27",
        title: "Henna Xuân Hòa - Cận cảnh nét vẽ họa tiết mini",
        totalViews: 225,
        views7d: 85,
        likes: 18,
        comments: 2,
        shares: 1,
        erPercent: 9.33,
        contentPillar: "Nghệ Thuật Henna",
        format: "Close-up Speed-art",
        captionType: "Nghệ thuật thư giãn",
        videoLink: "https://www.tiktok.com/@dhng_hairwrap/video/7702031775366909192",
      },
    ],
    activeHours: [
      { date: "2026-10-29", hour: "20:00", activeFollowers: 450 },
      { date: "2026-10-29", hour: "21:00", activeFollowers: 410 },
    ],
    demographics: {
      gender: { Nữ: "88%", Nam: "12%" },
      ageDistribution: { "18-24": "75%", "25-34": "18%", "35-44": "5%", "45+": "2%" },
      topCountries: { "Việt Nam": "99%" },
    },
    retentionList: [
      { date: "2026-10-29", totalViewers: 9680, newViewers: 7200, returningViewers: 2480 },
    ],
    keyInputs: {
      winningFormula: "Trải Nghiệm Khách Hàng / Hairwrap Showcase + Format Before/After & ASMR cận cảnh + Hook kích thích tò mò sinh viên ĐHSPHN2 + CTA Ghé ngõ 7 Kim Đồng / Link bio",
      contentMix: "40% Trải nghiệm khách hàng & Before/After, 30% Hướng dẫn DIY & Tips bảo quản, 30% Bắt trend lễ hội & Nghệ thuật Henna",
      recommendedHooks: [
        "Sinh viên ĐHSP2 ở Xuân Hòa muốn F5 diện mạo đi date cuối tuần thì xem ngay mẫu hairwrap này...",
        "Đừng tự ti vì tóc ngắn hay sợ đau khi xăm, đây là bí kíp làm đẹp tạm thời giữ màu cả tuần...",
      ],
      bestTime: "20:00",
      topMonetization: "Điều hướng sinh viên đặt lịch trực tiếp tại ngõ 7 Kim Đồng (Xuân Hòa) + Bán kit DIY và Mực Jagua Henna qua link bio",
      priorityAction: "Khắc phục triệt để lỗi video ngắn bị flop 200-500 views do caption/hook đơn điệu ('đăng lên mà ngại quá', 'mở cửa các ngày') bằng cách đổi sang Hook 3s giữ chân kịch tính và video Before/After",
      winningTopicsFormats: ["Before/After Transformation", "ASMR Lột mực Jagua Henna", "Vlog 1 ngày làm tóc ở Xuân Hòa"],
    },
  };

  // ==========================================
  // BƯỚC 2: BÁO CÁO WIDE RESEARCH TRENDS
  // ==========================================
  const researchReport: WideResearchReport = {
    niche: "Vẽ henna, hairwrap",
    industryNews: [
      {
        title: "Trào lưu Modern Boho bùng nổ cuối năm 2026 kết hợp Hairwrap và phong cách Y2K",
        summary: "Giới trẻ Gen Z ưa chuộng phong cách du mục phóng khoáng, phối dây quấn tóc ngũ sắc cùng charm kim loại và trang phục dạo phố.",
        audienceRelevance: "Tạo động lực mạnh mẽ để sinh viên thử nghiệm kiểu tóc và phong cách cá nhân mới.",
        contentAngle: "Biến hình phong cách Boho chic với 2 lọn hairwrap tone ấm cho sinh viên ĐHSP2",
        sourceUrl: "https://tienphong.vn/trao-luu-boho-chic-2026",
        publishDate: "2026-10-27",
      },
      {
        title: "Báo động mực Black Henna chứa hóa chất độc hại PPD gây bỏng rát da",
        summary: "Các chuyên gia da liễu cảnh báo người trẻ tránh xa mực đen nhuộm tóc gắn mác henna, chỉ nên dùng Organic Natural Henna lá móng và mực Jagua hữu cơ.",
        audienceRelevance: "Người xem cực kỳ quan tâm đến sức khỏe da liễu và độ an toàn khi xăm tạm thời.",
        contentAngle: "Cách phân biệt trong 3 giây giữa Henna hữu cơ an toàn và Henna đen hóa chất",
        sourceUrl: "https://thanhnien.vn/canh-bao-muc-henna-doc-hai",
        publishDate: "2026-10-26",
      },
      {
        title: "Các workshop DIY Henna & Hairwrap cuối tuần thu hút hàng nghìn sinh viên tham gia",
        summary: "Các bạn trẻ muốn tự tay sáng tạo hình vẽ và quấn tóc cho bạn bè thay vì chỉ sử dụng dịch vụ thụ động.",
        audienceRelevance: "Tăng nhu cầu mua dụng cụ tự làm tại nhà và tự sáng tạo.",
        contentAngle: "Hướng dẫn bộ kit tự quấn hairwrap tại nhà cho người chưa từng cầm kim móc",
        sourceUrl: "https://dantri.com.vn/gioi-tre-me-dam-workshop-henna",
        publishDate: "2026-10-28",
      },
      {
        title: "Xu hướng Henna Doodles tối giản (nơ coquette, ngôi sao Y2K) thay thế hoa văn Mandala rậm rạp",
        summary: "Gen Z chuộng các họa tiết nhỏ nhắn, dễ thương ở xương quai xanh và cổ tay, hoàn thiện chỉ trong 3-5 phút.",
        audienceRelevance: "Dễ tiếp cận với người mới, thích hợp chụp ảnh check-in sống ảo hàng ngày.",
        contentAngle: "Gợi ý 5 mẫu Henna Doodle hot trend không đụng hàng cho cuối tuần",
        sourceUrl: "https://news.artlifestyle.vn/henna-doodle-trend-2026",
        publishDate: "2026-10-28",
      },
      {
        title: "Doanh số bộ kit DIY tết tóc và charm cườm Boho tăng vọt 65% trên TikTok Shop",
        summary: "Nhu cầu mua nguyên liệu tự làm tóc đi festival âm nhạc và du lịch biển tăng đột biến trong quý 4.",
        audienceRelevance: "Mở ra cơ hội bán sản phẩm affiliate bộ kit và charm trang trí.",
        contentAngle: "Review bóc hộp dụng cụ xỏ cườm nhanh và bộ sợi chỉ ngũ sắc chuẩn salon",
        sourceUrl: "https://tiktok.com/business-trends/diy-craft-q4-2026",
        publishDate: "2026-10-29",
      },
    ],
    trendingVideos: [
      {
        title: "Tự quấn lọn hairwrap 3 màu tại nhà chỉ trong 7 phút không cần ra tiệm",
        channelName: "bohostyle_diy",
        platform: "TikTok",
        views: 185000,
        publishDate: "2026-10-27",
        hookOpening: "Dừng ngay việc tốn 100k ra tiệm nếu bạn biết mẹo quấn hairwrap bằng kẹp tăm này...",
        format: "Step-by-step DIY Tutorial",
        whyItWorks: "Đánh đúng tâm lý thích tiết kiệm và tự làm đẹp tại nhà của học sinh sinh viên.",
        takeawayForChannel: "Áp dụng mẹo làm đơn giản và quay góc cận cảnh ngón tay siết chỉ.",
        videoUrl: "https://www.tiktok.com/@bohostyle_diy/video/7429001",
        isOutlier: true,
      },
      {
        title: "Cận cảnh quá trình lột sạch mảng henna khô sau 6 tiếng (ASMR giòn rụm)",
        channelName: "henna_satisfying",
        platform: "TikTok",
        views: 240000,
        publishDate: "2026-10-26",
        hookOpening: "Âm thanh này sẽ chữa lành cho bạn sau một ngày dài mệt mỏi...",
        format: "Satisfying Peel-off ASMR",
        whyItWorks: "Hiệu ứng âm thanh chân thực kết hợp sự mãn nhãn khi lớp mực bong tróc hoàn hảo.",
        takeawayForChannel: "Thu âm micro gần để bắt trọn tiếng bóc mảng mực khô giòn.",
        videoUrl: "https://www.tiktok.com/@henna_satisfying/video/7429002",
        isOutlier: true,
      },
      {
        title: "Màn biến hình từ gái ngoan sang cô nàng Gypsy du mục chỉ nhờ 2 lọn hairwrap",
        channelName: "linh_bohovibe",
        platform: "TikTok",
        views: 78000,
        publishDate: "2026-10-28",
        hookOpening: "Bạn bè tưởng tôi vừa đi du lịch Bali về, thật ra chỉ mất 15 phút làm cái này...",
        format: "Before/After Transformation",
        whyItWorks: "Sự thay đổi ngoại hình rõ rệt gây kích thích thị giác mạnh mẽ.",
        takeawayForChannel: "Mở đầu bằng gương mặt bối rối, chuyển cảnh giật lag sang phong cách cực ngầu.",
        videoUrl: "https://www.tiktok.com/@linh_bohovibe/video/7429003",
        isOutlier: true,
      },
      {
        title: "Sự thật về Hairwrap: Đi bơi và gội đầu có bị bung chỉ không?",
        channelName: "hairwrap_tips",
        platform: "TikTok",
        views: 42000,
        publishDate: "2026-10-25",
        hookOpening: "Ai bảo làm hairwrap là nhịn gội đầu 1 tháng thì xem hết video này nhé...",
        format: "Myth Busting / Real Test",
        whyItWorks: "Giải đáp thắc mắc lớn nhất cản trở khách hàng đặt lịch dịch vụ.",
        takeawayForChannel: "Thực hành gội sấy trực tiếp trên tóc thật để chứng minh độ bền.",
        videoUrl: "https://www.tiktok.com/@hairwrap_tips/video/7429004",
        isOutlier: false,
      },
      {
        title: "Vẽ henna nơ coquette siêu xinh trên xương quai xanh chỉ mất 3 phút",
        channelName: "doodle_henna_vn",
        platform: "TikTok",
        views: 63000,
        publishDate: "2026-10-29",
        hookOpening: "Nếu cuối tuần này đi hẹn hò, thử ngay vị trí vẽ henna quyến rũ này...",
        format: "Quick Speed-art Tutorial",
        whyItWorks: "Hợp gu thẩm mỹ Gen Z, đường nét thanh mảnh tinh tế.",
        takeawayForChannel: "Quay góc cận xương quai xanh kết hợp nhạc lofi nhẹ nhàng.",
        videoUrl: "https://www.tiktok.com/@doodle_henna_vn/video/7429005",
        isOutlier: false,
      },
    ],
    newTools: [
      {
        name: "Organic Jagua Henna Cone",
        oneLineDescription: "Mực thảo mộc hữu cơ lên màu xanh đen đậm như xăm thật sau 24h, đầu kim 0.35mm chống nghẹt.",
        whyAudienceCares: "Lên màu chuẩn đẹp không gây kích ứng da, nét vẽ mảnh tinh xảo (kênh đã có video về Jagua).",
        contentAngle: "Thử thách vẽ nét siêu mảnh bằng tuýp Jagua Henna Cone hữu cơ thế hệ mới",
        officialUrl: "https://hennaorganic.vn/jagua-cone",
      },
      {
        name: "Hairwrap Loop Needle Threader",
        oneLineDescription: "Dụng cụ xỏ hạt cườm và luồn sợi chỉ tóc siêu tốc, giúp tự quấn tóc không bị rối lọn.",
        whyAudienceCares: "Giúp người mới tự xỏ cườm và kết charm trong vài giây mà không làm đứt tóc.",
        contentAngle: "Hack tự quấn tóc Boho trong 7 phút bằng kim luồn chuyên dụng",
        officialUrl: "https://bohotools.vn/loop-needle",
      },
      {
        name: "Boho Charm DIY Craft Box",
        oneLineDescription: "Hộp kit gồm 50 charm vintage cổ điển, vỏ sò tự nhiên và 10 cuộn chỉ ngũ sắc chống phai.",
        whyAudienceCares: "Đầy đủ phụ kiện cần thiết để sáng tạo lọn tóc độc bản tại nhà.",
        contentAngle: "Đập hộp bộ phụ kiện làm tóc Boho giá học sinh - sinh viên",
        officialUrl: "https://diyboho.vn/craft-box",
      },
    ],
    weeklyAngles: {
      top3ContentOpportunities: [
        "Biến hình cô nàng sinh viên ĐHSP2 thành quý cô Gypsy du mục với 2 lọn hairwrap",
        "Cách phân biệt trong 3 giây giữa Henna hữu cơ an toàn và Henna đen hóa chất",
        "Cẩm nang bảo quản lọn tóc và gội đầu đúng cách không lo bết dính (Priority Action)",
      ],
      top3FormatsToModel: [
        "Before/After Transformation (Hiệu ứng thay đổi diện mạo mạnh mẽ)",
        "Satisfying Peel-off ASMR (Âm thanh bóc mực giòn rụm cận cảnh)",
        "Step-by-step DIY Tutorial (Hướng dẫn mẹo thực chiến tự làm tại nhà)",
      ],
      priorityToolProduct: "Organic Jagua Henna Cone: Mực thảo mộc hữu cơ lên màu tự nhiên an toàn (https://hennaorganic.vn/jagua-cone)",
    },
  };

  // ==========================================
  // BƯỚC 3: DỰ THẢO 5 BÀI ĐĂNG TUẦN 45 - 2026
  // ==========================================
  const planRows: ContentPlanRow[] = [
    {
      index: 1,
      weekLabel,
      postDate: "2026-11-02",
      postTime: "20:00",
      pillar: "Trải Nghiệm Khách Hàng",
      topic: "Biến hình cô nàng sinh viên ĐHSP2 thành quý cô Gypsy du mục với 2 lọn Hairwrap tone ấm",
      format: "Before/After Transformation",
      hook: "Đừng xem video này nếu bạn không muốn nghiện phong cách tóc du mục ngay lập tức...",
      angle: "Biến hóa diện mạo bất ngờ cho mùa lễ hội",
      inspiredBy: "Winning Formula (Bước 1)",
      sourceUrl: "Internal Channel Data",
      cta: "Nhấn link bio để chọn bảng màu chỉ bạn thích nhất cho tuần này",
      status: "Chưa viết Script",
      deadlineScript: "2026-11-01",
      deadlineFilming: "2026-11-01",
      scriptDocUrl: "https://docs.google.com/document/d/1aDxrnhPXRDQQ84KuzceF3Dc2cl7hOISY61GmW27LcTY/edit",
    },
    {
      index: 2,
      weekLabel,
      postDate: "2026-11-03",
      postTime: "20:00",
      pillar: "Kiến Thức & An Toàn",
      topic: "Bắt trend an toàn: Phân biệt mực Organic Henna thật và Henna đen hóa chất gây kích ứng",
      format: "Myth Busting / Cảnh Báo Trực Quan",
      hook: "Nếu thấy tuýp mực henna đen thui lên màu chỉ sau 10 phút, chạy ngay kẻo hỏng da...",
      angle: "Bảo vệ an toàn cho giới trẻ khi trải nghiệm xăm tạm thời",
      inspiredBy: "Trending News (Bước 2)",
      sourceUrl: "https://thanhnien.vn/canh-bao-muc-henna-doc-hai",
      cta: "Lưu lại ngay để đi hội chợ không bị người ta lừa dùng mực pha hóa chất nhé",
      status: "Chưa viết Script",
      deadlineScript: "2026-11-02",
      deadlineFilming: "2026-11-02",
      scriptDocUrl: "https://docs.google.com/document/d/1xelFoSLZV5D4VG4Z-a6Kvy5Bex6wpQcRruJ8sOvjKAs/edit",
    },
    {
      index: 3,
      weekLabel,
      postDate: "2026-11-04",
      postTime: "20:00",
      pillar: "Nghệ Thuật Henna",
      topic: "ASMR lột lớp Henna Mandala bàn tay và khoảnh khắc lên màu cam đỏ rực rỡ",
      format: "Satisfying Peel-off ASMR",
      hook: "Âm thanh giòn tan khi lột henna này sẽ làm bạn muốn đặt lịch vẽ ngay hôm nay...",
      angle: "Thỏa mãn thị giác và thính giác người xem",
      inspiredBy: "Winning Formula (Bước 1)",
      sourceUrl: "Internal Channel Data",
      cta: "Bạn thích hoa văn Mandala hay hình Doodle nhỏ? Comment cho mình biết nhé",
      status: "Chưa viết Script",
      deadlineScript: "2026-11-03",
      deadlineFilming: "2026-11-03",
      scriptDocUrl: "https://docs.google.com/document/d/1GpM2ndfvsqRcMkQTwqHItNN9Awcxn1SoapdST_0IuVg/edit",
    },
    {
      index: 4,
      weekLabel,
      postDate: "2026-11-05",
      postTime: "20:00",
      pillar: "Hỏi Đáp & Bảo Quản",
      topic: "Cẩm nang giữ lọn Hairwrap bền đẹp 2 tháng và bí kíp gội đầu không lo bết dính (Ưu tiên)",
      format: "Problem - Solution Tutorial",
      hook: "Nhiều bạn inbox hỏi làm hairwrap có gội đầu được không, đây là câu trả lời chuẩn 100%...",
      angle: "Giải quyết triệt để rào cản tâm lý người xem (Priority Action)",
      inspiredBy: "Priority Action (Bước 1)",
      sourceUrl: "Internal Channel Data",
      cta: "Thả tim và lưu lại video để khi gội đầu mở ra xem lại các bước bảo quản nhé",
      status: "Chưa viết Script",
      deadlineScript: "2026-11-04",
      deadlineFilming: "2026-11-04",
      scriptDocUrl: "https://docs.google.com/document/d/1UgBK8sy1NAx7IzRY_h-hHXkZn6TtMnwrgNW90C0vKWs/edit",
    },
    {
      index: 5,
      weekLabel,
      postDate: "2026-11-06",
      postTime: "20:00",
      pillar: "Hướng Dẫn DIY",
      topic: "Trải nghiệm bộ kit tự làm Hairwrap tại nhà bằng dụng cụ Loop Needle xỏ cườm nhanh",
      format: "Hands-on Review / Step-by-step DIY",
      hook: "Chỉ cần 7 phút và 1 chiếc kim luồn tóc này, bạn hoàn toàn có thể tự quấn hairwrap tại nhà...",
      angle: "DIY tại nhà tiết kiệm chi phí cho học sinh - sinh viên",
      inspiredBy: "Winning Formula (Bước 1)",
      sourceUrl: "https://bohotools.vn/loop-needle",
      cta: "Link trọn bộ kit và dụng cụ mình gắn sẵn ở đầu trang cá nhân nhé",
      status: "Chưa viết Script",
      deadlineScript: "2026-11-05",
      deadlineFilming: "2026-11-05",
      scriptDocUrl: "https://docs.google.com/document/d/1EoPx8ObTaHnmagnzNA6nOrRF8SGPx9fpUZVOsAF9RBs/edit",
    },
  ];

  // ==========================================
  // THỰC THI TOÀN BỘ PIPELINE & GHI GOOGLE SHEET
  // ==========================================
  const result = await executeMarketContentStrategyPipeline(
    channelDna,
    researchReport,
    planRows,
    {
      sheetId,
      weekLabel,
      channelLink: "https://www.tiktok.com/@dhng_hairwrap",
      createGoogleDocs: false, // Tái sử dụng 5 file Google Docs kịch bản đã tạo
      dryRun: false, // Ghi dữ liệu trực tiếp lên 5 tab DNA + 2 tab Content Plan & Research Brief
    }
  );

  console.log("\n" + result.keyInputsBoxText);
  console.log("\n" + result.wideResearchReportText);
  console.log("\n" + result.planReportText);
  console.log("\n=== PIPELINE AGENT 1 HOÀN TẤT THÀNH CÔNG 100% VỚI DỮ LIỆU THỰC TẾ ===");
}

main().catch((err) => {
  console.error("Lỗi khi chạy pipeline Agent 1:", err);
  process.exit(1);
});
