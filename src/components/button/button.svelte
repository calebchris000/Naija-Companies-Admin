<script lang="ts">
    import Pencil from "@src/assets/Pencil.svelte";
    import { createEventDispatcher } from "svelte";
    export let name = "";
    export let Icon: typeof Pencil | null = null;
    export let className = "";
    export let style = "";
    export let type: "button" | "submit" = "button";
    export let size = "fit" as "fit" | "wide";
    const dispatch = createEventDispatcher();
    function handleClick() {
        dispatch("click");
    }
</script>

<button
    {style}
    class:w-full={size === "wide"}
    class:w-fit={size === "fit"}
    class="p-2 px-4 rounded-lg flex items-center gap-4 hover:border-gray-500 hover:text-gray-700 transition-all text-sm border border-gray-300 text-gray-500 h-full {className}"
    on:click={handleClick}
    {type}
>
    <span>{name}</span>
    {#if Icon}
        <Icon className="w-4" />
    {/if}
</button>
