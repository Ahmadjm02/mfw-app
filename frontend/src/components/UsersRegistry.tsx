import { useEffect, useMemo, useState } from "react";

import { useUsers } from "../api/useUsers";
import { describeError } from "../lib/errors";
import { clockTime, pluralize, timeAgo } from "../lib/format";
import { ErrorCard, StaleErrorNotice } from "./ErrorStates";
import { EmptyPlaceholder, UsersSkeleton } from "./UsersSkeleton";
import { UsersTable } from "./UsersTable";
import { FetchButton } from "./ui/FetchButton";

/** Re-renders every few seconds so relative timestamps stay honest. */
function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 4000);
    return () => clearInterval(id);
  }, [active]);

  return now;
}

export function UsersRegistry() {
  const query = useUsers();

  const hasData = query.data !== undefined;
  const isRefetching = query.isFetching && hasData;
  const staleError = hasData && query.isError;

  const status = hasData
    ? "results"
    : query.isFetching
      ? "loading"
      : query.isError
        ? "error"
        : "initial";

  const now = useNow(hasData);

  const liveMessage = useMemo(() => {
    if (status === "loading") return "Fetching users";
    if (status === "results") {
      const loaded = `${pluralize(query.data!.users.length, "user")} loaded`;
      return staleError ? `${describeError(query.error).title}. ${loaded} previously.` : loaded;
    }
    if (status === "error") return describeError(query.error).title;
    return "";
  }, [status, staleError, query.data, query.error]);

  return (
    <div className="mx-auto w-full max-w-[1280px] rounded-[22px] bg-surface p-[22px_18px_28px] md:rounded-[18px] md:p-[40px_48px_48px]">
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      <div className="mb-[22px] flex items-center justify-between border-b border-edge-strong pb-0 md:mb-0 md:border-b md:pb-[26px]">
        <h1 className="font-display text-[15px] font-bold tracking-[-0.02em] text-ink md:text-[17px]">
          Registry
        </h1>
        {hasData && (
          <div className="flex items-center gap-2 text-[12.5px] text-accent-muted md:text-[13.5px]">
            <span className="hidden h-[7px] w-[7px] rounded-full bg-accent md:inline-block" />
            <span className="md:hidden">{clockTime(query.dataUpdatedAt)}</span>
            <span className="hidden md:inline">Last fetched {clockTime(query.dataUpdatedAt)}</span>
          </div>
        )}
      </div>

      <div className="mt-[22px] mb-[18px] flex items-end justify-between gap-8 md:mt-[34px] md:mb-[22px]">
        <div className="flex flex-col gap-1.5">
          {status === "results" ? (
            <>
              <h2 className="font-display text-[32px] leading-[1.02] font-bold tracking-[-0.035em] text-ink md:text-[44px] md:leading-none">
                {pluralize(query.data!.users.length, "user")}
              </h2>
              <p className="text-[13.5px] text-ink-muted md:text-[15px]">
                <span className="md:hidden">Fetched {timeAgo(query.dataUpdatedAt, now)}</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-[32px] leading-[1.02] font-bold tracking-[-0.035em] text-ink md:text-[30px] md:leading-[1.05]">
                Fetch users
              </h2>
              <p className="text-[14.5px] leading-[1.55] text-ink-body">
                One request, one list. Press the button and the current users arrive.
              </p>
            </>
          )}
        </div>
        {status === "results" && (
          <div className="hidden md:block">
            <FetchButton
              variant="secondary"
              loading={isRefetching}
              onClick={() => query.refetch()}
              className="flex-none px-6 py-3"
            />
          </div>
        )}
      </div>

      {status === "initial" && (
        <>
          <FetchButton
            variant="primary"
            loading={false}
            onClick={() => query.refetch()}
            className="h-12 w-full px-[26px] py-[13px] md:h-auto md:w-auto"
          />
          <EmptyPlaceholder />
        </>
      )}

      {status === "loading" && (
        <>
          <FetchButton
            variant="primary"
            loading
            onClick={() => query.refetch()}
            className="h-12 w-full px-[26px] py-[13px] md:h-auto md:w-auto"
          />
          <div className="mt-6">
            <UsersSkeleton />
          </div>
        </>
      )}

      {status === "results" && (
        <>
          {staleError && <StaleErrorNotice error={query.error} />}
          {query.data!.users.length === 0 ? (
            <EmptyPlaceholder message="The database has no users" />
          ) : (
            <UsersTable users={query.data!.users} />
          )}
          <FetchButton
            variant="secondary"
            loading={isRefetching}
            onClick={() => query.refetch()}
            className="mt-4.5 h-12 w-full md:hidden"
          />
        </>
      )}

      {status === "error" && <ErrorCard error={query.error} onRetry={() => query.refetch()} />}
    </div>
  );
}
