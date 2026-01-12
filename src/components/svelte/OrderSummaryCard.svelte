<script lang="ts">
  import { cart, cartTotal } from '../../lib/stores/cart';
  import { formatPrice } from '../../lib/utils/formatters';
  import type { CartSummary } from '../../types/cart';
  import { onMount } from 'svelte';

  interface Props {
    currencySymbol?: string;
    taxRate?: number;
    showTax?: boolean;
  }

  let { currencySymbol = '$', taxRate = 0.13, showTax = false }: Props = $props();

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

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Resumen del Pedido</h2>
    <div class="divider"></div>
    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Subtotal ({summary.itemCount} {summary.itemCount === 1 ? 'artículo' : 'artículos'})</span>
        <span class="font-semibold">{formatPrice(summary.subtotal, 'USD', currencySymbol)}</span>
      </div>
      {#if showTax && taxRate > 0 && summary.tax > 0}
        <div class="flex justify-between">
          <span>IVA ({Math.round(taxRate * 100)}%)</span>
          <span class="font-semibold">{formatPrice(summary.tax, 'USD', currencySymbol)}</span>
        </div>
      {/if}
      <div class="divider"></div>
      <div class="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span class="text-primary">{formatPrice(summary.total, 'USD', currencySymbol)}</span>
      </div>
    </div>
  </div>
</div>

