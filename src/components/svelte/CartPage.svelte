<script lang="ts">
  import { cart, cartTotal } from '../../lib/stores/cart';
  import CartItemRow from './CartItemRow.svelte';
  import { formatPrice } from '../../lib/utils/formatters';
  import type { CartSummary } from '../../types/cart';
  import { onMount } from 'svelte';

  interface Props {
    currencySymbol?: string;
    taxRate?: number;
  }

  let { currencySymbol = '$', taxRate = 0.13 }: Props = $props();

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

  let summary = $derived({
    subtotal: total,
    tax: 0, // IVA is already included in product prices in El Salvador
    total: total, // Total is the same as subtotal since tax is included
    itemCount: cartStore.itemCount,
  } as CartSummary);
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-2">
    <div class="bg-base-100 rounded-lg shadow-lg p-6">
      {#if cartStore.items.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <div class="text-6xl mb-4">🛒</div>
          <h2 class="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p class="text-base-content/70 mb-6">
            Agrega productos deliciosos a tu carrito para comenzar tu pedido
          </p>
          <a href="/menu" class="btn btn-primary">
            Ver Menú
          </a>
        </div>
      {:else}
        <div class="space-y-0">
          {#each cartStore.items as item (item.id)}
            <CartItemRow item={item} currencySymbol={currencySymbol} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div class="lg:col-span-1">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Resumen del Pedido</h2>
        <div class="divider"></div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Subtotal ({summary.itemCount} {summary.itemCount === 1 ? 'artículo' : 'artículos'})</span>
            <span class="font-semibold">{formatPrice(summary.subtotal, 'USD', currencySymbol)}</span>
          </div>
          <div class="divider"></div>
          <div class="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span class="text-primary">{formatPrice(summary.total, 'USD', currencySymbol)}</span>
          </div>
        </div>
      </div>
    </div>
    {#if cartStore.items.length > 0}
      <div class="mt-4">
        <a href="/orden/finalizar" class="btn btn-primary btn-block btn-lg">
          Finalizar Pedido
        </a>
      </div>
    {/if}
  </div>
</div>

