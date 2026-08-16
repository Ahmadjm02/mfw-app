import { describeError } from "../lib/errors";
import { RetryButton } from "./ui/RetryButton";

/** Shown when the fetch failed and there is nothing to display. */
export function ErrorCard({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const { title, detail } = describeError(error);
  return (
    <div className="rounded-2xl border border-alert bg-card p-[22px] md:rounded-[14px] md:p-6">
      <div className="mb-2 font-display text-[22px] leading-[1.1] font-bold tracking-[-0.025em] text-alert">
        {title}
      </div>
      <p className="text-[14.5px] leading-[1.55] text-ink-body">{detail} No users were loaded.</p>
      <div className="mt-4.5 flex flex-col gap-2.5 md:flex-row">
        <RetryButton onClick={onRetry} />
      </div>
    </div>
  );
}

/** Shown when a refetch failed but users from an earlier fetch are still on screen. */
export function StaleErrorNotice({ error }: { error: unknown }) {
  const { title, detail } = describeError(error);
  return (
    <div className="mb-4.5 rounded-2xl border border-alert bg-card px-[18px] py-4 md:rounded-[14px] md:px-5">
      <div className="font-display text-[15px] leading-[1.2] font-bold tracking-[-0.02em] text-alert">
        {title}
      </div>
      <p className="mt-1 text-[13.5px] leading-[1.5] text-ink-body">
        {detail} Showing the users from the last successful fetch.
      </p>
    </div>
  );
}
