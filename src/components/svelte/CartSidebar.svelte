<script lang="ts">
  import { cart, cartTotal, clearCart } from '../../lib/stores/cart';
  import { formatPrice } from '../../lib/utils/formatters';
  import CartItemRow from './CartItemRow.svelte';
  import { onMount } from 'svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    currencySymbol?: string;
  }

  let { isOpen, onClose, currencySymbol = '$' }: Props = $props();

  let cartStore = $state(cart.get());
  let total = $state(cartTotal.get());

  onMount(() => {
    const unsubscribeCart = cart.subscribe((value) => {
      cartStore = value;
    });
    const unsubscribeTotal = cartTotal.subscribe((value) => {
      total = value;
    });
    return () => {
      unsubscribeCart();
      unsubscribeTotal();
    };
  });

  function handleCheckout() {
    onClose();
    window.location.href = '/orden/finalizar';
  }
</script>

{#if isOpen}
  <div class="drawer drawer-end z-50">
    <input type="checkbox" class="drawer-toggle" checked={isOpen} />
    <div class="drawer-side">
      <label class="drawer-overlay" onclick={onClose}></label>
      <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Carrito</h2>
          <button class="btn btn-sm btn-circle" onclick={onClose}>✕</button>
        </div>

        {#if cartStore.items.length === 0}
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="text-6xl mb-4">🛒</div>
            <h2 class="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p class="text-base-content/70 mb-6">
              Agrega productos deliciosos a tu carrito para comenzar tu pedido
            </p>
            <a href="/menu" class="btn btn-primary" onclick={onClose}>
              Ver Menú
            </a>
          </div>
        {:else}
          <div class="flex flex-col h-full">
            <div class="flex-1 overflow-y-auto mb-4">
              {#each cartStore.items as item (item.id)}
                <CartItemRow item={item} currencySymbol={currencySymbol} />
              {/each}
            </div>
            <div class="border-t border-base-300 pt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-bold">Total:</span>
                <span class="text-2xl font-bold text-primary">
                  {formatPrice(total, 'USD', currencySymbol)}
                </span>
              </div>
              <div class="flex flex-col gap-2">
                <button class="btn btn-primary" onclick={handleCheckout}>
                  Finalizar Pedido
                </button>
                <a href="/orden/carrito" class="btn btn-outline" onclick={onClose}>
                  Ver Carrito Completo
                </a>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

