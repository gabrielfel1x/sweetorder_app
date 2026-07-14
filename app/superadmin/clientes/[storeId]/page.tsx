import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Mail, Package, Phone, User } from "lucide-react";
import { getClientDetail } from "@/lib/superadmin";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const client = await getClientDetail(storeId);
  if (!client) notFound();

  return (
    <div>
      <Link
        href="/superadmin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-black tracking-tight">{client.storeName}</h1>
        <a
          href={`/${client.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 h-10 px-4 rounded-full border-2 border-border font-semibold text-sm flex items-center gap-2 hover:border-foreground transition-colors"
        >
          Ver loja
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <p className="mt-1 text-muted-foreground">/{client.slug}</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={<User className="w-4 h-4" />} label="Administrador" value={client.adminName} />
        <InfoCard icon={<Mail className="w-4 h-4" />} label="E-mail" value={client.adminEmail} />
        <InfoCard icon={<Phone className="w-4 h-4" />} label="WhatsApp da loja" value={client.whatsappNumber || "—"} />
        <InfoCard icon={<Package className="w-4 h-4" />} label="Produtos cadastrados" value={String(client.productCount)} />
      </div>

      {client.storeDescription && (
        <div className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Descrição da loja
          </p>
          <p className="text-sm">{client.storeDescription}</p>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-5">
      <div className="flex items-center gap-2.5 mb-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <p className="font-heading font-bold truncate">{value}</p>
    </div>
  );
}
