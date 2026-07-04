export type ProductDTO = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  visual: { bg: string; emoji: string };
};

export type ProductAdminDTO = ProductDTO & {
  active: boolean;
  sortOrder: number;
};

export type StoreSettingsDTO = {
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
