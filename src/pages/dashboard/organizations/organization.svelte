<script lang="ts">
    import Check from "@src/assets/check.svelte";
    import Layout from "./layout.svelte";
    import Cancel from "@src/assets/cancel.svelte";
    import { organizations } from "@src/lib/organizations";
    import { onMount } from "svelte";
    import { AddOrganizations, GetOrganizations } from "@src/api/organization";
    import { store } from "@src/lib/store";
    import Button from "@src/components/button/button.svelte";
    import Asterisk from "@src/assets/asterisk.svelte";
    import { GetCapitals } from "@src/api/capital";
    import { industries } from "@src/lib/industries";
    import { notification } from "@src/utils";
    import { cities } from "@src/lib/cities";
    import AddCompanyModal from "./components/addCompanyModal.svelte";
    import Navbar from "@src/components/navbar/navbar.svelte";
    import { navigate } from "svelte-routing";

    $: companies = [] as any[];
    $: companies_filter = [] as any[];
    $: capitals = [] as any[];

    $: {
        if ($store.global.searchValue) {
            const filtered = companies.filter((company) => {
                const searchLower = $store.global.searchValue
                    .toLowerCase()
                    .trim();
                const name = company?.name?.toLowerCase().includes(searchLower);
                const website = company?.website
                    ?.toLowerCase()
                    .includes(searchLower);
                const city = company?.city?.toLowerCase().includes(searchLower);
                const size = company?.size?.toLowerCase().includes(searchLower);
                const industry = company?.industry
                    ?.toLowerCase()
                    .includes(searchLower);
                return name || website || city || size || industry;
            });
            companies_filter = filtered;
        } else {
            companies_filter = companies;
        }
    }

    async function handleAddOrganization(form: FormData) {
        const formObject = Object.fromEntries(form.entries());
        const {
            name,
            website,
            email,
            logoUrl,
            cityId,
            capitalId,
            categoryId,
            industryId,
            foundedYear,
            size,
            verified,
            postalCode,
            description,
        } = formObject;

        console.log(formObject);
        const response = await AddOrganizations([
            {
                name,
                website,
                email,
                cityId,
                capitalId,
                categoryId,
                industryId,
                logoUrl,
                verified: JSON.parse((verified as string) ?? "false"),
                foundedYear,
                size,
                postalCode,
                description,
            },
        ]);

        const { status, data } = response;
        if (status !== 201) {
            console.log(data.response);
            notification.error({
                text: "Could not add organization. Check logs for more info",
            });
        } else {
            notification.success({ text: "Successfully added organization" });
            $store.organization.addModalOpen = false;
        }
    }

    function handleFormChange(e: Event) {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
        if (name in $store.organization.addFormData) {
            console.log(name, value);
            ($store.organization.addFormData as any)[name] = value;
        }
    }

    function getOrganizations() {
        GetOrganizations().then((d) => {
            const { status, data } = d;

            if (status === 200) {
                const org = data.data.organizations as any[];
                if (Array.isArray(org)) {
                    org.sort((a: any, b: any) =>
                        b.updatedAt.localeCompare(a.updatedAt),
                    );
                }
                companies = org;
                companies_filter = org;
                console.log(companies_filter, "org");
            }
        });
    }

    onMount(() => {
        getOrganizations();
        GetCapitals().then((d) => {
            const { status, data } = d;
            if (status === 200) {
                capitals = data.data;
                console.log(data.data);
            }
        });
    });
</script>

<section class=" w-full h-full">
    <Layout className="bg-[#f7f7f7] px-4">
        <div
            class="flex flex-col gap-4 w-full overflow-hidden border-2 border-gray-200 rounded-2xl h-[95vh] self-center bg-[#fffefd]"
        >
            <Navbar>
                <Button
                    on:click={() => {
                        $store.organization.addModalOpen = true;
                    }}
                    name="Add Company"
                />
            </Navbar>
            <span class="text-xl pt-4 text-gray-800 px-4 font-medium"
                >All Organizations</span
            >

            <section
                class="w-full flex px-4 gap-4 max-h-[24rem] overflow-y-auto flex-col select-none"
            >
                <div
                    class="shadow-inner sticky top-0 bg-[#fffefd] z-10 grid grid-cols-12 text-gray-500 p-1 px-4 rounded-md"
                >
                    <span class="w-full">#</span>
                    <span class="w-full col-span-3">Name</span>
                    <span class="w-full col-span-2">Website</span>
                    <span class="w-full col-span-2">City</span>
                    <span class="w-full">Size</span>
                    <span class="w-full col-span-2">Industry</span>
                    <span class="w-full col-span-1">Verified</span>
                </div>
                <div class="flex flex-col gap-2">
                    {#each companies_filter as org, index}
                        <button
                            type="button"
                            on:click={() => {
                                navigate(`/dashboard/organizations/${org._id}`);
                            }}
                            class="grid w-full text-start transition-all grid-cols-12 hover:bg-gray-100 text-gray-800 text-sm px-4 items-center py-2 border-b border-gray-100"
                        >
                            <span class="w-full">{index + 1}</span>
                            <span class="w-full col-span-3">{org.name}</span>
                            <span class="w-full col-span-2"
                                >{org.website && org.website.length > 16
                                    ? org.website.slice(0, 16) + "..."
                                    : (org.website ?? "Not set")}</span
                            >
                            <span class="w-full col-span-2"
                                >{org.city.name}</span
                            >
                            <span class="w-full">{org.size}</span>
                            <span class="w-full col-span-2"
                                >{org.industry.name}</span
                            >
                            <span class="w-full col-span-1">
                                {#if org.verified}
                                    <Check className="w-5 text-green-600" />
                                {:else}
                                    <Cancel
                                        className="w-6 -translate-x-[2px] text-red-600 "
                                    />
                                {/if}
                            </span>
                        </button>
                    {/each}
                </div>
            </section>
        </div>
    </Layout>
    <AddCompanyModal
        on:formChange={(e) => {
            handleFormChange(e.detail);
        }}
        on:submit={(e) => {
            handleAddOrganization(e.detail);
        }}
    />
</section>

<style>
    .modal::before {
        content: "";
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }
    input,
    select {
        outline: none;
    }
</style>
