import { createClient } from "@/lib/supabase/server";
import type { BusinessHourDayDTO } from "@/lib/types";

export async function getBusinessHours(storeId: string): Promise<BusinessHourDayDTO[]> {
  const supabase = await createClient();
  const { data: shifts, error } = await supabase
    .from("business_hour_shifts")
    .select("*")
    .eq("store_id", storeId)
    .order("day_of_week", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return Array.from({ length: 7 }, (_, dayOfWeek) => {
    const dayShifts = shifts
      .filter((s) => s.day_of_week === dayOfWeek)
      .map((s) => ({ openTime: s.open_time, closeTime: s.close_time }));

    return {
      dayOfWeek,
      isOpen: dayShifts.length > 0,
      shifts: dayShifts,
    };
  });
}
