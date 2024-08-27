<script lang="ts">
    import Sidebar from "@src/components/sidebar/sidebar.svelte";

    export let className = "";
</script>

<section class="flex gap-4 {className}">
    <Sidebar />
    <slot />
</section>
