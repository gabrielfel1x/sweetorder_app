import { NewClientForm } from "@/components/superadmin/new-client-form";

export const metadata = {
  title: "Novo cliente — Painel SaaS",
};

export default function NewClientPage() {
  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-3xl font-black tracking-tight">Novo cliente</h1>
      <p className="mt-1.5 text-muted-foreground">
        Crie a loja e envie um convite por e-mail para o cliente definir a própria senha.
      </p>

      <div className="mt-8">
        <NewClientForm />
      </div>
    </div>
  );
}
