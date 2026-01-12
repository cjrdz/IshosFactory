<script>
    import { onMount } from "svelte";

    let theme = "valentine";

    function updateTheme() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            theme = savedTheme;
        } else {
            const dataTheme =
                document.documentElement.getAttribute("data-theme");
            if (dataTheme) {
                theme = dataTheme;
            } else if (
                window.matchMedia("(prefers-color-scheme: night)").matches
            ) {
                theme = "night";
            }
        }
    }

    onMount(() => {
        updateTheme();

        // Listen to storage changes (when theme is toggled)
        window.addEventListener("storage", updateTheme);

        // Also listen to custom storage event (for same-window updates)
        window.addEventListener("themechange", updateTheme);

        // Watch for data-theme attribute changes
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => {
            window.removeEventListener("storage", updateTheme);
            window.removeEventListener("themechange", updateTheme);
            observer.disconnect();
        };
    });
</script>

<a
    href="/"
    class="btn btn-ghost normal-case text-xl font-bold group"
    aria-label="Home"
>
    {#if theme === "valentine"}
        <!-- Black icon for white/valentine theme -->
        <img
            src="/images/blackicon.png"
            alt="Home"
            width="86"
            height="86"
            class="group-hover:scale-110 transition-transform duration-200"
        />
    {:else}
        <!-- White icon for dark/night theme -->
        <img
            src="/images/whiteicon.png"
            alt="Home"
            width="86"
            height="86"
            class="group-hover:scale-110 transition-transform duration-200"
        />
    {/if}
</a>
