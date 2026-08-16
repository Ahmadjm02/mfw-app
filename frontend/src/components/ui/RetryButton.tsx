/** Retry action for a failed fetch, styled to sit inside the error card. */
export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 rounded-full bg-alert font-sans text-[14px] font-semibold text-card hover:bg-alert-dark focus-visible:outline focus-visible:outline-3 focus-visible:outline-alert focus-visible:outline-offset-[3px] md:h-auto md:px-5 md:py-2.5"
    >
      Try again
    </button>
  );
}
