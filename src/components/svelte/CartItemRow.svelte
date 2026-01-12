<script lang="ts">
  import type { CartItem } from '../../types/cart';
  import { formatPrice } from '../../lib/utils/formatters';
  import { updateCartItemQuantity, removeFromCart } from '../../lib/stores/cart';
  import QuantitySelector from './QuantitySelector.svelte';

  interface Props {
    item: CartItem;
    currencySymbol?: string;
  }

  let { item, currencySymbol = '$' }: Props = $props();

  function handleQuantityChange(quantity: number) {
    updateCartItemQuantity(item.id, quantity);
  }

  function handleRemove() {
    removeFromCart(item.id);
  }
</script>

<div class="flex items-center gap-4 p-4 border-b border-base-300">
  <div class="flex-1">
    <h3 class="font-semibold">{item.product.name}</h3>
    {#if item.selectedSize}
      <p class="text-sm text-base-content/70">Tamaño: {item.selectedSize.name}</p>
    {/if}
    {#if item.selectedFlavor}
      <p class="text-sm text-base-content/70">Sabor: {item.selectedFlavor}</p>
    {/if}
    {#if item.notes}
      <p class="text-sm text-base-content/70 italic">Nota: {item.notes}</p>
    {/if}
  </div>
  <div class="flex items-center gap-4">
    <QuantitySelector
      quantity={item.quantity}
      onUpdate={handleQuantityChange}
    />
    <div class="text-right min-w-[80px]">
      <p class="font-semibold">
        {formatPrice(item.subtotal, 'USD', currencySymbol)}
      </p>
      <p class="text-xs text-base-content/70">
        {formatPrice(item.unitPrice, 'USD', currencySymbol)} c/u
      </p>
    </div>
    <button
      class="btn btn-sm btn-ghost btn-circle"
      onclick={handleRemove}
      aria-label="Eliminar del carrito"
    >
      ✕
    </button>
  </div>
</div>


