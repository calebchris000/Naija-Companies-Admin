<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import Signin from "./pages/auth/signin.svelte";
    import Organization from "./pages/dashboard/organizations/organization.svelte";
    import OrganizationDetail from "./pages/dashboard/organizations/[id]/organizationDetail.svelte";
    import Home from "./pages/home/home.svelte";
    import { onMount } from "svelte";
    import { Cookie } from "./utils";
    import { navigate } from "svelte-routing";

    onMount(() => {
        const cookie = new Cookie();
        const token = cookie.get("token");
        if (!token) {
            navigate("/login");
        } else {
            navigate("/dashboard/organizations");
        }
    });
</script>

<main class="h-screen">
    <Router url="">
        <Route path="/" component={Home} />
        <Route path="/login" component={Signin} />
        <Route path="/dashboard/organizations" component={Organization} />
        <Route
            path="/dashboard/organizations/:id"
            component={OrganizationDetail}
        />
    </Router>
</main>

<style>
</style>
