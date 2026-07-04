import { cn } from "@/lib/utils";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{children}</p>;
}

export function inputClass(
  hasError: boolean,
  base = "rounded-xl h-12 px-4 py-0 leading-[2.75rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
) {
  return cn(base, hasError && "border-destructive focus-visible:border-destructive");
}

export function ActionButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 rounded-2xl font-heading text-base font-black flex items-center justify-center gap-2 text-white transition-all duration-200 cursor-pointer active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      style={{ backgroundColor: "var(--brand-sage)" }}
    >
      {children}
    </button>
  );
}
