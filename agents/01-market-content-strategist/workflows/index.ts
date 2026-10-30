// Pipeline điều phối toàn diện cho Agent 1: Market & Content Strategist
export * from "./types.ts";
export * from "./step1-dna-analysis.ts";
export * from "./step2-wide-research.ts";
export * from "./step3-content-plan.ts";

import {
  DEFAULT_SHEET_ID,
  formatKeyInputsBox,
  syncDnaToGoogleSheets,
} from "./step1-dna-analysis.ts";
import {
  buildWeeklyAnglesBox,
  formatWideResearchReport,
} from "./step2-wide-research.ts";
import {
  evaluateChecklist,
  formatPlanSummaryReport,
  initializeScriptDocs,
  syncContentPlanToSheet,
} from "./step3-content-plan.ts";
import { createPixelAgentTracker } from "../../../src/shared/pixel-agents.ts";
import type {
  ChannelDnaAnalysisResult,
  ContentPlanOutputResult,
  ContentPlanRow,
  ResearchBriefRow,
  WideResearchReport,
} from "./types.ts";

export interface PipelineExecutionOptions {
  sheetId?: string;
  channelLink?: string;
  weekLabel: string; // Ví dụ: "Tuần 44 - 2026"
  createGoogleDocs?: boolean;
  dryRun?: boolean; // Nếu true, chỉ tính toán và xuất báo cáo mà không ghi lên Sheet
}

/**
 * Điều phối luồng làm việc 3 bước chuẩn hóa của Agent 1:
 * - Bước 1: Phân tích DNA Kênh & đồng bộ 5 tab Sheet
 * - Bước 2: Quét xu hướng Wide Research & xuất Hộp Góc Khai Thác
 * - Bước 3: Lập Content Plan 5 bài, đồng bộ tab Content Plan & Research Brief, chạy checklist PASS/FAIL
 */
export async function executeMarketContentStrategyPipeline(
  dnaData: ChannelDnaAnalysisResult,
  researchData: WideResearchReport,
  rawPlanRows: ContentPlanRow[],
  options: PipelineExecutionOptions
): Promise<{
  keyInputsBoxText: string;
  wideResearchReportText: string;
  contentPlanResult: ContentPlanOutputResult;
  planReportText: string;
}> {
  const sheetId = options.sheetId || DEFAULT_SHEET_ID;
  const isDryRun = options.dryRun === true;
  const pixel = createPixelAgentTracker("01-market-content-strategist");

  // Khởi tạo hoạt ảnh nhân vật trong văn phòng ảo Pixel Agents
  await pixel.start();
  await pixel.submitPrompt(`Lập chiến lược nội dung: ${options.weekLabel}`);

  // --- BƯỚC 1: Xử lý DNA & Đồng bộ 5 tab Google Sheet ---
  console.log(`[Agent 1 - Bước 1] Phân tích DNA kênh (Chế độ: ${isDryRun ? "Dry-run (Không ghi Sheet)" : "Live Sync"})...`);
  await pixel.toolStart("Phân tích DNA Kênh & Chỉ số", { sheetId });
  if (!isDryRun) {
    await syncDnaToGoogleSheets(sheetId, dnaData);
  }
  const keyInputsBoxText = formatKeyInputsBox(dnaData.keyInputs);
  await pixel.toolEnd("Phân tích DNA Kênh & Chỉ số");

  // --- BƯỚC 2: Xử lý Wide Research & Hộp Góc Khai Thác ---
  console.log(`[Agent 1 - Bước 2] Xử lý báo cáo Wide Research cho Niche: ${researchData.niche}`);
  await pixel.toolStart("Quét Xu Hướng Thị Trường (Wide Research)", { niche: researchData.niche });
  researchData.weeklyAngles = buildWeeklyAnglesBox(
    researchData.industryNews,
    researchData.trendingVideos,
    researchData.newTools
  );
  const wideResearchReportText = formatWideResearchReport(researchData);
  await pixel.toolEnd("Quét Xu Hướng Thị Trường (Wide Research)");

  // --- BƯỚC 3: Lập Content Plan, Tạo Google Docs, Kiểm tra Checklist ---
  console.log(`[Agent 1 - Bước 3] Lập kế hoạch 5 bài cho ${options.weekLabel}`);
  await pixel.toolStart("Đồng Bộ Content Plan & Kiểm Tra 5 Tiêu Chí", { weekLabel: options.weekLabel });
  let planRows = rawPlanRows;
  if (options.createGoogleDocs && !isDryRun) {
    planRows = await initializeScriptDocs(planRows);
  }

  // Đối chiếu Checklist
  const checklist = evaluateChecklist(planRows, dnaData.keyInputs, researchData.weeklyAngles);
  const allPassed = checklist.every((c) => c.passed);

  const briefRow: ResearchBriefRow = {
    weekLabel: options.weekLabel,
    industryNewsSummary: researchData.industryNews.map((n) => n.title).slice(0, 3).join("; "),
    topTrendingFormats: researchData.weeklyAngles.top3FormatsToModel.join("; "),
    topContentOpportunities: researchData.weeklyAngles.top3ContentOpportunities.join("; "),
    newToolsSummary: researchData.weeklyAngles.priorityToolProduct,
    researchDate: new Date().toLocaleDateString("vi-VN"),
  };

  // Đồng bộ lên Tab Content Plan và Research Brief
  if (!isDryRun) {
    console.log(`[Agent 1 - Bước 3] Ghi dữ liệu vào tab Content Plan và Research Brief...`);
    await syncContentPlanToSheet(sheetId, planRows, briefRow);
  } else {
    console.log(`[Agent 1 - Bước 3] Dry-run hoàn tất. Bỏ qua ghi Sheet.`);
  }
  await pixel.toolEnd("Đồng Bộ Content Plan & Kiểm Tra 5 Tiêu Chí");
  await pixel.idle();

  const contentPlanResult: ContentPlanOutputResult = {
    planRows,
    briefRow,
    checklist,
    allPassed,
    strategicSummary: `5 chủ đề tuần này được phân bổ chuẩn theo tỷ lệ Content Mix (${dnaData.keyInputs.contentMix}), trong đó có ${planRows.filter((r) => r.inspiredBy.includes("Winning Formula")).length} bài áp dụng công thức thắng từ Bước 1, ${planRows.filter((r) => r.inspiredBy.includes("Trending")).length} bài bắt nhịp xu hướng từ Bước 2, và 1 bài tập trung giải quyết hành động ưu tiên: "${dnaData.keyInputs.priorityAction}".`,
  };

  const planReportText = formatPlanSummaryReport(contentPlanResult);

  return {
    keyInputsBoxText,
    wideResearchReportText,
    contentPlanResult,
    planReportText,
  };
}
