const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const TIMEOUT_MS = 10_000;

export type ApiErrorKind = "config" | "timeout" | "server" | "client" | "parse" | "network";

export interface ApiErrorOptions {
  status?: number;
  cause?: unknown;
}

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;

  constructor(kind: ApiErrorKind, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.kind = kind;
    this.status = options.status;
  }
}

async function readErrorDetail(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  const detail = (body as { detail?: unknown } | null)?.detail;

  if (typeof detail === "string" && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (item as { msg?: unknown })?.msg)
      .filter((msg): msg is string => typeof msg === "string" && msg.trim().length > 0);
    if (messages.length) return messages.join("; ");
  }

  return `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}`;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "config",
      "VITE_API_URL is not set. Copy frontend/.env.example to frontend/.env and rebuild.",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      signal: signal ? AbortSignal.any([signal, controller.signal]) : controller.signal,
    });

    if (!response.ok) {
      const kind = response.status >= 500 ? "server" : "client";
      throw new ApiError(kind, await readErrorDetail(response), { status: response.status });
    }

    try {
      return (await response.json()) as T;
    } catch (err) {
      throw new ApiError("parse", "The server replied with something the app could not read.", {
        status: response.status,
        cause: err,
      });
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      if (controller.signal.aborted) {
        throw new ApiError("timeout", "The request timed out after 10 seconds.");
      }
      throw err;
    }
    throw new ApiError("network", "Could not reach the server.", { cause: err });
  } finally {
    clearTimeout(timeout);
  }
}
