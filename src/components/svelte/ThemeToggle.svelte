<script>
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";

    let theme = "valentine";

    onMount(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            theme = savedTheme;
        } else if (window.matchMedia("(prefers-color-scheme: night)").matches) {
            theme = "night";
        }
        document.documentElement.setAttribute("data-theme", theme);
    });

    function toggleTheme() {
        theme = theme === "valentine" ? "night" : "valentine";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }
</script>

<button
    class="btn btn-ghost btn-circle"
    on:click={toggleTheme}
    aria-label="Toggle Theme"
>
    {#if theme === "valentine"}
        <!-- Sun Icon -->
        <Icon icon="line-md:sunny-twotone-loop" width="48" height="48" />
    {:else}
        <!-- Moon Icon -->
        <Icon
            icon="line-md:sunny-filled-loop-to-moon-filled-loop-transition"
            width="28"
            height="28"
        />
    {/if}
</button>
