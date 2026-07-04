import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { ALLOWED_WHATSAPP_PLACEHOLDERS } from "@/lib/whatsapp-template";
import type { SettingsFormData } from "@/components/admin/store-settings-form";

export function ContactFields({ isPending }: { isPending: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsFormData>();

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-5 flex flex-col gap-4">
      <div>
        <FieldLabel>
          WhatsApp <span className="normal-case font-normal tracking-normal">(com DDI e DDD, só números)</span>
        </FieldLabel>
        <Input
          placeholder="5585999999999"
          inputMode="numeric"
          disabled={isPending}
          className={inputClass(!!errors.whatsappNumber)}
          {...register("whatsappNumber")}
        />
        <FieldError>{errors.whatsappNumber?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Instagram</FieldLabel>
        <Input
          placeholder="https://instagram.com/sualoja"
          disabled={isPending}
          className={inputClass(!!errors.instagramUrl)}
          {...register("instagramUrl")}
        />
        <FieldError>{errors.instagramUrl?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Mensagem enviada no WhatsApp do pedido</FieldLabel>
        <Textarea
          disabled={isPending}
          rows={10}
          className={inputClass(
            !!errors.whatsappMessageTemplate,
            "rounded-xl px-4 py-2.5 border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors font-mono text-xs resize-y"
          )}
          {...register("whatsappMessageTemplate")}
        />
        <FieldError>{errors.whatsappMessageTemplate?.message}</FieldError>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ALLOWED_WHATSAPP_PLACEHOLDERS.map((placeholder) => (
            <span
              key={placeholder}
              className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-mono"
            >
              {`{{${placeholder}}}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
