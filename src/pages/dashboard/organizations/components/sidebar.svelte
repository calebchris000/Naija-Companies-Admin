<script lang="ts">
    import { navigate } from "svelte-routing";
    import { store } from "@src/lib/store";
    import Building from "@src/assets/building.svelte";
    import Collapse from "@src/assets/collapse.svelte";
    const links = [
        {
            name: "Organization",
            url: "/dashboard/organizations",
            icon: Building,
        },
        { name: "Users", url: "/dashboard/users", icon: Building },
    ];
</script>

<section
    class="sticky left-0 overflow-hidden grid grid-rows-12 rounded-xl h-screen w-[20vw]"
>
    <div class="row-span-2 flex items-center justify-between border-white">
        <span
            class="block text-gray-800 p-1 px-2 rounded text-xl text-nowrap font-medium"
            >Naija Companies</span
        >
        <button type="button">
            <Collapse className="w-6 text-gray-800" />
        </button>
    </div>
    <div class="row-span-10 flex flex-col py-2 gap-2">
        {#each links as { name, url, icon: Icon }, index}
            <button
                on:click={() => {
                    $store.selected.index = index;
                    $store.selected.url = url;
                    // navigate(url);
                }}
                class:text-gray-800={$store.selected.index === index}
                class:text-gray-500={$store.selected.index !== index}
                class:bg-white={$store.selected.index === index}
                class:border-gray-200={$store.selected.index === index}
                class:shadow={$store.selected.index === index}
                class="p-2 px-4 rounded-lg flex items-center gap-4 text-start transition-all border border-transparent"
                type="button"
            >
                <Icon className="w-5" />
                <span>{name}</span>
            </button>
        {/each}
    </div>
</section>
