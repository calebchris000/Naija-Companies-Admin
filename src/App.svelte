<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import Signin from "./pages/auth/signin.svelte";
    import Dashboard from "./pages/dashboard/dashboard.svelte";
</script>

<main class="h-screen">
    <Router>
        <Route path="/login" component={Signin} />
        <Route path="/dashboard" component={Dashboard} />
    </Router>
</main>

<style>
</style>
