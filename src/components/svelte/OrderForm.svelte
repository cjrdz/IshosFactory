<script lang="ts">
  import type { OrderFormData } from '../../types/order';
  import { validateOrderForm } from '../../lib/utils/validators';
  import { showToast } from '../../lib/stores/toast';
  import { cart, cartTotal } from '../../lib/stores/cart';
  import { formatWhatsAppMessage, generateWhatsAppURL } from '../../lib/utils/whatsapp';
  import { onMount } from 'svelte';

  interface Props {
    onSubmit: (data: OrderFormData) => void;
    initialData?: Partial<OrderFormData>;
    currencySymbol?: string;
  }

  let { onSubmit, initialData = {}, currencySymbol = '$' }: Props = $props();

  let formData = $state<OrderFormData>({
    name: initialData.name || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    address: initialData.address || '',
    orderType: initialData.orderType || 'pickup',
    deliveryNotes: initialData.deliveryNotes || '',
    notes: initialData.notes || '',
  });

  let errors = $state<string[]>([]);

  // Load saved customer info from localStorage
  onMount(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('ishos_customer_name');
      const savedPhone = localStorage.getItem('ishos_customer_phone');
      const savedEmail = localStorage.getItem('ishos_customer_email');
      const savedAddress = localStorage.getItem('ishos_customer_address');
      
      // Only pre-fill if not already set from initialData
      if (!formData.name && savedName) {
        formData.name = savedName;
      }
      if (!formData.phone && savedPhone) {
        formData.phone = savedPhone;
      }
      if (!formData.email && savedEmail) {
        formData.email = savedEmail;
      }
      if (!formData.address && savedAddress) {
        formData.address = savedAddress;
      }
    }
  });

  function saveCustomerInfo() {
    if (typeof window !== 'undefined') {
      if (formData.name) localStorage.setItem('ishos_customer_name', formData.name);
      if (formData.phone) localStorage.setItem('ishos_customer_phone', formData.phone);
      if (formData.email) localStorage.setItem('ishos_customer_email', formData.email);
      if (formData.address) localStorage.setItem('ishos_customer_address', formData.address);
    }
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    errors = [];

    const validation = validateOrderForm(formData);
    if (!validation.valid) {
      errors = validation.errors;
      validation.errors.forEach((error) => showToast(error, 'error'));
      return;
    }

    // Save customer info to localStorage
    saveCustomerInfo();

    // Get cart items and total
    const cartStore = cart.get();
    const total = cartTotal.get();

    if (cartStore.items.length === 0) {
      showToast('El carrito está vacío', 'error');
      return;
    }

    // Combine notes: delivery notes and additional notes
    const allNotes = [formData.deliveryNotes, formData.notes]
      .filter(Boolean)
      .join(' | ') || undefined;

    // Format WhatsApp message
    const message = formatWhatsAppMessage(
      cartStore.items,
      total,
      formData.name,
      formData.phone,
      formData.orderType,
      formData.address,
      allNotes,
      currencySymbol
    );

    // Use test phone number for now
    const testPhoneNumber = '+50375476001';
    const whatsappURL = generateWhatsAppURL(testPhoneNumber, message);

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message
    showToast('Redirigiendo a WhatsApp...', 'success');

    // Still call onSubmit for any additional handling
    onSubmit(formData);
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  <div class="form-control">
    <label class="label">
      <span class="label-text">Nombre completo *</span>
    </label>
    <input
      type="text"
      class="input input-bordered"
      required
      bind:value={formData.name}
    />
  </div>

  <div class="form-control">
    <label class="label">
      <span class="label-text">Teléfono *</span>
    </label>
    <input
      type="tel"
      class="input input-bordered"
      required
      placeholder="1234-5678"
      bind:value={formData.phone}
    />
  </div>

  <div class="form-control">
    <label class="label">
      <span class="label-text">Correo electrónico (opcional)</span>
    </label>
    <input
      type="email"
      class="input input-bordered"
      bind:value={formData.email}
    />
  </div>

  <div class="form-control">
    <label class="label">
      <span class="label-text">Tipo de pedido *</span>
    </label>
    <div class="flex gap-4">
      <label class="label cursor-pointer">
        <input
          type="radio"
          name="orderType"
          class="radio radio-primary"
          value="pickup"
          bind:group={formData.orderType}
        />
        <span class="label-text ml-2">Recoger en tienda</span>
      </label>
      <label class="label cursor-pointer">
        <input
          type="radio"
          name="orderType"
          class="radio radio-primary"
          value="delivery"
          bind:group={formData.orderType}
        />
        <span class="label-text ml-2">Entrega a domicilio</span>
      </label>
    </div>
  </div>

  {#if formData.orderType === 'delivery'}
    <div class="form-control">
      <label class="label">
        <span class="label-text">Dirección de entrega *</span>
      </label>
      <textarea
        class="textarea textarea-bordered"
        required
        placeholder="Dirección completa"
        bind:value={formData.address}
      ></textarea>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Instrucciones de entrega (opcional)</span>
      </label>
      <textarea
        class="textarea textarea-bordered"
        placeholder="Ej: Llamar antes de llegar, dejar en la puerta..."
        bind:value={formData.deliveryNotes}
      ></textarea>
    </div>
  {/if}

  <div class="form-control">
    <label class="label">
      <span class="label-text">Notas adicionales (opcional)</span>
    </label>
    <textarea
      class="textarea textarea-bordered"
      placeholder="Alguna preferencia especial..."
      bind:value={formData.notes}
    ></textarea>
  </div>

  {#if errors.length > 0}
    <div class="alert alert-error">
      <ul class="list-disc list-inside">
        {#each errors as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="form-control mt-6">
    <button type="submit" class="btn btn-primary btn-lg">
      Confirmar Pedido
    </button>
  </div>
</form>


