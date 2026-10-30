import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

interface PixelServerConfig {
  port: number;
  token: string;
}

let cachedConfig: PixelServerConfig | null = null;
let lastConfigCheck = 0;

/**
 * Đọc cấu hình Pixel Agents từ ~/.pixel-agents/server.json.
 * Trả về null nếu server chưa bật hoặc không tìm thấy file.
 */
export function getPixelServerConfig(): PixelServerConfig | null {
  const now = Date.now();
  if (cachedConfig && now - lastConfigCheck < 10000) {
    return cachedConfig;
  }

  try {
    const configPath = path.join(os.homedir(), ".pixel-agents", "server.json");
    if (!fs.existsSync(configPath)) {
      cachedConfig = null;
      return null;
    }
    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.port && parsed.token) {
      cachedConfig = { port: parsed.port, token: parsed.token };
      lastConfigCheck = now;
      return cachedConfig;
    }
  } catch {
    // shortcut: Bỏ qua lỗi đọc file cấu hình để không làm gián đoạn pipeline chính, xử lý chi tiết hơn khi cần debug chuyên sâu
    cachedConfig = null;
  }
  return null;
}

/**
 * Gửi event tới Pixel Agents webhook endpoint (/api/hooks/claude).
 * Tự động bỏ qua an toàn nếu Pixel Agents server không hoạt động.
 */
export async function sendPixelHook(payload: Record<string, unknown>): Promise<boolean> {
  const conf = getPixelServerConfig();
  if (!conf) return false;

  try {
    const url = `http://127.0.0.1:${conf.port}/api/hooks/claude`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${conf.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    // Không ném lỗi ra ngoài khi Pixel Agents đóng hoặc mất kết nối
    return false;
  }
}

/**
 * Khởi tạo nhân vật Agent trong văn phòng ảo Pixel Agents
 */
export async function startPixelAgent(
  agentId: string,
  cwd: string = process.cwd()
): Promise<boolean> {
  return sendPixelHook({
    session_id: agentId,
    hook_event_name: "SessionStart",
    source: "startup",
    cwd,
  });
}

/**
 * Gửi thông báo Agent nhận việc mới từ người dùng (hiện bong bóng chat)
 */
export async function reportAgentPrompt(
  agentId: string,
  prompt: string
): Promise<boolean> {
  return sendPixelHook({
    session_id: agentId,
    hook_event_name: "UserPromptSubmit",
    prompt,
  });
}

/**
 * Báo hiệu Agent đang thực hiện một công cụ/tác vụ (nhân vật ngồi gõ phím / làm việc)
 */
export async function reportAgentToolStart(
  agentId: string,
  toolName: string,
  toolInput: Record<string, unknown> = {}
): Promise<boolean> {
  return sendPixelHook({
    session_id: agentId,
    hook_event_name: "PreToolUse",
    tool_name: toolName,
    tool_input: toolInput,
  });
}

/**
 * Báo hiệu Agent hoàn thành một công cụ/tác vụ
 */
export async function reportAgentToolEnd(
  agentId: string,
  toolName?: string
): Promise<boolean> {
  return sendPixelHook({
    session_id: agentId,
    hook_event_name: "PostToolUse",
    tool_name: toolName,
  });
}

/**
 * Báo hiệu Agent đã hoàn thành công việc và chuyển sang trạng thái nghỉ/chờ
 */
export async function reportAgentIdle(agentId: string): Promise<boolean> {
  return sendPixelHook({
    session_id: agentId,
    hook_event_name: "Stop",
  });
}

/**
 * Thoát session và giải phóng nhân vật khỏi bàn làm việc
 */
export async function stopPixelAgent(agentId: string): Promise<boolean> {
  return sendPixelHook({
    session_id: agentId,
    hook_event_name: "SessionEnd",
    reason: "exit",
  });
}

/**
 * Tạo một bộ điều khiển Pixel Agent nhanh cho từng Agent cụ thể
 */
export function createPixelAgentTracker(agentId: string) {
  return {
    start: (cwd?: string) => startPixelAgent(agentId, cwd),
    submitPrompt: (prompt: string) => reportAgentPrompt(agentId, prompt),
    toolStart: (toolName: string, input?: Record<string, unknown>) =>
      reportAgentToolStart(agentId, toolName, input),
    toolEnd: (toolName?: string) => reportAgentToolEnd(agentId, toolName),
    idle: () => reportAgentIdle(agentId),
    stop: () => stopPixelAgent(agentId),
  };
}
