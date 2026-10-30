// Định nghĩa kiểu dữ liệu chuẩn cho Agent 1: Market & Content Strategist

// --- BƯỚC 1: Dữ liệu TikTok Studio Analytics ---
export interface OverviewMetrics {
  date: string;
  videoViews: number;
  profileViews: number;
  likes: number;
  comments: number;
  shares: number;
  newFollowers: number;
}

export interface ChannelVideoItem {
  postDate: string;
  title: string;
  totalViews: number;
  views7d: number;
  likes: number;
  comments: number;
  shares: number;
  erPercent?: number; // (Likes + Comments + Shares) / Total Views * 100
  contentPillar: string;
  format: string;
  captionType: string;
  videoLink: string;
}

export interface ActiveHourMetric {
  date: string;
  hour: string; // "19:00"
  activeFollowers: number;
}

export interface DemographicMetric {
  gender: Record<string, string>; // { "Nam": "65%", "Nữ": "35%" }
  ageDistribution: Record<string, string>; // { "18-24": "45%", "25-34": "40%" }
  topCountries: Record<string, string>; // { "Việt Nam": "95%" }
}

export interface ViewersRetentionMetric {
  date: string;
  totalViewers: number;
  newViewers: number;
  returningViewers: number;
}

export interface KeyInputsBox {
  winningFormula: string;
  contentMix: string; // Ví dụ: "40% Hướng dẫn thực chiến, 30% Review công cụ, 30% Case study"
  recommendedHooks: string[];
  bestTime: string; // "19:00"
  topMonetization: string;
  priorityAction: string;
  winningTopicsFormats: string[];
}

export interface ChannelDnaAnalysisResult {
  overviewList: OverviewMetrics[];
  topVideosList: ChannelVideoItem[];
  activeHours: ActiveHourMetric[];
  demographics: DemographicMetric;
  retentionList: ViewersRetentionMetric[];
  keyInputs: KeyInputsBox;
}

// --- BƯỚC 2: Wide Research Trends ---
export interface IndustryNewsItem {
  title: string;
  summary: string;
  audienceRelevance: string;
  contentAngle: string;
  sourceUrl: string;
  publishDate: string;
}

export interface TrendingVideoItem {
  title: string;
  channelName: string;
  platform: "TikTok" | "YouTube Shorts" | "YouTube Long-form" | "Instagram Reels";
  views: number;
  publishDate: string;
  hookOpening: string;
  format: string;
  whyItWorks: string;
  takeawayForChannel: string;
  videoUrl: string;
  isOutlier: boolean; // true nếu Views >= 3x trung bình kênh
}

export interface NewToolProductItem {
  name: string;
  oneLineDescription: string;
  whyAudienceCares: string;
  contentAngle: string;
  officialUrl: string;
}

export interface WeeklyAnglesBox {
  top3ContentOpportunities: string[];
  top3FormatsToModel: string[];
  priorityToolProduct: string;
}

export interface WideResearchReport {
  niche: string;
  industryNews: IndustryNewsItem[];
  trendingVideos: TrendingVideoItem[];
  newTools: NewToolProductItem[];
  weeklyAngles: WeeklyAnglesBox;
}

// --- BƯỚC 3: Content Plan & Checklist ---
export interface ContentPlanRow {
  index: number; // 1 to 5
  weekLabel: string; // "Tuần 44 - 2026"
  postDate: string; // "YYYY-MM-DD"
  postTime: string; // "19:00"
  pillar: string;
  topic: string;
  format: string;
  hook: string; // Câu thoại cụ thể 3-5 giây đầu
  angle: string;
  inspiredBy: string; // Winning Formula hoặc Tên kênh video mẫu
  sourceUrl: string; // URL từ Bước 2 hoặc "Internal Channel Data"
  cta: string;
  status: "Chưa viết Script" | "Đã viết Script" | "Đã quay" | "Đã đăng";
  deadlineScript: string; // postDate - 1 ngày
  deadlineFilming: string; // postDate - 1 ngày
  scriptDocUrl?: string;
}

export interface ResearchBriefRow {
  weekLabel: string;
  industryNewsSummary: string;
  topTrendingFormats: string;
  topContentOpportunities: string;
  newToolsSummary: string;
  researchDate: string;
}

export interface ChecklistItemResult {
  criteria: string;
  passed: boolean;
  notes: string;
}

export interface ContentPlanOutputResult {
  planRows: ContentPlanRow[];
  briefRow: ResearchBriefRow;
  checklist: ChecklistItemResult[];
  allPassed: boolean;
  strategicSummary: string;
}
