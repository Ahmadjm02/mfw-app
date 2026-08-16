function DesktopSkeletonRow() {
  return (
    <div
      className="grid animate-shimmer items-center gap-3 border-t border-line-soft py-3.5"
      style={{ gridTemplateColumns: "34px 1fr 74px" }}
    >
      <div className="h-[34px] w-[34px] rounded-[11px] bg-surface" />
      <div className="h-2.5 w-[68%] rounded-full bg-surface" />
      <div className="h-2.5 rounded-full bg-line-soft" />
    </div>
  );
}

function MobileSkeletonRow() {
  return (
    <div className="flex animate-shimmer flex-col gap-3 border-t border-line-soft py-4">
      <div className="flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] flex-none rounded-[11px] bg-surface" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-2.5 w-[58%] rounded-full bg-surface" />
          <div className="h-[9px] w-[78%] rounded-full bg-line-soft" />
        </div>
      </div>
      <div className="flex gap-6 pl-[45px]">
        <div className="h-[9px] w-[62px] rounded-full bg-line-soft" />
        <div className="h-[9px] w-[84px] rounded-full bg-line-soft" />
      </div>
    </div>
  );
}

/** Placeholder rows shown while the fetch is in flight. */
export function UsersSkeleton() {
  return (
    <>
      <div className="hidden flex-col rounded-[14px] border border-line bg-card px-5 pt-1 pb-3 md:flex">
        {[0, 1, 2, 3].map((i) => (
          <DesktopSkeletonRow key={i} />
        ))}
      </div>
      <div className="flex flex-col rounded-2xl border border-line bg-card px-4 pt-0.5 pb-2 md:hidden">
        {[0, 1, 2, 3].map((i) => (
          <MobileSkeletonRow key={i} />
        ))}
      </div>
    </>
  );
}

/** Shown before the first fetch, when there is nothing to list yet. */
export function EmptyPlaceholder({ message = "No users loaded yet" }: { message?: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-edge bg-card px-6 py-6 text-center text-sm text-accent-muted md:mt-6 md:rounded-[14px]">
      {message}
    </div>
  );
}
