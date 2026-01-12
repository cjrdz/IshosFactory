<script lang="ts">
    import { toasts, removeToast } from "../../lib/stores/toast";
    import type { ToastType, Toast } from "../../lib/stores/toast";
    import { onMount } from "svelte";

    let toastList = $state<Toast[]>(toasts.get());

    onMount(() => {
        const unsubscribe = toasts.subscribe((value: readonly Toast[]) => {
            toastList = [...value];
        });
        return unsubscribe;
    });

    const typeStyles: Record<ToastType, string> = {
        success: "alert-success",
        error: "alert-error",
        info: "alert-info",
        warning: "alert-warning",
    };
</script>

<div class="toast toast-top toast-end z-50">
    {#each toastList as toast (toast.id)}
        <div class={`alert ${typeStyles[toast.type]} shadow-lg mb-2`}>
            <span>{toast.message}</span>
            <button
                class="btn btn-sm btn-ghost"
                onclick={() => removeToast(toast.id)}
                aria-label="Cerrar"
            >
                ✕
            </button>
        </div>
    {/each}
</div>
