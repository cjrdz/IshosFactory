// Formatting utilities

export function formatPrice(amount: number, currency: string = 'USD', symbol: string = '$'): string {
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatCurrency(amount: number, locale: string = 'es-SV', currency: string = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for El Salvador (8 digits) or international
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  return phone;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}


