// Form validation utilities

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // El Salvador phone numbers: 8 digits, or international format
  return cleaned.length >= 8 && cleaned.length <= 15;
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOrderForm(data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  orderType: 'pickup' | 'delivery';
}): ValidationResult {
  const errors: string[] = [];

  if (!validateName(data.name)) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (!validatePhone(data.phone)) {
    errors.push('El número de teléfono no es válido');
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push('El correo electrónico no es válido');
  }

  if (data.orderType === 'delivery' && !data.address) {
    errors.push('La dirección es requerida para entrega a domicilio');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


