<script lang="ts">
  import type { Product, ProductSize } from '../../types/menu';
  import { addToCart, cart, isEmpty } from '../../lib/stores/cart';
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
  let productAdded = $state(false);
  let viewCartClicks = $state(0);

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
      productAdded = false;
      viewCartClicks = 0;
    }
  });

  // Reset added state when selections change (after product was added)
  $effect(() => {
    // Access reactive variables to track them
    const _ = quantity;
    const __ = selectedSize;
    const ___ = selectedFlavor;
    const ____ = notes;
    
    // Only reset if product was previously added
    if (productAdded) {
      productAdded = false;
      viewCartClicks = 0;
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

    // Validate size selection if required
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showToast('Por favor selecciona un tamaño', 'warning');
      return;
    }

    // Save customer info
    saveCustomerInfo();

    addToCart(product, quantity, selectedSize, selectedFlavor, notes || undefined);
    showToast(`${product.name} agregado al carrito`, 'success');
    productAdded = true;
    onClose();
  }

  function handleViewCart() {
    if (!product) return;

    // Validate size selection if required
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showToast('Por favor selecciona un tamaño', 'warning');
      return;
    }

    // Check if cart already has items
    const cartHasItems = !isEmpty.get();
    
    // If cart has items, navigate directly (no need to add current product first)
    if (cartHasItems) {
      onClose();
      if (typeof window !== 'undefined') {
        window.location.href = '/orden/carrito';
      }
      return;
    }

    // Cart is empty - check if product was added first
    if (!productAdded) {
      viewCartClicks++;
      
      // Show warning notification
      showToast('Por favor agrega el producto primero antes de ver el carrito', 'warning', 4000);
      
      // If clicked twice, navigate to cart anyway (even if empty)
      if (viewCartClicks >= 2) {
        onClose();
        if (typeof window !== 'undefined') {
          window.location.href = '/orden/carrito';
        }
      }
      return;
    }

    // Product was added and cart was empty, navigate to cart
    onClose();
    if (typeof window !== 'undefined') {
      window.location.href = '/orden/carrito';
    }
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
          <fieldset>
            <legend class="label" id="size-legend">
              <span class="label-text">Tamaño</span>
            </legend>
            <div class="flex flex-wrap gap-2" role="group" aria-labelledby="size-legend">
              {#each product.sizes as size}
                <button
                  class={`btn btn-sm ${selectedSize?.name === size.name ? 'btn-primary' : 'btn-outline'}`}
                  onclick={() => (selectedSize = size)}
                >
                  {size.name} - {formatPrice(size.price, 'USD', currencySymbol)}
                </button>
              {/each}
            </div>
          </fieldset>
        </div>
      {/if}

      {#if product.flavors && product.flavors.length > 0}
        <div class="form-control mb-4">
          <label class="label" for="flavor-select">
            <span class="label-text">Sabor</span>
          </label>
          <select
            id="flavor-select"
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
        <label class="label" for="quantity-selector">
          <span class="label-text">Cantidad</span>
        </label>
        <div id="quantity-selector">
          <QuantitySelector quantity={quantity} onUpdate={(q) => (quantity = q)} />
        </div>
      </div>

      <div class="divider my-4">Información del Cliente</div>

      <div class="form-control mb-4">
        <label class="label" for="customer-name">
          <span class="label-text">Nombre completo (opcional)</span>
        </label>
        <input
          id="customer-name"
          type="text"
          class="input input-bordered"
          placeholder="Tu nombre"
          bind:value={customerName}
        />
        <div class="label">
          <span class="label-text-alt text-base-content/60">Se guardará para futuros pedidos</span>
        </div>
      </div>

      <div class="form-control mb-4">
        <label class="label" for="customer-phone">
          <span class="label-text">Teléfono (opcional)</span>
        </label>
        <input
          id="customer-phone"
          type="tel"
          class="input input-bordered"
          placeholder="1234-5678"
          bind:value={customerPhone}
        />
        <div class="label">
          <span class="label-text-alt text-base-content/60">Se guardará para futuros pedidos</span>
        </div>
      </div>

      <div class="form-control mb-4">
        <label class="label" for="notes">
          <span class="label-text">Notas adicionales (opcional)</span>
        </label>
        <textarea
          id="notes"
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
        <button 
          class="btn btn-sm btn-ghost w-full sm:w-auto order-3 sm:order-1" 
          onclick={onClose}
        >
          Cancelar
        </button>
        <button 
          class="btn btn-sm btn-primary w-full sm:w-auto order-1 sm:order-2" 
          onclick={handleAddToCart}
          disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
        >
          Agregar
        </button>
        <button 
          class="btn btn-sm btn-outline btn-primary w-full sm:w-auto order-2 sm:order-3 gap-2" 
          onclick={handleViewCart}
          disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Ver Carrito
        </button>
      </div>
    </div>
    <div class="modal-backdrop" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()} role="button" tabindex="0" aria-label="Cerrar modal"></div>
  </div>
{/if}


