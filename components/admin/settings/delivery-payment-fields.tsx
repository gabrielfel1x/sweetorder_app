import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import type { SettingsFormData } from "@/components/admin/store-settings-form";

function PaymentToggle({
  name,
  label,
  isPending,
}: {
  name: "acceptsPix" | "acceptsCash" | "acceptsCard";
  label: string;
  isPending: boolean;
}) {
  const { control } = useFormContext<SettingsFormData>();

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-sm font-medium">{label}</span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={isPending}
          />
        )}
      />
    </div>
  );
}

export function DeliveryPaymentFields({ isPending }: { isPending: boolean }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SettingsFormData>();

  const acceptsPix = watch("acceptsPix");

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-5 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Frete grátis a partir de</FieldLabel>
          <Input
            type="number"
            step="0.01"
            min="0"
            disabled={isPending}
            className={inputClass(!!errors.freeDeliveryThreshold)}
            {...register("freeDeliveryThreshold", { valueAsNumber: true })}
          />
          <FieldError>{errors.freeDeliveryThreshold?.message}</FieldError>
        </div>
        <div>
          <FieldLabel>Taxa de entrega</FieldLabel>
          <Input
            type="number"
            step="0.01"
            min="0"
            disabled={isPending}
            className={inputClass(!!errors.deliveryFee)}
            {...register("deliveryFee", { valueAsNumber: true })}
          />
          <FieldError>{errors.deliveryFee?.message}</FieldError>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex flex-col gap-1">
        <FieldLabel>Formas de pagamento aceitas</FieldLabel>
        <PaymentToggle name="acceptsPix" label="Pix" isPending={isPending} />
        <PaymentToggle name="acceptsCash" label="Dinheiro na entrega" isPending={isPending} />
        <PaymentToggle name="acceptsCard" label="Cartão na entrega" isPending={isPending} />
      </div>

      {acceptsPix && (
        <div>
          <FieldLabel>Chave Pix</FieldLabel>
          <Input
            placeholder="CPF, e-mail, telefone ou chave aleatória"
            disabled={isPending}
            className={inputClass(!!errors.pixKey)}
            {...register("pixKey")}
          />
          <FieldError>{errors.pixKey?.message}</FieldError>
        </div>
      )}
    </div>
  );
}
