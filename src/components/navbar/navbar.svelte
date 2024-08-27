<script lang="ts">
    import Arrow0 from "./arrow.svelte";
    import Arrow1 from "@src/assets/arrow.svelte";
    import Home from "@src/assets/home.svelte";
    import { store } from "@src/lib/store";

    const path = window.location.pathname.split("/").filter((path) => path);
    console.log(path);
    function handleBack() {
        window.history.back();
    }
    $store.global.currentPath = path;
</script>

<section
    class="grid grid-cols-12 py-5 items-center px-8 sticky top-0 w-full h-20 gap-10"
>
    <div class="col-span-4 flex items-center gap-4">
        <button on:click={handleBack} type="button">
            <Arrow1 className="w-4 rotate-180 text-gray-500" />
        </button>

        <div class="text-gray-300 font-semibold">|</div>
        <div class="flex items-center gap-2">
            <Home className="w-5 text-gray-500" />
            {#if path.length > 1}
                {#each $store.global.currentPath.slice(1) as folder, i}
                    <div class="flex gap-2 text-gray-500">
                        <Arrow0 />
                        {#if $store.global.currentPath.slice(1).length === i + 1}
                            <span
                                >{folder[0].toUpperCase() +
                                    folder.slice(1)}</span
                            >
                        {:else}
                            <a href="/dashboard/{folder}"
                                >{folder[0].toUpperCase() + folder.slice(1)}</a
                            >
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <div class="col-span-6 w-full h-full flex items-center">
        <input
            type="text"
            class=" bg-none text-gray-800 w-full h-full border border-gray-300 p-1 px-4 rounded-lg placeholder:text-gray-300 outline-none"
            placeholder="Search"
            on:input={(e) => {
                if (!e.target) return;
                $store.global.searchValue = e.target.value;
            }}
            on:change={(e) => {
                if (!e.target) return;
                $store.global.searchValue = e.target.value;
            }}
        />
    </div>
    <div class="col-span-2 h-full"><slot /></div>
</section>
