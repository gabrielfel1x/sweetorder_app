import type { BusinessHourDayDTO, BusinessHourShiftDTO } from "@/lib/types";
import { DAY_LABELS } from "@/lib/business-hours-constants";

export const STORE_TIMEZONE = "America/Sao_Paulo";

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getNowInStoreTimezone(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";

  return { dayOfWeek: WEEKDAY_TO_INDEX[weekday] ?? 0, time: `${hour}:${minute}` };
}

export type BusinessHoursStatus = {
  hasAnyHours: boolean;
  isOpenNow: boolean;
  todayLabel: string;
  todayShifts: BusinessHourShiftDTO[];
};

export function getBusinessHoursStatus(
  days: BusinessHourDayDTO[],
  now: Date = new Date()
): BusinessHoursStatus {
  const hasAnyHours = days.some((d) => d.shifts.length > 0);
  const { dayOfWeek, time } = getNowInStoreTimezone(now);
  const today = days.find((d) => d.dayOfWeek === dayOfWeek);
  const isOpenNow = Boolean(
    today?.isOpen && today.shifts.some((s) => time >= s.openTime && time < s.closeTime)
  );

  return {
    hasAnyHours,
    isOpenNow,
    todayLabel: DAY_LABELS[dayOfWeek],
    todayShifts: today?.shifts ?? [],
  };
}

export function formatShiftsList(shifts: BusinessHourShiftDTO[]): string {
  return shifts.map((s) => `${s.openTime}–${s.closeTime}`).join(", ");
}
