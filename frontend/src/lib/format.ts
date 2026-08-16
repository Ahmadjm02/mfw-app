import { format, formatDistanceStrict, type Locale } from "date-fns";
import { enUS } from "date-fns/locale";

/** Abbreviated unit names for the narrow mobile layout ("2 mo" instead of "2 months"). */
const ABBREVIATED_UNITS: Record<string, string> = {
  xSeconds: "s",
  xMinutes: "min",
  xHours: "h",
  xDays: "d",
  xMonths: "mo",
  xYears: "yr",
};

const abbreviatedLocale: Locale = {
  ...enUS,
  formatDistance: (token, count) => `${count} ${ABBREVIATED_UNITS[token] ?? token}`,
};

export function initial(name: string): string {
  return [...name][0]?.toUpperCase() ?? "";
}

export function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function joinedLong(iso: string): string {
  return format(new Date(iso), "MMMM d, yyyy");
}

export function joinedShort(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}

export function clockTime(timestamp: number): string {
  return format(timestamp, "HH:mm");
}

export interface SinceThen {
  text: string;
  edited: boolean;
}

export function sinceThen(createdIso: string, updatedIso: string, abbreviate = false): SinceThen {
  const created = new Date(createdIso);
  const updated = new Date(updatedIso);

  if (updated <= created) {
    return { text: "never edited", edited: false };
  }

  const distance = formatDistanceStrict(updated, created, {
    roundingMethod: "floor",
    locale: abbreviate ? abbreviatedLocale : undefined,
  });

  return { text: `edited ${distance} later`, edited: true };
}

export function timeAgo(since: number, now: number): string {
  if (now - since < 1000) {
    return "less than a second ago";
  }
  return formatDistanceStrict(since, now, { addSuffix: true, roundingMethod: "floor" });
}
