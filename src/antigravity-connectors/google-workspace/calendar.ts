import { runCli } from "../../shared/cli-runner.ts";

export interface TikTokPublishEvent {
  videoTitle: string;
  publishTime: string; // Định dạng RFC3339 / ISO 8601: "2026-10-30T19:00:00+07:00"
  durationMinutes?: number; // Mặc định 30 phút
  productName: string;
  affiliateLink?: string;
  scriptDocUrl?: string;
  notes?: string;
}

export interface CalendarEventItem {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
}

/**
 * Đặt lịch xuất bản video TikTok lên Google Calendar để theo dõi khung giờ vàng.
 */
export async function scheduleVideoPublish(
  event: TikTokPublishEvent
): Promise<{ eventId: string; summary: string }> {
  const startDate = new Date(event.publishTime);
  const durationMs = (event.durationMinutes ?? 30) * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  const startRfc = startDate.toISOString();
  const endRfc = endDate.toISOString();

  const summary = `[TikTok Video] ${event.videoTitle}`;
  const descriptionLines = [
    `🎬 Video: ${event.videoTitle}`,
    `📦 Sản phẩm: ${event.productName}`,
    event.affiliateLink ? `🔗 Link Affiliate: ${event.affiliateLink}` : "",
    event.scriptDocUrl ? `📄 Kịch bản Google Docs: ${event.scriptDocUrl}` : "",
    event.notes ? `📝 Ghi chú: ${event.notes}` : "",
  ].filter(Boolean);

  const description = descriptionLines.join("\n");

  const args = [
    "mutate",
    "create",
    "--summary",
    summary,
    "--start",
    startRfc,
    "--end",
    endRfc,
    "--description",
    description,
  ];

  const result = await runCli("gcalendar", args, { json: true });
  return {
    eventId: result.id || result.eventId,
    summary,
  };
}

/**
 * Lấy danh sách lịch đăng video hoặc livestream sắp tới trên Google Calendar.
 */
export async function listUpcomingSchedules(
  maxResults: number = 10
): Promise<CalendarEventItem[]> {
  const result = await runCli("gcalendar", ["readonly", "events", "--max", String(maxResults)], { json: true });

  if (!result) return [];
  const items = Array.isArray(result) ? result : result.items || [];

  return items.map((evt: any) => ({
    id: evt.id,
    summary: evt.summary || "Untitled",
    start: evt.start?.dateTime || evt.start?.date || "",
    end: evt.end?.dateTime || evt.end?.date || "",
    description: evt.description || "",
  }));
}
