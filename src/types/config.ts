export interface StoreConfig {
  store: {
    name: string;
    tagline: string;
    logo: string;
    contact: {
      whatsappNumber: string;
      whatsappCountryCode: string;
      whatsappMessage?: string;
      email: string;
      phone: string;
    };
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    social: {
      facebook: string;
      instagram: string;
      tiktok: string;
    };
  };
  businessHours: Record<string, BusinessHours>;
  settings: Settings;
  messages: Messages;
}

export interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface Settings {
  currency: string;
  currencySymbol: string;
  taxRate: number;
  enableOrdering: boolean;
  minOrderAmount: number;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
}

export interface Messages {
  welcomeMessage: string;
  orderGreeting: string;
  closedMessage: string;
  orderSuccessMessage: string;
}
