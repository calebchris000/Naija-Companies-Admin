<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let name = "";
    export let type: "button" | "submit" = "button";
    export let size = "fit" as "fit" | "wide";
    const dispatch = createEventDispatcher();
    function handleClick() {
        dispatch("click");
    }
</script>

<button
    class:w-full={size === "wide"}
    class:w-fit={size === "fit"}
    class="p-2 px-4 rounded-lg hover:border-gray-500 hover:text-gray-700 transition-all text-sm border border-gray-300 text-gray-500 h-full"
    on:click={handleClick}
    {type}>{name}</button
>
