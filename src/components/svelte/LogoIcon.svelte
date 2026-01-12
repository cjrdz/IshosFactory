<script>
    import { onMount } from "svelte";

    export let width = 64;
    export let height = 64;
    export let alt = "Isho's Gelatos & Sorbetes";
    export let className = "";

    let theme = "valentine";

    function updateTheme() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            theme = savedTheme;
        } else {
            const dataTheme = document.documentElement.getAttribute("data-theme");
            if (dataTheme) {
                theme = dataTheme;
            } else if (window.matchMedia("(prefers-color-scheme: night)").matches) {
                theme = "night";
            }
        }
    }

    onMount(() => {
        updateTheme();
        
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"]
        });

        window.addEventListener("storage", updateTheme);
        window.addEventListener("themechange", updateTheme);

        return () => {
            observer.disconnect();
            window.removeEventListener("storage", updateTheme);
            window.removeEventListener("themechange", updateTheme);
        };
    });
</script>

{#if theme === "valentine"}
    <img
        src="/images/blackicon.png"
        alt={alt}
        width={width}
        height={height}
        class={className}
    />
{:else}
    <img
        src="/images/whiteicon.png"
        alt={alt}
        width={width}
        height={height}
        class={className}
    />
{/if}

