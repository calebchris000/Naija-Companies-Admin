<script lang="ts">
    import Navbar from "@src/components/navbar/navbar.svelte";
    import Layout from "./layout.svelte";
    import { onMount } from "svelte";
    import {
        GetOrganization,
        UpdateOrganizations,
    } from "@src/api/organization";
    import { store } from "@src/lib/store";
    import Button from "@src/components/button/button.svelte";
    import Pencil from "@src/assets/Pencil.svelte";
    import Save from "@src/assets/save.svelte";
    import { organizations } from "@src/lib/organizations";
    import { GetCapitals } from "@src/api/capital";
    import { industries } from "@src/lib/industries";
    import { cities } from "@src/lib/cities";
    import { notification } from "@src/utils/index";
    import { UploadImage } from "@src/api/image";
    import Upload from "@src/assets/upload.svelte";
    import Building from "@src/assets/building.svelte";

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
    let fileElement: HTMLInputElement;
    $: logo_image = "";
    $: organization = {} as DetailType;
    $: capitals = [] as any[];
    $: defaultCapital = capitals.find(
        (c) => c.id === organization.capitalId,
    )?.name;

    $: formData = {
        id: organization.id,
        city: organization.city,
        capitalId: organization.capitalId,
        industry: organization.industry,
    } as DetailType;
    $: filtered_cities = [] as any[];

    $: editMode = false;
    $: updateStatus = "inactive" as
        | "inactive"
        | "pending"
        | "success"
        | "error";

    $: image_load = false;
    $: {
        const image = new Image();
        image.src = organization.logoUrl;
        image.onload = (ev) => {
            image_load = true;
        };
        image.onerror = (ev) => {
            image_load = false;
        };
    }

    function handleCityFilter() {
        filtered_cities = cities.filter((city) => {
            const capital = capitals.find((c) => c.id === formData.capitalId);
            return city.capital === capital?.name;
        });
    }
    function getDetail() {
        GetOrganization(`organizationId=${id}`).then((d) => {
            const { status, data } = d;

            if (status === 200) {
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

    async function handleUpdateData(object?: any) {
        updateStatus = "pending";
        handleCityFilter();
        if (
            !formData.city ||
            filtered_cities.length === 1 ||
            !filtered_cities.some((city) => city.name === formData.city)
        ) {
            formData.city = (filtered_cities[0] as any).name;
        }

        if (!object && fileElement.files?.length) {
            const res = await UploadImage(fileElement.files[0]);
            const { data: _data, status: _status } = res;
            if (_status === 200) {
                $store.organization.uploadImageStatus = "success";
                formData.logoUrl = _data.data.url;
            } else {
                $store.organization.uploadImageStatus = "failure";
                notification.error({ text: "Could not update image" });
                return;
            }
        }
        const response = await UpdateOrganizations(object ?? formData);
        const { status, data } = response;
        if (status !== 200) {
            updateStatus = "error";
        } else {
            updateStatus = "success";
            getDetail();
        }
    }

    async function getCapitals() {
        const response = await GetCapitals();
        const { data, status } = response;

        if (status === 200) {
            capitals = data.data;
        }
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
                notification.error({ text: "" });
                console.error(
                    "Invalid file type. Please select a PNG, JPG, JPEG, or WebP image.",
                );
                fileElement.value = ""; // Clear the file input
            }
        } else {
            console.error("No file selected");
        }
    }

    $: {
        if (updateStatus !== "inactive" && updateStatus !== "pending") {
            setTimeout(() => {
                editMode = false;
                updateStatus = "inactive";
            }, 2000);
        }
    }

    onMount(() => {
        getDetail();
        getCapitals();
    });
</script>

<section>
    <Layout className="bg-[#f7f7f7] px-4">
        <div
            class="flex flex-col gap-4 w-full overflow-hidden border-2 border-gray-200 rounded-2xl h-[95vh] self-center bg-[#fffefd]"
        >
            <Navbar></Navbar>

            <figure class="w-[70vw] py-10 mx-auto h-full flex flex-col gap-10">
                <div class="flex gap-4">
                    <div
                        class:bg-transparent={image_load}
                        class="bg-gray-800 border border-gray-300 relative h-20 w-20 overflow-hidden flex items-center justify-center transition-all rounded-full"
                    >
                        <button
                            type="button"
                            on:click={() => {
                                if (!fileElement) return;
                                fileElement.click();
                            }}
                            class:opacity-100={editMode}
                            class:pointer-events-auto={editMode}
                            class="absolute pointer-events-none flex items-center justify-center transition-all inset-0 opacity-0 bg-black bg-opacity-50"
                        >
                            <Upload className="w-10 text-gray-300" />
                        </button>
                        <input
                            on:input={handleFileInput}
                            hidden
                            bind:this={fileElement}
                            type="file"
                        />
                        {#if logo_image || image_load}
                            <img
                                src={logo_image
                                    ? logo_image
                                    : organization.logoUrl}
                                class="w-full"
                                alt="logo"
                            />
                        {:else}
                            <Building className="w-10 text-gray-500" />
                        {/if}
                    </div>

                    <div class="flex flex-col gap-2">
                        <span class="text-4xl font-semibold"
                            >{organization.name}</span
                        >
                        <button
                            type="button"
                            on:click={() => {
                                handleUpdateData({
                                    id: organization.id,
                                    verified: organization.verified
                                        ? false
                                        : true,
                                });
                            }}
                            class:bg-green-500={organization.verified}
                            class:bg-red-500={!organization.verified}
                            class="uppercase text-sm outline-none p-1 px-4 rounded-lg text-white w-fit font-semibold"
                            >{organization.verified
                                ? "Verified"
                                : "Not Verified"}</button
                        >
                    </div>
                </div>

                <section
                    class="h-full grid grid-cols-3 text-gray-500 w-full border border-gray-300 gap-4 rounded-xl p-4"
                >
                    <div class="flex flex-col gap-1">
                        <span>City</span>
                        <select
                            on:input={(e) => {
                                if (!(e.target instanceof HTMLSelectElement))
                                    return;
                                formData.city = e.target.value;
                            }}
                            class:hidden={!editMode}
                            class="bg-transparent outline-none border border-gray-300 p-2 rounded-lg"
                            name=""
                            id=""
                        >
                            {#each filtered_cities as city}
                                <option
                                    selected={city.name === formData.city}
                                    value={city.name}>{city.name}</option
                                >
                            {/each}
                        </select>
                        <input
                            on:input={(e) => {
                                if (!(e.target instanceof HTMLInputElement))
                                    return;
                                formData.city = e.target.value;
                            }}
                            class:hidden={editMode}
                            class="text-gray-800 bg-transparent"
                            value={organization.city}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span>Website</span>
                        <input
                            on:input={(e) => {
                                if (!(e.target instanceof HTMLInputElement))
                                    return;
                                formData.website = e.target.value;
                            }}
                            class="text-gray-800 bg-transparent"
                            value={organization.website}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span>Email Address</span>
                        <input
                            on:input={(e) => {
                                if (!(e.target instanceof HTMLInputElement))
                                    return;
                                formData.email = e.target.value;
                            }}
                            class="text-gray-800 bg-transparent"
                            value={organization.email}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span>Postal Code</span>
                        <input
                            on:input={(e) => {
                                if (!(e.target instanceof HTMLInputElement))
                                    return;
                                formData.postalCode = e.target.value;
                            }}
                            class="text-gray-800 bg-transparent"
                            value={organization.postalCode ?? "Not Set"}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span>Industry</span>
                        <select
                            on:input={(e) => {
                                if (!(e.target instanceof HTMLSelectElement))
                                    return;
                                formData.industry = e.target.value;
                            }}
                            class:hidden={!editMode}
                            class="bg-transparent outline-none border border-gray-300 p-2 rounded-lg"
                            name=""
                            id=""
                        >
                            {#each industries as industry}
                                <option
                                    selected={industry.name ===
                                        formData.industry}
                                    value={industry.name}
                                    >{industry.name}</option
                                >
                            {/each}
                        </select>
                        <input
                            class:hidden={editMode}
                            class="text-gray-800 bg-transparent"
                            value={organization.industry ?? "Not Set"}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span>Capital</span>
                        <select
                            on:input={(e) => {
                                if (!(e.target instanceof HTMLSelectElement))
                                    return;
                                formData.capitalId = e.target.value;
                                handleCityFilter();
                            }}
                            class:hidden={!editMode}
                            class="bg-transparent outline-none border border-gray-300 p-2 rounded-lg"
                            name="capitalId"
                            id=""
                        >
                            {#each capitals as capital}
                                {#if defaultCapital === capital?.name}
                                    <option selected value={capital.id}
                                        >{capital.name}</option
                                    >
                                {:else}
                                    <option value={capital.id}
                                        >{capital.name}</option
                                    >
                                {/if}
                            {/each}
                        </select>
                        <input
                            class:hidden={editMode}
                            class="text-gray-800 bg-transparent"
                            value={capitals.find(
                                (c) => c.id === organization.capitalId,
                            )?.name}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex row-start-4 col-span-3 flex-col gap-1">
                        <span>Description</span>

                        <textarea
                            class:border-gray-300={editMode}
                            class:p-2={editMode}
                            class:border-transparent={!editMode}
                            class="text-gray-800 border resize-none bg-transparent rounded-lg outline-none"
                            name="description"
                            value={organization.description}
                            id=""
                            disabled={!editMode}
                        ></textarea>
                    </div>

                    <div class="row-start-5 col-span-3">
                        {#if editMode}
                            {#if updateStatus === "pending"}
                                <Button
                                    Icon={Save}
                                    className="h-fit"
                                    size="fit"
                                    name="Saving"
                                />
                            {:else if updateStatus === "error"}
                                <Button
                                    Icon={Save}
                                    className="h-fit border-red-500 text-red-500 hover:border-red-500 hover:text-red-500"
                                    size="fit"
                                    name="Save Error"
                                />
                            {:else if updateStatus === "success"}
                                <Button
                                    Icon={Save}
                                    className="h-fit border-green-500 text-green-500 hover:border-green-500 hover:text-green-500"
                                    size="fit"
                                    name="Save Success!"
                                />
                            {:else}
                                <Button
                                    on:click={() => {
                                        handleUpdateData();
                                    }}
                                    Icon={Save}
                                    className="h-fit border-orange-500 text-orange-500 hover:border-orange-500 hover:text-orange-500"
                                    size="fit"
                                    name="Save"
                                />
                            {/if}
                        {:else}
                            <Button
                                on:click={() => {
                                    handleCityFilter();
                                    editMode = true;
                                }}
                                Icon={Pencil}
                                className="h-fit"
                                size="fit"
                                name="Edit"
                            />
                        {/if}
                    </div>
                </section>
            </figure>
        </div>
    </Layout>
</section>

<style>
    input {
        @apply py-2;
    }
    input:not(:disabled) {
        @apply border border-gray-300 rounded-lg px-2 outline-none;
    }
</style>
