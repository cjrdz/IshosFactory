<script lang="ts">
  import type { Product, ProductSize } from '../../types/menu';
  import { addToCart } from '../../lib/stores/cart';
  import { showToast } from '../../lib/stores/toast';
  import { formatPrice } from '../../lib/utils/formatters';
  import QuantitySelector from './QuantitySelector.svelte';
  import { onMount } from 'svelte';

  interface Props {
    product: Product;
    currencySymbol?: string;
  }

  let { product, currencySymbol = '$' }: Props = $props();

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

  function saveCustomerInfo() {
    if (typeof window !== 'undefined') {
      if (customerName) localStorage.setItem('ishos_customer_name', customerName);
      if (customerPhone) localStorage.setItem('ishos_customer_phone', customerPhone);
    }
  }

  function handleAddToCart() {
    saveCustomerInfo();
    addToCart(product, quantity, selectedSize, selectedFlavor, notes || undefined);
    showToast(`${product.name} agregado al carrito`, 'success');
  }

  function handleAddAndViewCart() {
    saveCustomerInfo();
    addToCart(product, quantity, selectedSize, selectedFlavor, notes || undefined);
    showToast(`${product.name} agregado al carrito`, 'success');
    if (typeof window !== 'undefined') {
      window.location.href = '/orden/carrito';
    }
  }

  function getCurrentPrice(): number {
    if (selectedSize) {
      return selectedSize.price;
    }
    return product.price;
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <!-- Product Image -->
  <div class="flex flex-col">
    <div class="bg-base-200 rounded-lg overflow-hidden mb-4">
      <img
        src={product.image}
        alt={product.name}
        class="w-full h-auto object-contain"
        loading="eager"
      />
    </div>
    {#if product.allergens && product.allergens.length > 0}
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-sm">Alérgenos: {product.allergens.join(', ')}</span>
      </div>
    {/if}
  </div>

  <!-- Product Details and Form -->
  <div class="flex flex-col">
    <div class="mb-6">
      <h1 class="text-4xl font-bold mb-2">{product.name}</h1>
      <p class="text-lg text-base-content/70 mb-4">{product.description}</p>
      <div class="flex items-center gap-4 mb-4">
        <span class="text-3xl font-bold text-primary">
          {formatPrice(getCurrentPrice(), 'USD', currencySymbol)}
        </span>
        {#if product.available}
          <div class="badge badge-success badge-lg">Disponible</div>
        {:else}
          <div class="badge badge-error badge-lg">Agotado</div>
        {/if}
      </div>
    </div>

    {#if product.available}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- Size Selection -->
          {#if product.sizes && product.sizes.length > 0}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-semibold">Tamaño *</span>
              </label>
              <div class="flex flex-wrap gap-2">
                {#each product.sizes as size}
                  <button
                    class={`btn ${selectedSize?.name === size.name ? 'btn-primary' : 'btn-outline'}`}
                    onclick={() => (selectedSize = size)}
                  >
                    {size.name} - {formatPrice(size.price, 'USD', currencySymbol)}
                    {#if size.description}
                      <span class="text-xs opacity-70 ml-1">({size.description})</span>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Flavor Selection -->
          {#if product.flavors && product.flavors.length > 0}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-semibold">Sabor</span>
              </label>
              <select
                class="select select-bordered"
                onchange={(e) => (selectedFlavor = (e.target as HTMLSelectElement).value || undefined)}
              >
                <option value="">Seleccionar sabor</option>
                {#each product.flavors as flavor}
                  <option value={flavor}>{flavor}</option>
                {/each}
              </select>
            </div>
          {/if}

          <!-- Quantity -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-semibold">Cantidad</span>
            </label>
            <QuantitySelector quantity={quantity} onUpdate={(q) => (quantity = q)} />
          </div>

          <div class="divider my-4">Información del Cliente</div>

          <!-- Customer Name -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-semibold">Nombre completo (opcional)</span>
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

          <!-- Customer Phone -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-semibold">Teléfono (opcional)</span>
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

          <!-- Additional Notes -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-semibold">Notas adicionales (opcional)</span>
            </label>
            <textarea
              class="textarea textarea-bordered"
              placeholder="Ej: Sin nueces, extra caliente..."
              bind:value={notes}
              rows="3"
            ></textarea>
          </div>

          <!-- Total Price -->
          <div class="flex justify-between items-center mb-6 p-4 bg-base-200 rounded-lg">
            <span class="text-xl font-bold">Total:</span>
            <span class="text-2xl font-bold text-primary">
              {formatPrice(getCurrentPrice() * quantity, 'USD', currencySymbol)}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              class="btn btn-primary btn-lg flex-1"
              onclick={handleAddAndViewCart}
              disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
            >
              Agregar y Ver Carrito
            </button>
            <button
              class="btn btn-outline btn-primary btn-lg flex-1"
              onclick={handleAddToCart}
              disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
            >
              Agregar y Continuar Comprando
            </button>
          </div>

          {#if product.sizes && product.sizes.length > 0 && !selectedSize}
            <div class="alert alert-warning mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="text-sm">Por favor selecciona un tamaño</span>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Este producto no está disponible actualmente</span>
      </div>
    {/if}
  </div>
</div>

