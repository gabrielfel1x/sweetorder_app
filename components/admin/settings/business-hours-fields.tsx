"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, Controller, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FieldError, ActionButton } from "@/components/form-kit";
import { updateBusinessHours } from "@/app/admin/loja/actions";
import { businessHoursSchema, type BusinessHoursFormData } from "@/lib/schemas/business-hours";
import { DAY_DISPLAY_ORDER, DAY_LABELS } from "@/lib/business-hours-constants";
import type { BusinessHourDayDTO } from "@/lib/types";

function DayRow({ dayIndex, isPending }: { dayIndex: number; isPending: boolean }) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<BusinessHoursFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.shifts`,
  });

  const isOpen = watch(`days.${dayIndex}.isOpen`);
  const dayOfWeek = watch(`days.${dayIndex}.dayOfWeek`);
  const dayErrors = errors.days?.[dayIndex];

  return (
    <div className="border-b border-border last:border-b-0 pb-4 last:pb-0 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <span className="font-heading font-bold text-sm">{DAY_LABELS[dayOfWeek]}</span>
        <Controller
          name={`days.${dayIndex}.isOpen`}
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
          )}
        />
      </div>

      {isOpen && (
        <div className="flex flex-col gap-2">
          {fields.map((field, shiftIndex) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  type="time"
                  disabled={isPending}
                  className={dayErrors?.shifts?.[shiftIndex]?.openTime ? "border-destructive" : ""}
                  {...register(`days.${dayIndex}.shifts.${shiftIndex}.openTime`)}
                />
                <FieldError>{dayErrors?.shifts?.[shiftIndex]?.openTime?.message}</FieldError>
              </div>
              <span className="h-8 flex items-center text-muted-foreground text-sm shrink-0">até</span>
              <div className="flex-1">
                <Input
                  type="time"
                  disabled={isPending}
                  className={dayErrors?.shifts?.[shiftIndex]?.closeTime ? "border-destructive" : ""}
                  {...register(`days.${dayIndex}.shifts.${shiftIndex}.closeTime`)}
                />
                <FieldError>{dayErrors?.shifts?.[shiftIndex]?.closeTime?.message}</FieldError>
              </div>
              <button
                type="button"
                onClick={() => remove(shiftIndex)}
                disabled={isPending}
                aria-label="Remover turno"
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {typeof dayErrors?.shifts?.message === "string" && (
            <FieldError>{dayErrors.shifts.message}</FieldError>
          )}

          <button
            type="button"
            onClick={() => append({ openTime: "08:00", closeTime: "18:00" })}
            disabled={isPending}
            className="self-start flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar turno
          </button>
        </div>
      )}
    </div>
  );
}

export function BusinessHoursFields({ initialBusinessHours }: { initialBusinessHours: BusinessHourDayDTO[] }) {
  const methods = useForm<BusinessHoursFormData>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: { days: initialBusinessHours },
  });
  const { handleSubmit } = methods;

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);

  const onSubmit = handleSubmit((data) => {
    setServerError("");
    setSaved(false);
    startTransition(async () => {
      const result = await updateBusinessHours(data);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      setSaved(true);
    });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        <div className="bg-card border-2 border-border rounded-3xl p-5 md:p-8 flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-1">
          {DAY_DISPLAY_ORDER.map((dayOfWeek) => (
            <DayRow key={dayOfWeek} dayIndex={dayOfWeek} isPending={isPending} />
          ))}
        </div>

        {serverError && (
          <p className="text-center text-sm font-medium text-destructive mt-4">{serverError}</p>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1">
            <ActionButton type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar horários"}
            </ActionButton>
          </div>
          {saved && !isPending && (
            <span className="flex items-center gap-1.5 text-sm font-semibold shrink-0" style={{ color: "var(--brand-sage)" }}>
              <Check className="w-4 h-4" /> Salvo com sucesso
            </span>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
