<script lang="ts">
    import Check from "@src/assets/check.svelte";
    import Navbar from "./components/navbar.svelte";
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

    type FormInput = {
        name: string;
        id: string;
        type: string;
        required: boolean;
        placeholder: string;
        value?: any[];
    };
    $: formInputs = [
        {
            name: "Company Name",
            id: "name",
            type: "text",
            required: true,
            placeholder: "Enter company name",
        },
        {
            name: "Capital",
            id: "capital",
            required: true,
            type: "select",
            value: capitals,
            placeholder: "Enter a capital",
        },
        {
            name: "City",
            id: "city",
            type: "select",
            value: cities_filter.length
                ? cities_filter
                : [{ id: 0, name: "Select a capital" }],
            required: true,
            placeholder: "Enter city of origin",
        },

        {
            name: "Website",
            id: "website",
            type: "text",

            required: true,
            placeholder: "Enter website URL",
        },
        {
            name: "Email",
            id: "email",
            required: true,
            type: "email",
            placeholder: "Enter email address",
        },
        {
            name: "Logo URL",
            id: "logoUrl",
            type: "text",
            required: true,
            placeholder: "Enter logo URL",
        },

        {
            name: "Industry",
            id: "industry",
            required: true,
            type: "select",
            value: industries,
            placeholder: "Enter industry",
        },
        {
            name: "Founded Year",
            id: "foundedYear",
            type: "number",
            required: false,
            placeholder: "Enter founded year",
        },
        {
            name: "Size",
            id: "size",
            placeholder: "Enter company sizes",
            required: false,
            type: "select",

            value: [
                { id: "1-10", name: "1-10" },
                { id: "11-50", name: "11-50" },
                { id: "51-200", name: "51-200" },
                { id: "201-500", name: "201-500" },
                { id: "501+", name: "501+" },
            ],
        },
        {
            name: "Verified",
            id: "verified",
            type: "radio",
            required: false,
            placeholder: "Enter verification status",
        },

        {
            name: "Postal Code",
            id: "postalCode",
            type: "number",
            required: false,
            placeholder: "Enter postal code",
        },
        {
            name: "Description",
            id: "description",
            type: "textarea",
            required: false,
            placeholder: "Enter company description",
        },
    ] as FormInput[];
    $: companies = [] as any[];
    $: companies_filter = [] as any[];
    $: capitals = [] as any[];
    $: formdata = {} as {
        name: string;
        website: string;
        email: string;
        logoUrl: string;
        capital: string;
        industry: string;
        foundedYear: string;
        size: string;
        verified: string;
        postalCode: string;
        description: string;
        city: string;
    };
    $: cities_filter = cities as any[];

    $: {
        console.log(formdata);
        cities_filter = cities.filter((c) => {
            const selected_capital = formdata.capital;
            return c.capital === selected_capital;
        });
    }
    $: showCompanyModal = true;

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

    async function handleAddOrganization(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        const {
            name,
            website,
            email,
            logoUrl,
            city,
            capital,
            industry,
            foundedYear,
            size,
            verified,
            postalCode,
            description,
        } = formObject;

        const capitalId = capitals.find((c) => c.name === capital)?.id;
        console.log(formObject);
        return;
        const response = await AddOrganizations([
            {
                name,
                website,
                email,
                city,
                capitalId,
                industry,
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
            console.log(data);
            notification.error({
                text: "Could not add organization. Check logs for more info",
            });
        } else {
            notification.success({ text: "Successfully added organization" });
            showCompanyModal = false;
        }
    }

    function handleFormChange(e: Event) {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
        formdata[name] = value;
    }

    function getOrganizations() {
        GetOrganizations().then((d) => {
            const { status, data } = d;

            if (status === 200) {
                console.log(data.data);
                companies = data.data;
                companies_filter = data.data;
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
            class="flex flex-col gap-8 w-full overflow-hidden border-2 border-gray-200 rounded-2xl h-[95vh] self-center bg-[#fffefd]"
        >
            <Navbar>
                <Button
                    on:click={() => {
                        showCompanyModal = !showCompanyModal;
                    }}
                    name="Add Company"
                />
            </Navbar>
            <span class="text-xl text-gray-800 px-4 font-medium"
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
                            class="grid w-full text-start transition-all grid-cols-12 hover:bg-gray-100 text-gray-800 text-sm px-4 items-center py-2 border-b border-gray-100"
                        >
                            <span class="w-full">{index + 1}</span>
                            <span class="w-full col-span-3">{org.name}</span>
                            <span class="w-full col-span-2"
                                >{org.website.length > 16
                                    ? org.website.slice(0, 16) + "..."
                                    : org.website}</span
                            >
                            <span class="w-full col-span-2">{org.city}</span>
                            <span class="w-full">{org.size}</span>
                            <span class="w-full col-span-2">{org.industry}</span
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
    <section
        class:opacity-100={showCompanyModal}
        class:pointer-events-auto={showCompanyModal}
        class="opacity-0 modal transition-all pointer-events-none fixed inset-0 z-10"
    >
        <div
            class="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-[700px] h-[400px] rounded-lg"
        >
            <div class="flex items-center p-4 px-8 justify-between">
                <span class="text-gray-500 text-xl">Add Organization</span>
                <Button
                    on:click={() => {
                        showCompanyModal = false;
                    }}
                    name="Cancel"
                />
            </div>

            <form
                on:change={(e) => {
                    handleFormChange(e);
                }}
                on:submit={handleAddOrganization}
                class="flex flex-col justify-between row-span-2 gap-4 p-4 px-8 overflow-y-auto"
            >
                <div
                    class="max-h-[15rem] grid grid-cols-2 gap-4 w-full overflow-y-auto py-2 pe-2"
                >
                    {#each formInputs as { name, id, required, type, placeholder, value }}
                        {#if type === "select" && value}
                            <div class="flex flex-col gap-2">
                                <label class="flex gap-1" for={id}>
                                    <span>{name}</span>
                                    {#if required}
                                        <Asterisk
                                            className="w-2 text-orange-600 -translate-y-1"
                                        />
                                    {/if}
                                </label>
                                <select
                                    class="p-2 text-gray-500 transition-all focus:border-gray-500 px-4 bg-transparent border border-gray-300 rounded-lg"
                                    name={id}
                                    {id}
                                >
                                    {#if value.length === 1 && value[0].id === 0}
                                        <option value="">{value[0].name}</option
                                        >
                                    {:else}
                                        {#each value as val}
                                            <option value={val.name}
                                                >{val.name}</option
                                            >
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                        {:else if type === "textarea"}
                            <div
                                class="flex row-start-7 min-h-40 w-full col-span-2 flex-col gap-2"
                            >
                                <label class="flex gap-1" for={id}>
                                    <span>{name}</span>
                                    {#if required}
                                        <Asterisk
                                            className="w-2 text-orange-600 -translate-y-1"
                                        />
                                    {/if}
                                </label>
                                <textarea
                                    class="resize-none transition-all focus:border-gray-500 border border-gray-300 h-full outline-none p-2 px-4 rounded-lg"
                                    name={id}
                                    {placeholder}
                                    {id}
                                ></textarea>
                            </div>
                        {:else if type === "radio"}
                            <div class="flex flex-col gap-2">
                                <label class="flex gap-1" for={id}>
                                    <span>{name}</span>
                                    {#if required}
                                        <Asterisk
                                            className="w-2 text-orange-600 -translate-y-1"
                                        />
                                    {/if}
                                </label>
                                <figure
                                    class="flex ms-1 border border-gray-300 rounded-lg p-2 px-4 items-center gap-8"
                                >
                                    <div class="flex items-center gap-4">
                                        <input
                                            name="verified"
                                            value={true}
                                            class="scale-150"
                                            type="radio"
                                        />
                                        <span>Yes</span>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <input
                                            name="verified"
                                            value={false}
                                            class="scale-150"
                                            type="radio"
                                        />
                                        <span>No</span>
                                    </div>
                                </figure>
                            </div>
                        {:else}
                            <div class="flex flex-col gap-2">
                                <label class="flex gap-1" for={id}>
                                    <span>{name}</span>
                                    {#if required}
                                        <Asterisk
                                            className="w-2 text-orange-600 -translate-y-1"
                                        />
                                    {/if}
                                </label>
                                <input
                                    name={id}
                                    class="border
                                    placeholder:text-gray-500 p-2 px-4 border-gray-300 transition-all focus:border-gray-500 rounded-lg"
                                    {placeholder}
                                    {type}
                                />
                            </div>
                        {/if}
                    {/each}
                </div>
                <div class="row-start-8 col-span-2 mt-auto">
                    <Button
                        on:click={() => {
                            // handleAddOrganization();
                        }}
                        type="submit"
                        size="wide"
                        name="Submit"
                    />
                </div>
            </form>
        </div>
    </section>
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
