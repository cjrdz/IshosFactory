<script lang="ts">
    import type { Product } from "../../types/menu";
    import { formatPrice } from "../../lib/utils/formatters";
    import AddToCartModal from "./AddToCartModal.svelte";

    interface Props {
        product: Product;
        currencySymbol?: string;
    }

    let { product, currencySymbol = "$" }: Props = $props();
    let showModal = $state(false);
</script>

<div
    class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group border border-base-300/50 hover:border-primary/20"
>
    <a href={`/menu/producto/${product.id}`} class="cursor-pointer overflow-hidden">
        <figure class="overflow-hidden bg-base-200/50 transition-transform duration-300 group-hover:scale-105">
            <img
                src={product.image}
                alt={product.name}
                class="w-full h-24 sm:h-32 md:h-40 object-contain transition-transform duration-300"
                loading="lazy"
            />
        </figure>
    </a>
    <div class="card-body grow flex flex-col p-4 sm:p-5">
        <a href={`/menu/producto/${product.id}`} class="cursor-pointer">
            <h2 class="card-title text-base sm:text-lg hover:text-primary transition-colors duration-200 line-clamp-2 min-h-12">
                {product.name}
            </h2>
        </a>
        <p class="text-xs sm:text-sm text-base-content/70 grow line-clamp-2 mb-3">
            {product.description}
        </p>
        <div class="card-actions justify-between items-center mt-auto pt-3 border-t border-base-300/50">
            <div class="flex flex-col">
                <span class="text-xl sm:text-2xl font-bold text-primary leading-none">
                    {formatPrice(product.price, "USD", currencySymbol)}
                </span>
            </div>
            {#if product.available}
                <button
                    class="btn btn-primary btn-sm sm:btn-md gap-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                    onclick={() => (showModal = true)}
                    aria-label="Agregar al carrito"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 sm:h-5 sm:w-5"
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
                    <span class="hidden sm:inline">Agregar</span>
                    <span class="sm:hidden">+</span>
                </button>
            {:else}
                <div class="badge badge-error badge-lg gap-1.5 px-3 py-2.5">
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <span>Agotado</span>
                </div>
            {/if}
        </div>
    </div>
</div>

<AddToCartModal
    {product}
    isOpen={showModal}
    onClose={() => (showModal = false)}
    {currencySymbol}
/>
