"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ActionButton, FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import {
  createProduct,
  deleteProduct,
  toggleProductActive,
  updateProduct,
  uploadProductImage,
} from "@/app/admin/produtos/actions";
import { getStoreEmoji, getStoreEmojiPresets } from "@/lib/store-icons";
import type { ProductAdminDTO } from "@/lib/types";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const COLOR_PRESETS = [
  "#F2E0C4",
  "#3D1A08",
  "#D4A84B",
  "#4A7C59",
  "#3D5A9A",
  "#6B3A2A",
  "#E8D5A3",
  "#C8A96E",
  "#8B1A1A",
];

const productSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  description: z.string().trim().min(1, "Descrição é obrigatória"),
  price: z.number({ error: "Informe um preço válido" }).positive("Preço deve ser maior que zero"),
  category: z.string().trim().min(1, "Categoria é obrigatória"),
  visualBg: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Escolha uma cor"),
  visualEmoji: z.string().trim().min(1, "Escolha um emoji").max(4, "Use apenas 1 emoji"),
  imageUrl: z.string().trim().url().nullable().optional(),
  cardPrice: z.number().positive("Preço deve ser maior que zero").nullable().optional(),
  installments: z.number().int().min(1, "Mínimo 1 parcela").max(24, "Máximo 24 parcelas").nullable().optional(),
}).refine((data) => (data.cardPrice == null) === (data.installments == null), {
  message: "Preencha o preço no cartão e o número de parcelas juntos",
  path: ["cardPrice"],
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductsAdmin({
  initialProducts,
  brandIcon,
  acceptsInstallments,
}: {
  initialProducts: ProductAdminDTO[];
  brandIcon?: string;
  acceptsInstallments: boolean;
}) {
  const router = useRouter();
  const emojiPresets = useMemo(() => getStoreEmojiPresets(brandIcon), [brandIcon]);
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductAdminDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductAdminDTO | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const categories = useMemo(
    () => ["todos", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        (category === "todos" || p.category === category) &&
        (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );
  }, [products, search, category]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (product: ProductAdminDTO) => {
    setEditing(product);
    setDialogOpen(true);
  };

  const handleToggleActive = (product: ProductAdminDTO, active: boolean) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active } : p)));
    startTransition(async () => {
      await toggleProductActive(product.id, active);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setProducts((prev) => prev.filter((p) => p.id !== target.id));
    setDeleteTarget(null);
    startTransition(async () => {
      await deleteProduct(target.id);
      router.refresh();
    });
  };

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Painel
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight">Produtos</h1>
          <p className="mt-1.5 text-muted-foreground">
            Cadastre e gerencie os cookies exibidos no catálogo.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="h-11 px-5 rounded-full font-heading font-bold text-sm text-white cursor-pointer active:scale-95 transition-transform flex items-center gap-2 shrink-0"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 rounded-full bg-secondary border-0 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 h-10 rounded-full text-sm font-medium capitalize transition-all duration-200 cursor-pointer ${
                category === cat
                  ? "text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-border"
              }`}
              style={category === cat ? { backgroundColor: "var(--primary)" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 bg-card border-2 border-border rounded-3xl overflow-hidden flex flex-col items-center justify-center py-16 text-center gap-3">
          <span className="text-5xl select-none">{getStoreEmoji(brandIcon)}</span>
          <p className="font-heading font-bold">Nenhum produto encontrado</p>
          <p className="text-sm text-muted-foreground">
            {products.length === 0 ? "Cadastre o primeiro produto do catálogo." : "Tente outro termo ou categoria."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:hidden">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-card border-2 border-border rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <ProductThumb product={product} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-bold text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer shrink-0"
                        aria-label="Ações"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(product)}>
                        <Pencil className="w-3.5 h-3.5" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="capitalize rounded-full">
                      {product.category}
                    </Badge>
                    <span className="font-semibold text-sm">{fmt(product.price)}</span>
                  </div>
                  <Switch
                    checked={product.active}
                    onCheckedChange={(checked) => handleToggleActive(product, checked)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 hidden sm:block bg-card border-2 border-border rounded-3xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProductThumb product={product} size={40} />
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize rounded-full">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{fmt(product.price)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={product.active}
                        onCheckedChange={(checked) => handleToggleActive(product, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
                            aria-label="Ações"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(product)}>
                            <Pencil className="w-3.5 h-3.5" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteTarget(product)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        emojiPresets={emojiPresets}
        acceptsInstallments={acceptsInstallments}
        onSaved={(saved) => {
          setProducts((prev) => {
            const exists = prev.some((p) => p.id === saved.id);
            return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
          });
          setDialogOpen(false);
          router.refresh();
        }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  Tem certeza que deseja excluir <strong className="text-foreground">{deleteTarget.name}</strong>?
                  Essa ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProductThumb({
  product,
  size,
}: {
  product: { visual: { bg: string; emoji: string }; imageUrl: string | null; name: string };
  size: number;
}) {
  if (product.imageUrl) {
    return (
      <div
        className="relative rounded-xl overflow-hidden shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className="rounded-xl flex items-center justify-center shrink-0 text-xl"
      style={{ backgroundColor: product.visual.bg, width: size, height: size }}
    >
      {product.visual.emoji}
    </div>
  );
}

function ProductImageField({
  value,
  onChange,
  disabled,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProductImage(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      onChange(result.url ?? null);
    } catch {
      setError("Erro ao enviar imagem. Tente uma foto menor ou verifique sua conexão.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <FieldLabel>Imagem do produto</FieldLabel>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-border">
            <Image src={value} alt="" fill sizes="64px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled || isUploading}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
              aria-label="Remover imagem"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 text-muted-foreground">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
            className="h-9 px-4 rounded-full text-sm font-medium bg-secondary hover:bg-border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUploading ? "Enviando..." : value ? "Trocar imagem" : "Escolher imagem"}
          </button>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG ou WEBP, até 5MB.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function ProductDialog({
  open,
  onOpenChange,
  product,
  emojiPresets,
  acceptsInstallments,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductAdminDTO | null;
  emojiPresets: string[];
  acceptsInstallments: boolean;
  onSaved: (product: ProductAdminDTO) => void;
}) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    values: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      category: product?.category ?? "",
      visualBg: product?.visual.bg ?? COLOR_PRESETS[0],
      visualEmoji: product?.visual.emoji ?? emojiPresets[0],
      imageUrl: product?.imageUrl ?? null,
      cardPrice: product?.cardPrice ?? null,
      installments: product?.installments ?? null,
    },
  });

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const bg = watch("visualBg");
  const emoji = watch("visualEmoji");
  const imageUrl = watch("imageUrl");
  const cardPrice = watch("cardPrice");
  const installments = watch("installments");

  const onSubmit = handleSubmit((data) => {
    setServerError("");
    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(product!.id, data)
        : await createProduct(data);

      if (result?.error) {
        setServerError(result.error);
        return;
      }

      onSaved({
        id: product?.id ?? crypto.randomUUID(),
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        visual: { bg: data.visualBg, emoji: data.visualEmoji },
        imageUrl: data.imageUrl ?? null,
        cardPrice: acceptsInstallments ? data.cardPrice ?? null : null,
        installments: acceptsInstallments ? data.installments ?? null : null,
        active: product?.active ?? true,
        sortOrder: product?.sortOrder ?? 0,
      });
      reset();
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-black">
            {isEditing ? "Editar produto" : "Novo produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="mt-2">
          <div>
            <FieldLabel>Nome</FieldLabel>
            <Input
              placeholder="Ex: Chocolate Chip Clássico"
              disabled={isPending}
              className={inputClass(!!errors.name)}
              {...register("name")}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </div>

          <div className="mt-3">
            <FieldLabel>Descrição</FieldLabel>
            <Textarea
              placeholder="Descreva o cookie..."
              disabled={isPending}
              rows={2}
              className={inputClass(!!errors.description, "rounded-xl px-4 py-2.5 border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none")}
              {...register("description")}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>{acceptsInstallments ? "Preço no Pix" : "Preço"}</FieldLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                disabled={isPending}
                className={inputClass(!!errors.price)}
                {...register("price", { valueAsNumber: true })}
              />
              <FieldError>{errors.price?.message}</FieldError>
            </div>
            <div>
              <FieldLabel>Categoria</FieldLabel>
              <Input
                placeholder="Ex: clássicos"
                disabled={isPending}
                className={inputClass(!!errors.category)}
                {...register("category")}
              />
              <FieldError>{errors.category?.message}</FieldError>
            </div>
          </div>

          {acceptsInstallments && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Preço no cartão</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  disabled={isPending}
                  className={inputClass(!!errors.cardPrice)}
                  {...register("cardPrice", {
                    setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                  })}
                />
                <FieldError>{errors.cardPrice?.message}</FieldError>
              </div>
              <div>
                <FieldLabel>Parcelas</FieldLabel>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  max="24"
                  placeholder="Ex: 3"
                  disabled={isPending}
                  className={inputClass(!!errors.installments)}
                  {...register("installments", {
                    setValueAs: (v) => (v === "" || v === null ? null : parseInt(v, 10)),
                  })}
                />
                <FieldError>{errors.installments?.message}</FieldError>
                {!!cardPrice && !!installments && installments > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {installments}x de {fmt(cardPrice / installments)}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-3">
            <ProductImageField
              value={imageUrl}
              onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
              disabled={isPending}
            />
          </div>

          <div className="mt-3">
            <FieldLabel>Cor</FieldLabel>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("visualBg", color, { shouldValidate: true })}
                  className="w-8 h-8 rounded-full border-2 cursor-pointer transition-transform active:scale-90"
                  style={{
                    backgroundColor: color,
                    borderColor: bg === color ? "var(--foreground)" : "transparent",
                  }}
                  aria-label={color}
                />
              ))}
              <Input
                type="text"
                value={bg}
                onChange={(e) => setValue("visualBg", e.target.value, { shouldValidate: true })}
                disabled={isPending}
                className={inputClass(!!errors.visualBg, "rounded-xl h-8 px-3 py-0 leading-[1.9rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors w-24 text-xs")}
              />
            </div>
            <FieldError>{errors.visualBg?.message}</FieldError>
          </div>

          <div className="mt-3">
            <FieldLabel>Emoji</FieldLabel>
            <div className="flex items-center gap-2 flex-wrap">
              {emojiPresets.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setValue("visualEmoji", e, { shouldValidate: true })}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform active:scale-90 bg-secondary"
                  style={{ borderColor: emoji === e ? "var(--foreground)" : "transparent" }}
                >
                  {e}
                </button>
              ))}
              <Input
                type="text"
                value={emoji}
                onChange={(e) => setValue("visualEmoji", e.target.value, { shouldValidate: true })}
                disabled={isPending}
                className={inputClass(!!errors.visualEmoji, "rounded-xl h-8 px-3 py-0 leading-[1.9rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors w-16 text-center")}
              />
            </div>
            <FieldError>{errors.visualEmoji?.message}</FieldError>
          </div>

          {serverError && (
            <p className="text-center text-sm font-medium text-destructive mt-4">{serverError}</p>
          )}

          <div className="mt-6">
            <ActionButton type="submit" color="var(--primary)" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? "Salvar alterações" : "Criar produto"}
            </ActionButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
