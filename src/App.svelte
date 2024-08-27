<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import Signin from "./pages/auth/signin.svelte";
    import Organization from "./pages/dashboard/organizations/organization.svelte";
    import OrganizationDetail from "./pages/dashboard/organizations/[id]/organizationDetail.svelte";
</script>

<main class="h-screen">
    <Router>
        <Route path="/login" component={Signin} />
        <Route path="/dashboard/organization" component={Organization} />
        <Route
            path="/dashboard/organization/:id"
            component={OrganizationDetail}
        />
    </Router>
</main>

<style>
</style>
