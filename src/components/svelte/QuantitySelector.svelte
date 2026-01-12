<script lang="ts">
  interface Props {
    quantity: number;
    min?: number;
    max?: number;
    onUpdate: (quantity: number) => void;
  }

  let { quantity, min = 1, max = 99, onUpdate }: Props = $props();

  function increment() {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      onUpdate(newQuantity);
    }
  }

  function decrement() {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      onUpdate(newQuantity);
    }
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value) || min;
    const clamped = Math.max(min, Math.min(max, value));
    onUpdate(clamped);
  }
</script>

<div class="flex items-center gap-2">
  <button
    class="btn btn-sm btn-circle btn-outline"
    onclick={decrement}
    disabled={quantity <= min}
  >
    -
  </button>
  <input
    type="number"
    value={quantity}
    min={min}
    max={max}
    oninput={handleInput}
    class="input input-bordered input-sm w-16 text-center"
  />
  <button
    class="btn btn-sm btn-circle btn-outline"
    onclick={increment}
    disabled={quantity >= max}
  >
    +
  </button>
</div>


