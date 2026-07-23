export type ProductDTO = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  visual: { bg: string; emoji: string };
  imageUrl: string | null;
  cardPrice: number | null;
};

export type ProductAdminDTO = ProductDTO & {
  active: boolean;
  sortOrder: number;
};

export type StoreListItemDTO = {
  id: string;
  slug: string;
  storeName: string;
  storeDescription: string;
  brandColor: string;
  isPublished: boolean;
  logoUrl: string | null;
};

export type StoreSettingsDTO = {
  id: string;
  storeName: string;
  storeDescription: string;
  slug: string;
  email: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  instagramUrl: string;
  acceptsPix: boolean;
  pixKey: string;
  acceptsCash: boolean;
  acceptsCard: boolean;
  acceptsInstallments: boolean;
  brandColor: string;
  themeColor: string;
  brandIcon: string;
  logoUrl: string | null;
  isPublished: boolean;
  manuallyClosedDate: string | null;
};

export type BusinessHourShiftDTO = {
  openTime: string;
  closeTime: string;
};

export type BusinessHourDayDTO = {
  dayOfWeek: number;
  isOpen: boolean;
  shifts: BusinessHourShiftDTO[];
};
