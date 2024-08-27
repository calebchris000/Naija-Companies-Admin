<script lang="ts">
    import { Cookie } from "@src/utils";
    import { onMount } from "svelte";
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
