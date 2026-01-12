// App constants

export const STORAGE_KEYS = {
  CART: 'ishos_cart',
  THEME: 'ishos_theme',
} as const;

export const CART_STORAGE_KEY = STORAGE_KEYS.CART;

export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_CURRENCY_SYMBOL = '$';

export const WHATSAPP_DEFAULT_MESSAGE = 'Hola! Me gustaría hacer un pedido:';

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const CATEGORIES = {
  GELATOS: 'gelatos',
  SORBETES: 'sorbetes',
  ESPECIALES: 'especiales',
  EXTRAS: 'extras',
} as const;

