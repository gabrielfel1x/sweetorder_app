import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const shiftSchema = z.object({
  openTime: z.string().regex(TIME_REGEX, "Horário inválido"),
  closeTime: z.string().regex(TIME_REGEX, "Horário inválido"),
});

export const businessHourDaySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isOpen: z.boolean(),
  shifts: z.array(shiftSchema),
});

export const businessHoursSchema = z
  .object({
    days: z.array(businessHourDaySchema).length(7),
  })
  .superRefine((data, ctx) => {
    data.days.forEach((day, dayIndex) => {
      if (!day.isOpen) return;

      if (day.shifts.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["days", dayIndex, "shifts"],
          message: "Adicione ao menos um turno ou marque o dia como fechado",
        });
        return;
      }

      const withIndex = day.shifts.map((shift, shiftIndex) => ({ ...shift, shiftIndex }));
      const sorted = [...withIndex].sort((a, b) => a.openTime.localeCompare(b.openTime));

      sorted.forEach((shift, i) => {
        if (shift.openTime >= shift.closeTime) {
          ctx.addIssue({
            code: "custom",
            path: ["days", dayIndex, "shifts", shift.shiftIndex, "closeTime"],
            message: "O fechamento deve ser depois da abertura",
          });
        }

        if (i > 0 && shift.openTime < sorted[i - 1].closeTime) {
          ctx.addIssue({
            code: "custom",
            path: ["days", dayIndex, "shifts", shift.shiftIndex, "openTime"],
            message: "Esse turno sobrepõe outro turno do mesmo dia",
          });
        }
      });
    });
  });

export type BusinessHoursFormData = z.infer<typeof businessHoursSchema>;
