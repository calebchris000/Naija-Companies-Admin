<script lang="ts">
    import Navbar from "@src/components/navbar/navbar.svelte";
    import Layout from "./layout.svelte";
    import { onMount } from "svelte";
    import { GetOrganization } from "@src/api/organization";
    import { store } from "@src/lib/store";

    type DetailType = {
        id: string;
        name: string;
        city: string;
        postalCode: string;
        website: string;
        email: string;
        foundedYear: string;
        size: string;
        industry: string;
        description: string;
        verified: boolean;
        addedById: string;
        logoUrl: string;
        capitalId: string;
    };
    const path = window.location.pathname.split("/");
    const id = path[path.length - 1];
    $: organization = {} as DetailType;

    function getDetail() {
        GetOrganization(`organizationId=${id}`).then((d) => {
            const { status, data } = d;

            if (status === 200) {
                console.log(data.data);
                organization = data.data;
                const curr = $store.global.currentPath;

                store.update((c) => {
                    c.global.currentPath[c.global.currentPath.length - 1] =
                        data.data.name.split(" ")[0];
                    return c;
                });
            }
        });
    }

    onMount(() => {
        getDetail();
    });
</script>

<section>
    <Layout className="bg-[#f7f7f7] px-4">
        <div
            class="flex flex-col gap-4 w-full overflow-hidden border-2 border-gray-200 rounded-2xl h-[95vh] self-center bg-[#fffefd]"
        >
            <Navbar></Navbar>
            detail
        </div>
    </Layout>
</section>
