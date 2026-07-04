import { prisma } from "@/lib/prisma";
import type { BusinessHourDayDTO } from "@/lib/types";

export async function getBusinessHours(): Promise<BusinessHourDayDTO[]> {
  const shifts = await prisma.businessHourShift.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
  });

  return Array.from({ length: 7 }, (_, dayOfWeek) => {
    const dayShifts = shifts
      .filter((s) => s.dayOfWeek === dayOfWeek)
      .map((s) => ({ openTime: s.openTime, closeTime: s.closeTime }));

    return {
      dayOfWeek,
      isOpen: dayShifts.length > 0,
      shifts: dayShifts,
    };
  });
}
