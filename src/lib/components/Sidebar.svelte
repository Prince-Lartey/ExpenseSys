<script lang="ts">
    import SidebarRoutes from "./SidebarRoutes.svelte"
    import { Slack } from "lucide-svelte"
</script>

<div class='h-full border-r flex flex-col overflow-y-auto bg-slate-200 shadow-sm'>
    <div class='p-6 text-lg'>
        <Slack />
    </div>

    <div class='flex flex-col w-full'>
        <SidebarRoutes />
    </div>
</div>