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
    $: formData = organization as DetailType;
    $: editMode = false;
    $: updateStatus = "inactive" as
        | "inactive"
        | "pending"
        | "success"
        | "error";

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

    async function handleUpdateData(object: any) {
        updateStatus = "pending";
        console.log(formData);
        const response = await UpdateOrganizations(object ?? formData);
        const { status, data } = response;
        if (status !== 200) {
            console.log(data);
            updateStatus = "error";
        } else {
            updateStatus = "success";
            getDetail();
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
                    <span class="bg-gray-800 h-10 w-10 p-10 rounded-full"
                    ></span>

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
                        <input
                            on:input={(e) => {
                                if (!e.target) return;
                                formData.city = e.target.value;
                            }}
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
                                if (!e.target) return;
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
                                if (!e.target) return;
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
                                if (!e.target) return;
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
                        <input
                            on:input={(e) => {
                                if (!e.target) return;
                                formData.industry = e.target.value;
                            }}
                            class="text-gray-800 bg-transparent"
                            value={organization.industry ?? "Not Set"}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span>Capital</span>
                        <input
                            on:input={(e) => {
                                if (!e.target) return;
                                formData.capitalId = e.target.value;
                            }}
                            class="text-gray-800 bg-transparent"
                            value={"Lagos"}
                            type="text"
                            disabled={!editMode}
                        />
                    </div>
                    <div class="flex row-start-4 col-span-3 flex-col gap-1">
                        <span>Description</span>

                        <textarea
                            class="text-gray-800 bg-transparent"
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
