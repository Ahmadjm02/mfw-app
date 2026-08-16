import { ApiError } from "../api/client";

export interface ErrorDescription {
  title: string;
  detail: string;
}

function endWithPeriod(text: string): string {
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** Turns any thrown value into a title/detail pair that is safe to show to a user. */
export function describeError(error: unknown): ErrorDescription {
  if (error instanceof ApiError) {
    const detail = endWithPeriod(error.message);

    switch (error.kind) {
      case "timeout":
        return {
          title: "Couldn't reach the server",
          detail: "The request timed out after 10 seconds.",
        };
      case "network":
        return { title: "Couldn't reach the server", detail: "Could not reach the server." };
      case "config":
        return { title: "The app isn't configured", detail };
      case "parse":
        return { title: "The reply wasn't readable", detail };
      case "server":
        return {
          title:
            error.status === 500
              ? "The server hit an error"
              : `The server failed (${error.status})`,
          detail,
        };
      case "client":
        return {
          title: error.status === 404 ? "That endpoint doesn't exist" : "The request was rejected",
          detail,
        };
    }
  }
  return { title: "Something went wrong", detail: "The request failed for an unknown reason." };
}
