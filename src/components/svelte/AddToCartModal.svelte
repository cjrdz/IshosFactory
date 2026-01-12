<script lang="ts">
  import type { Product, ProductSize } from '../../types/menu';
  import { addToCart } from '../../lib/stores/cart';
  import { showToast } from '../../lib/stores/toast';
  import { formatPrice } from '../../lib/utils/formatters';
  import QuantitySelector from './QuantitySelector.svelte';
  import { onMount } from 'svelte';

  interface Props {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    currencySymbol?: string;
  }

  let {
    product,
    isOpen,
    onClose,
    currencySymbol = '$',
  }: Props = $props();

  let quantity = $state(1);
  let selectedSize: ProductSize | undefined = $state(undefined);
  let selectedFlavor: string | undefined = $state(undefined);
  let notes = $state('');
  let customerName = $state('');
  let customerPhone = $state('');

  // Load saved customer info from localStorage
  onMount(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('ishos_customer_name');
      const savedPhone = localStorage.getItem('ishos_customer_phone');
      if (savedName) customerName = savedName;
      if (savedPhone) customerPhone = savedPhone;
    }
  });

  $effect(() => {
    if (product) {
      // Reset form when product changes (but keep customer info)
      quantity = 1;
      selectedSize = undefined;
      selectedFlavor = undefined;
      notes = '';
    }
  });

  function saveCustomerInfo() {
    if (typeof window !== 'undefined') {
      if (customerName) localStorage.setItem('ishos_customer_name', customerName);
      if (customerPhone) localStorage.setItem('ishos_customer_phone', customerPhone);
    }
  }

  function handleAddToCart() {
    if (!product) return;

    // Save customer info
    saveCustomerInfo();

    addToCart(product, quantity, selectedSize, selectedFlavor, notes || undefined);
    showToast(`${product.name} agregado al carrito`, 'success');
    onClose();
  }

  function handleAddAndViewCart() {
    if (!product) return;

    // Save customer info
    saveCustomerInfo();

    addToCart(product, quantity, selectedSize, selectedFlavor, notes || undefined);
    showToast(`${product.name} agregado al carrito`, 'success');
    onClose();
    // Navigate to cart
    if (typeof window !== 'undefined') {
      window.location.href = '/orden/carrito';
    }
  }

  function handleContinueShopping() {
    if (!product) return;

    // Save customer info
    saveCustomerInfo();

    addToCart(product, quantity, selectedSize, selectedFlavor, notes || undefined);
    showToast(`${product.name} agregado al carrito`, 'success');
    onClose();
  }

  function getCurrentPrice(): number {
    if (selectedSize) {
      return selectedSize.price;
    }
    return product?.price || 0;
  }
</script>

{#if isOpen && product}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{product.name}</h3>
      <p class="text-sm text-base-content/70 mb-4">{product.description}</p>

      {#if product.sizes && product.sizes.length > 0}
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Tamaño</span>
          </label>
          <div class="flex flex-wrap gap-2">
            {#each product.sizes as size}
              <button
                class={`btn btn-sm ${selectedSize?.name === size.name ? 'btn-primary' : 'btn-outline'}`}
                onclick={() => (selectedSize = size)}
              >
                {size.name} - {formatPrice(size.price, 'USD', currencySymbol)}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      {#if product.flavors && product.flavors.length > 0}
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Sabor</span>
          </label>
          <select
            class="select select-bordered"
            onchange={(e) => (selectedFlavor = (e.target as HTMLSelectElement).value)}
          >
            <option value="">Seleccionar sabor</option>
            {#each product.flavors as flavor}
              <option value={flavor}>{flavor}</option>
            {/each}
          </select>
        </div>
      {/if}

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Cantidad</span>
        </label>
        <QuantitySelector quantity={quantity} onUpdate={(q) => (quantity = q)} />
      </div>

      <div class="divider my-4">Información del Cliente</div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Nombre completo (opcional)</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="Tu nombre"
          bind:value={customerName}
        />
        <label class="label">
          <span class="label-text-alt text-base-content/60">Se guardará para futuros pedidos</span>
        </label>
      </div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Teléfono (opcional)</span>
        </label>
        <input
          type="tel"
          class="input input-bordered"
          placeholder="1234-5678"
          bind:value={customerPhone}
        />
        <label class="label">
          <span class="label-text-alt text-base-content/60">Se guardará para futuros pedidos</span>
        </label>
      </div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Notas adicionales (opcional)</span>
        </label>
        <textarea
          class="textarea textarea-bordered"
          placeholder="Ej: Sin nueces, extra caliente..."
          bind:value={notes}
        ></textarea>
      </div>

      <div class="flex justify-between items-center mb-4">
        <span class="text-lg font-bold">
          Total: {formatPrice(getCurrentPrice() * quantity, 'USD', currencySymbol)}
        </span>
      </div>

      <div class="modal-action flex-col sm:flex-row gap-2">
        <button class="btn btn-ghost w-full sm:w-auto" onclick={onClose}>Cancelar</button>
        <button class="btn btn-outline btn-primary w-full sm:w-auto" onclick={handleAddAndViewCart}>
          Agregar y Ver Carrito
        </button>
        <button class="btn btn-primary w-full sm:w-auto" onclick={handleContinueShopping}>
          Agregar y Continuar Comprando
        </button>
      </div>
    </div>
    <div class="modal-backdrop" onclick={onClose}></div>
  </div>
{/if}


