<script lang="ts">
    import Arrow from "@src/assets/arrow.svelte";
    import Home from "@src/assets/home.svelte";
    import { store } from "@src/lib/store";

    const path = window.location.pathname;
    console.log(path);
</script>

<section
    class="grid grid-cols-12 py-4 items-center px-4 sticky top-0 w-full h-14 gap-10"
>
    <div class="col-span-3">
        <button class:hidden={path === "/dashboard"} type="button">
            <Arrow className="w-4 rotate-180 text-gray-800" />
        </button>

        <div class:hidden={path !== "/dashboard"}>
            <Home className="w-6 text-gray-800" />
        </div>
    </div>

    <div class="col-span-7 w-full h-full flex items-center">
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
