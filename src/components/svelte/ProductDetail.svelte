<script lang="ts">
    import type { Product, ProductSize } from "../../types/menu";
    import { addToCart, cart, isEmpty } from "../../lib/stores/cart";
    import { showToast } from "../../lib/stores/toast";
    import { formatPrice } from "../../lib/utils/formatters";
    import QuantitySelector from "./QuantitySelector.svelte";
    import { onMount } from "svelte";

    interface Props {
        product: Product;
        currencySymbol?: string;
    }

    let { product, currencySymbol = "$" }: Props = $props();

    let quantity = $state(1);
    let selectedSize: ProductSize | undefined = $state(undefined);
    let selectedFlavor: string | undefined = $state(undefined);
    let notes = $state("");
    let customerName = $state("");
    let customerPhone = $state("");
    let productAdded = $state(false);
    let viewCartClicks = $state(0);

    // Load saved customer info from localStorage
    onMount(() => {
        if (typeof window !== "undefined") {
            const savedName = localStorage.getItem("ishos_customer_name");
            const savedPhone = localStorage.getItem("ishos_customer_phone");
            if (savedName) customerName = savedName;
            if (savedPhone) customerPhone = savedPhone;
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
        if (typeof window !== "undefined") {
            if (customerName)
                localStorage.setItem("ishos_customer_name", customerName);
            if (customerPhone)
                localStorage.setItem("ishos_customer_phone", customerPhone);
        }
    }

    function handleAddToCart() {
        // Validate size selection if required
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            showToast("Por favor selecciona un tamaño", "warning");
            return;
        }

        saveCustomerInfo();
        addToCart(
            product,
            quantity,
            selectedSize,
            selectedFlavor,
            notes || undefined,
        );
        showToast(`${product.name} agregado al carrito`, "success");
        productAdded = true;
    }

    function handleViewCart() {
        // Validate size selection if required
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            showToast("Por favor selecciona un tamaño", "warning");
            return;
        }

        // Check if cart already has items
        const cartHasItems = !isEmpty.get();
        
        // If cart has items, navigate directly (no need to add current product first)
        if (cartHasItems) {
            if (typeof window !== "undefined") {
                window.location.href = "/orden/carrito";
            }
            return;
        }

        // Cart is empty - check if product was added first
        if (!productAdded) {
            viewCartClicks++;
            
            // Show warning notification
            showToast("Por favor agrega el producto primero antes de ver el carrito", "warning", 4000);
            
            // If clicked twice, navigate to cart anyway (even if empty)
            if (viewCartClicks >= 2) {
                if (typeof window !== "undefined") {
                    window.location.href = "/orden/carrito";
                }
            }
            return;
        }

        // Product was added and cart was empty, navigate to cart
        if (typeof window !== "undefined") {
            window.location.href = "/orden/carrito";
        }
    }

    function getCurrentPrice(): number {
        if (selectedSize) {
            return selectedSize.price;
        }
        return product.price;
    }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
    <!-- Left Column: Product Image and Details -->
    <div class="flex flex-col space-y-4">
        <!-- Product Image -->
        <div class="bg-base-200 rounded-lg overflow-hidden flex items-center justify-center max-h-[250px] sm:max-h-[300px] md:max-h-[350px]">
            <img
                src={product.image}
                alt={product.name}
                class="w-full h-auto max-h-[250px] sm:max-h-[300px] md:max-h-[350px] object-contain"
                loading="eager"
            />
        </div>

        {#if product.allergens && product.allergens.length > 0}
            <div class="alert alert-info">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="stroke-current shrink-0 w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <span class="text-sm"
                    >Alérgenos: {product.allergens.join(", ")}</span
                >
            </div>
        {/if}

        <!-- Product Name -->
        <h1 class="text-3xl sm:text-4xl font-bold">{product.name}</h1>

        <!-- Product Description -->
        <p class="text-base sm:text-lg text-base-content/70">
            {product.description}
        </p>

        <!-- Price and Availability -->
        <div class="flex items-center gap-4">
            <span class="text-2xl sm:text-3xl font-bold text-primary">
                {formatPrice(getCurrentPrice(), "USD", currencySymbol)}
            </span>
            {#if product.available}
                <div class="badge badge-success badge-lg">Disponible</div>
            {:else}
                <div class="badge badge-error badge-lg">Agotado</div>
            {/if}
        </div>

        {#if product.available}
            <!-- Size Selection -->
            {#if product.sizes && product.sizes.length > 0}
                <div class="form-control">
                    <div class="label">
                        <span class="label-text font-semibold">Tamaño *</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each product.sizes as size}
                            <button
                                class={`btn btn-sm ${selectedSize?.name === size.name ? "btn-primary" : "btn-outline"}`}
                                onclick={() => (selectedSize = size)}
                            >
                                {size.name} - {formatPrice(
                                    size.price,
                                    "USD",
                                    currencySymbol,
                                )}
                                {#if size.description}
                                    <span class="text-xs opacity-70 ml-1"
                                        >({size.description})</span
                                    >
                                {/if}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Flavor Selection -->
            {#if product.flavors && product.flavors.length > 0}
                <div class="form-control">
                    <label class="label" for="flavor-select">
                        <span class="label-text font-semibold">Sabor</span>
                    </label>
                    <select
                        id="flavor-select"
                        class="select select-bordered"
                        onchange={(e) =>
                            (selectedFlavor =
                                (e.target as HTMLSelectElement).value ||
                                undefined)}
                    >
                        <option value="">Seleccionar sabor</option>
                        {#each product.flavors as flavor}
                            <option value={flavor}>{flavor}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            <!-- Quantity Selector -->
            <div class="form-control">
                <label class="label" for="quantity-input">
                    <span class="label-text font-semibold">Cantidad</span>
                </label>
                <QuantitySelector
                    id="quantity-input"
                    {quantity}
                    onUpdate={(q) => (quantity = q)}
                />
            </div>

            {#if product.sizes && product.sizes.length > 0 && !selectedSize}
                <div class="alert alert-warning">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <span class="text-sm">Por favor selecciona un tamaño</span>
                </div>
            {/if}
        {:else}
            <div class="alert alert-error">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>Este producto no está disponible actualmente</span>
            </div>
        {/if}
    </div>

    <!-- Right Column: Customer Information and Actions -->
    {#if product.available}
        <div class="flex flex-col h-full">
            <div class="card bg-base-100 shadow-xl h-full flex flex-col">
                <div class="card-body flex flex-col">
                    <h2 class="text-xl font-bold mb-4">Información del Cliente</h2>

                    <div class="space-y-4 flex-grow">
                        <!-- Customer Name -->
                        <div class="form-control">
                            <label class="label pb-1" for="customer-name">
                                <span class="label-text font-semibold"
                                    >Nombre completo (opcional)</span
                                >
                            </label>
                            <input
                                id="customer-name"
                                type="text"
                                class="input input-bordered w-full"
                                placeholder="Tu nombre"
                                bind:value={customerName}
                            />
                            <label class="label pt-1 pb-0">
                                <span class="label-text-alt text-base-content/60"
                                    >Se guardará para futuros pedidos</span
                                >
                            </label>
                        </div>

                        <!-- Customer Phone -->
                        <div class="form-control">
                            <label class="label pb-1" for="customer-phone">
                                <span class="label-text font-semibold"
                                    >Teléfono (opcional)</span
                                >
                            </label>
                            <input
                                id="customer-phone"
                                type="tel"
                                class="input input-bordered w-full"
                                placeholder="1234-5678"
                                bind:value={customerPhone}
                            />
                            <label class="label pt-1 pb-0">
                                <span class="label-text-alt text-base-content/60"
                                    >Se guardará para futuros pedidos</span
                                >
                            </label>
                        </div>

                        <!-- Additional Notes -->
                        <div class="form-control">
                            <label class="label pb-1" for="notes-textarea">
                                <span class="label-text font-semibold"
                                    >Notas adicionales (opcional)</span
                                >
                            </label>
                            <textarea
                                id="notes-textarea"
                                class="textarea textarea-bordered w-full resize-none"
                                placeholder="Ej: Sin nueces, extra caliente..."
                                bind:value={notes}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Total Price -->
                    <div
                        class="flex justify-between items-center mt-6 p-4 bg-base-200 rounded-lg"
                    >
                        <span class="text-xl font-bold">Total:</span>
                        <span class="text-2xl font-bold text-primary">
                            {formatPrice(
                                getCurrentPrice() * quantity,
                                "USD",
                                currencySymbol,
                            )}
                        </span>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-2 mt-4">
                        <button
                            class="btn btn-sm sm:btn-md btn-primary flex-1"
                            onclick={handleAddToCart}
                            disabled={product.sizes &&
                                product.sizes.length > 0 &&
                                !selectedSize}
                        >
                            Agregar
                        </button>
                        <button
                            class="btn btn-sm sm:btn-md btn-outline btn-primary flex-1 gap-2"
                            onclick={handleViewCart}
                            disabled={product.sizes &&
                                product.sizes.length > 0 &&
                                !selectedSize}
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
                            Ver Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
