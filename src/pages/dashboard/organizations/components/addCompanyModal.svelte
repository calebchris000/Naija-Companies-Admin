<script lang="ts">
    import { GetCapitals } from "@src/api/capital";
    import { GetCategories } from "@src/api/category";
    import { GetCities } from "@src/api/city";
    import { UploadImage } from "@src/api/image";
    import { GetIndustries } from "@src/api/industry";
    import Asterisk from "@src/assets/asterisk.svelte";
    import Upload from "@src/assets/upload.svelte";
    import Button from "@src/components/button/button.svelte";
    import { store } from "@src/lib/store";
    import { notification } from "@src/utils";
    import { createEventDispatcher, onMount } from "svelte";

    type FormInput = {
        name: string;
        id: string;
        type: string;
        required: boolean;
        placeholder: string;
        value?: any[];
    };

    interface CityType {
        cityType: number;
        name: string;
        capitalId: string;
    }

    interface IndustryType {
        name: string;
        description?: string;
    }

    let fileElement: HTMLInputElement;

    $: logo_image = "";
    $: showCompanyModal = $store.organization.addModalOpen;
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
            name: "Industry",
            id: "industry",
            required: true,
            type: "select",
            value: industries,
            placeholder: "Enter industry",
        },
        {
            name: "Category",
            id: "category",
            required: true,
            type: "select",
            value: categories,
            placeholder: "Enter Category",
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

    $: capitals = [] as any[];
    $: industries = [] as { name: string }[];
    $: categories = [] as any[];
    $: cities = [] as CityType[];
    $: cities_filter = cities as any[];

    $: {
        cities_filter = cities.filter((c) => {
            const selected = $store.organization.addFormData.capital;
            const capital = capitals.find((c) => c.name === selected);
            return c.capitalId === capital?.capitalId;
        });
    }

    const dispatch = createEventDispatcher();

    function handleFormChange(e: Event) {
        dispatch("formChange", e);
    }
    function handleAddOrganization(e: Event) {
        e.preventDefault();
        $store.organization.uploadImageStatus = "pending";
        const formData = new FormData(e.target as HTMLFormElement);
        const cityId = (
            cities.find((c: any) => c?.name === formData.get("city")) as any
        )?.cityId;
        const capitalId = capitals.find(
            (c) => c.name === formData.get("capital"),
        )?.capitalId;
        const industryId = (
            industries.find((c) => c.name === formData.get("industry")) as any
        )?._id;
        const categoryId = categories.find(
            (c) => c.name === formData.get("category"),
        )?._id as any;
        formData.delete("city");
        formData.delete("capital");
        formData.delete("industry");
        formData.delete("category");

        formData.append("cityId", cityId);
        formData.append("capitalId", capitalId);
        formData.append("industryId", industryId);
        formData.append("categoryId", categoryId);

        if (!fileElement.files || !fileElement.files[0]) {
            $store.organization.uploadImageStatus = "failure";
            notification.error({ text: "Adding logo is required." });
            return;
        }

        if ($store.organization.addFormData.logoUrl) {
            formData.append("logoUrl", $store.organization.addFormData.logoUrl);
            dispatch("submit", formData);
        } else {
            UploadImage(fileElement.files[0]).then((d) => {
                const { status, data } = d;
                if (status === 200) {
                    $store.organization.uploadImageStatus = "success";
                    $store.organization.addFormData.logoUrl = data.data.url;
                    formData.append("logoUrl", data.data.url);
                    console.log(Object.fromEntries(formData));
                }
            });
        }
    }

    function handleFileModal() {
        if (!fileElement) return;
        fileElement.click();
    }

    async function handleFileInput() {
        if (fileElement.files && fileElement.files[0]) {
            const file = fileElement.files[0];
            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/webp",
            ];

            if (allowedTypes.includes(file.type)) {
                console.log("Valid image file:", file.name);
                logo_image = URL.createObjectURL(file);
                // UploadImage(file).then((d) => {
                //     console.log(d);
                // });
            } else {
                console.error(
                    "Invalid file type. Please select a PNG, JPG, JPEG, or WebP image.",
                );
                fileElement.value = ""; // Clear the file input
            }
        } else {
            console.error("No file selected");
        }
    }

    onMount(() => {
        GetCapitals().then((d) => {
            const { status, data } = d;
            if (status === 200) {
                capitals = data.data;
            }
        });
    });

    GetCities().then((d) => {
        const { status, data } = d;
        if (status === 200) {
            console.log(data.data);

            cities = data.data;
        }
    });

    GetIndustries().then((d) => {
        const { status, data } = d;
        if (status === 200) {
            const ind = data.data as IndustryType[];
            industries = ind;
        }
    });

    GetCategories().then((d) => {
        const { status, data } = d;
        if (status === 200) {
            const cat = data.data as IndustryType[];
            console.log(cat, "categories");
            categories = cat;
        }
    });
</script>

<section
    class:opacity-100={showCompanyModal}
    class:pointer-events-auto={showCompanyModal}
    class="opacity-0 modal transition-all pointer-events-none fixed inset-0 z-10"
>
    <div
        class="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-rows-6 w-[700px] h-[500px] rounded-lg"
    >
        <div class="flex row-span-1 items-center p-4 px-8 justify-between">
            <span class="text-gray-500 text-xl">Add Organization</span>
            <Button
                style="height: fit-content;"
                on:click={() => {
                    showCompanyModal = false;
                }}
                name="Cancel"
            />
        </div>

        <button
            type="button"
            on:click={handleFileModal}
            class="w-20 h-20 overflow-hidden border-2 border-gray-800 rounded-full flex items-center justify-center mx-8"
        >
            {#if logo_image}
                <img class="w-full" src={logo_image} alt="" />
            {:else}
                <Upload className="w-8 text-gray-800" />
            {/if}
        </button>
        <input
            on:input={handleFileInput}
            hidden
            bind:this={fileElement}
            type="file"
        />
        <form
            on:change={(e) => {
                handleFormChange(e);
            }}
            on:submit={handleAddOrganization}
            class="flex flex-col row-span-5 justify-between gap-4 p-4 px-8 overflow-y-auto"
        >
            <div
                class=" grid grid-cols-2 gap-4 w-full overflow-y-auto py-2 pe-2"
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
                                    <option value="">{value[0].name}</option>
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
                                {required}
                                {type}
                            />
                        </div>
                    {/if}
                {/each}
            </div>
            <div class="row-start-8 col-span-2">
                <Button
                    on:click={() => {
                        // handleAddOrganization();
                    }}
                    className="justify-center"
                    type="submit"
                    size="wide"
                    name={$store.organization.uploadImageStatus === "pending"
                        ? "Uploading Image..."
                        : $store.organization.uploadImageStatus === "success"
                          ? "Success"
                          : $store.organization.uploadImageStatus === "failure"
                            ? "Error"
                            : "Submit"}
                />
            </div>
        </form>
    </div>
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
