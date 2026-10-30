import { createPixelAgentTracker } from "./pixel-agents.ts";

/**
 * Script giao việc nhanh cho nhân vật trong Pixel Agents từ dòng lệnh:
 * Sử dụng:
 * node --experimental-strip-types src/shared/assign-task.ts "Nhiệm vụ cần làm..."
 * node --experimental-strip-types src/shared/assign-task.ts [agentId] "Nhiệm vụ cần làm..."
 */
async function main() {
  const args = process.argv.slice(2);
  let agentId = "01-market-content-strategist";
  let prompt = "Thực hiện nhiệm vụ được giao";

  if (args.length === 1) {
    prompt = args[0];
  } else if (args.length >= 2) {
    agentId = args[0];
    prompt = args.slice(1).join(" ");
  }

  console.log(`[Pixel Agents] Đang giao việc cho nhân vật "${agentId}"...`);
  console.log(`[Pixel Agents] Nhiệm vụ: "${prompt}"`);

  const tracker = createPixelAgentTracker(agentId);

  // 1. Nhân vật xuất hiện tại văn phòng
  await tracker.start();

  // 2. Hiện bong bóng suy nghĩ / nhận lệnh
  await tracker.submitPrompt(prompt);

  // 3. Nhân vật ngồi vào bàn làm việc gõ phím
  await tracker.toolStart("Đang xử lý tác vụ...", { prompt });
  console.log(`[Pixel Agents] Nhân vật đã ngồi vào bàn làm việc và bắt đầu thao tác.`);

  // 4. Giả lập một khoảng thời gian làm việc ngắn nếu chạy standalone
  await new Promise((r) => setTimeout(r, 1500));
  await tracker.toolEnd("Đang xử lý tác vụ...");
  await tracker.idle();

  console.log(`[Pixel Agents] Hoàn tất giao việc. Nhân vật chuyển sang trạng thái chờ lệnh tiếp theo.`);
}

main().catch(console.error);
