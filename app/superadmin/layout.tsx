import { redirect } from "next/navigation";
import Link from "next/link";
import { Cookie, LogOut, LayoutGrid, UserPlus } from "lucide-react";
import { getAuthUser, getCurrentSuperAdmin } from "@/lib/session-helpers";
import { logoutAction } from "@/app/login/actions";

export const metadata = {
  title: "Painel SaaS",
};

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const superAdmin = await getCurrentSuperAdmin();
  if (!superAdmin) redirect("/admin");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/superadmin" className="flex items-center gap-2 shrink-0">
            <Cookie className="w-5 h-5" style={{ color: "var(--brand-sage)" }} />
            <span
              className="font-heading text-lg font-bold tracking-tight hidden sm:inline"
              style={{ color: "var(--brand-sage)" }}
            >
              Painel SaaS
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/superadmin"
              className="flex items-center gap-1.5 px-3.5 h-9 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </Link>
            <Link
              href="/superadmin/clientes/novo"
              className="flex items-center gap-1.5 px-3.5 h-9 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo cliente</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline text-sm text-muted-foreground">
              Olá, <strong className="text-foreground font-semibold">{superAdmin.name}</strong>
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-border hover:border-destructive hover:text-destructive transition-colors cursor-pointer active:scale-95"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 md:px-8 py-8">{children}</main>
    </div>
  );
}
