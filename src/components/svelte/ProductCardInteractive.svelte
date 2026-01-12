<script lang="ts">
  import type { Product } from '../../types/menu';
  import { formatPrice } from '../../lib/utils/formatters';
  import AddToCartModal from './AddToCartModal.svelte';

  interface Props {
    product: Product;
    currencySymbol?: string;
  }

  let { product, currencySymbol = '$' }: Props = $props();
  let showModal = $state(false);
</script>

<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
  <a href={`/menu/producto/${product.id}`} class="cursor-pointer">
    <figure class="overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        class="w-full h-32 sm:h-40 md:h-48 object-contain bg-base-200"
        loading="lazy"
      />
    </figure>
  </a>
  <div class="card-body flex-grow">
    <a href={`/menu/producto/${product.id}`} class="cursor-pointer">
      <h2 class="card-title hover:text-primary transition-colors">{product.name}</h2>
    </a>
    <p class="text-sm text-base-content/70 flex-grow">{product.description}</p>
    <div class="card-actions justify-between items-center mt-4">
      <span class="text-2xl font-bold text-primary">
        {formatPrice(product.price, 'USD', currencySymbol)}
      </span>
      {product.available ? (
        <button
          class="btn btn-primary"
          onclick={() => (showModal = true)}
        >
          Agregar
        </button>
      ) : (
        <div class="badge badge-error">Agotado</div>
      )}
    </div>
  </div>
</div>

<AddToCartModal
  product={product}
  isOpen={showModal}
  onClose={() => (showModal = false)}
  currencySymbol={currencySymbol}
/>

