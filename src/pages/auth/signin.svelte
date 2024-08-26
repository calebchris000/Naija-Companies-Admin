<script lang="ts">
    import { navigate } from "svelte-routing";
    import { Login } from "../../api/auth";

    $: loginStatus = "inactive" as "inactive" | "pending" | "success" | "error";
    async function handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const { email, password } = data as { email: string; password: string };
        const response = await Login({ user: email, password });

        if (response.status !== 200) {
            loginStatus = "error";
        } else {
            const { data } = response.data;
            document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
            const { token, ...others } = data;
            localStorage.setItem("user", JSON.stringify(others));
            loginStatus = "success";
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        }
    }
</script>

<section class="flex bg-gray-600 items-center justify-center w-full h-full">
    <div class="w-[400px] bg-white h-[320px] border border-gray-200">
        <div class="bg-gray-200 w-full h-16 flex items-center px-4">
            <span class="font-medium">Login as Admin</span>
        </div>

        <form on:submit={handleSubmit} class="p-4">
            <div class="mb-4">
                <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-700"
                    >Email</label
                >
                <input
                    type="email"
                    id="email"
                    name="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div class="mb-4">
                <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-700"
                    >Password</label
                >
                <input
                    type="password"
                    id="password"
                    name="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <button
                type="submit"
                class="w-full px-4 py-2 text-white rounded-md focus:outline-none font-medium focus:ring-2 focus:ring-blue-500"
                class:bg-blue-600={loginStatus === "inactive"}
                class:bg-yellow-500={loginStatus === "pending"}
                class:bg-green-600={loginStatus === "success"}
                class:bg-red-600={loginStatus === "error"}
                disabled={loginStatus === "pending"}
            >
                {#if loginStatus === "inactive"}
                    Login
                {:else if loginStatus === "pending"}
                    Logging in...
                {:else if loginStatus === "success"}
                    Logged in
                {:else if loginStatus === "error"}
                    Login failed, try again
                {/if}
            </button>
        </form>
    </div>
</section>
