<script lang=ts>
    import { List, Gauge, Settings } from 'lucide-svelte'
    import SidebarItems from './SidebarItems.svelte'

    const routes = [
        {
            icon: List,
            label: 'Dashboard',
            href: '/user/dashboard'
        },

        {
            icon: Gauge,
            label: 'Transactions',
            href: '/user/transactions'
        },

        {
            icon: Settings,
            label: 'Settings',
            href: '/user/settings'
        },
    ]
</script>

<div class="flex flex-col w-full">
    {#each routes as {href, icon, label}}
        <SidebarItems {href} {icon} {label}/>
    {/each}
</div>