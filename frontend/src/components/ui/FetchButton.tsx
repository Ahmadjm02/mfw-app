function Spinner({ size }: { size: number }) {
  return (
    <span
      className="animate-spin-slow rounded-full border-2 border-card/40"
      style={{ width: size, height: size, borderTopColor: "var(--color-card)" }}
    />
  );
}

export interface FetchButtonProps {
  variant: "primary" | "secondary";
  loading: boolean;
  onClick: () => void;
  className?: string;
}

/** The one button of the app: asks the backend for the current users. */
export function FetchButton({ variant, loading, onClick, className = "" }: FetchButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2.5 rounded-full font-sans text-[15px] font-semibold focus-visible:outline focus-visible:outline-3 focus-visible:outline-alert focus-visible:outline-offset-[3px]";
  const variantClasses = loading
    ? "bg-accent-muted text-card cursor-not-allowed"
    : variant === "primary"
      ? "bg-accent text-card hover:bg-accent-dark"
      : "bg-card text-accent border border-edge hover:bg-accent hover:text-card hover:border-accent";

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`${base} ${variantClasses} ${className}`}
    >
      {loading && <Spinner size={14} />}
      {loading ? "Fetching users" : variant === "primary" ? "Fetch users" : "Fetch again"}
    </button>
  );
}
