import { exec, execSync } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export interface CliOptions {
  json?: boolean;
  cwd?: string;
  env?: Record<string, string>;
}

/**
 * Thực thi lệnh CLI bất đồng bộ và tự động parse JSON khi có cờ --json.
 * Bắt buộc tái sử dụng trong toàn bộ connector để tránh trùng lặp code gọi child_process.
 */
export async function runCli(command: string, args: string[] = [], options: CliOptions = {}): Promise<any> {
  const fullCommand = buildCommandString(command, args, options.json);
  
  try {
    const { stdout } = await execAsync(fullCommand, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    if (options.json) {
      return parseJsonOutput(stdout);
    }
    return stdout.trim();
  } catch (error: any) {
    const errorMsg = error.stderr || error.stdout || error.message;
    throw new Error(`[CLI Error: ${command}] ${errorMsg.trim()}`);
  }
}

/**
 * Thực thi lệnh CLI đồng bộ (synchronous).
 */
export function runCliSync(command: string, args: string[] = [], options: CliOptions = {}): any {
  const fullCommand = buildCommandString(command, args, options.json);
  
  try {
    const stdout = execSync(fullCommand, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    if (options.json) {
      return parseJsonOutput(stdout);
    }
    return stdout.trim();
  } catch (error: any) {
    const errorMsg = error.stderr?.toString() || error.stdout?.toString() || error.message;
    throw new Error(`[CLI Error: ${command}] ${errorMsg.trim()}`);
  }
}

function buildCommandString(cmd: string, args: string[], isJson?: boolean): string {
  const escapedArgs = args.map((arg) => {
    if (arg.includes(" ") || arg.includes("\n") || arg.includes('"')) {
      return `"${arg.replace(/"/g, '\\"')}"`;
    }
    return arg;
  });

  if (isJson && !args.includes("--json")) {
    escapedArgs.push("--json");
  }

  return `${cmd} ${escapedArgs.join(" ")}`.trim();
}

function parseJsonOutput(stdout: string): any {
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    // shortcut: cố gắng trích xuất khối JSON nếu CLI in kèm text log trước đó, nâng cấp thành streaming parser khi có log phức tạp
    const jsonMatch = trimmed.match(/(\{|\[)[\s\S]*(\}|\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return trimmed;
  }
}
