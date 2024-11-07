<script lang="ts">
    import { cn } from "$lib/utils"
    import { page } from '$app/stores'
    import type { ComponentType } from 'svelte'
    import type { Icon } from 'lucide-svelte'

    export let href: string
    export let icon: ComponentType<Icon>
    export let label: string

    $: pathname = $page.url.pathname
    $: isActive = (pathname === '/' && href === '/' || pathname === href || pathname.startsWith(`${href}/`))
</script>

<a {href} 
    class={cn('flex items-center gap-x-2 text-muted-foreground text-sm font-medium pl-6 transtion-all hover:text-slate-600 hover:bg-muted', {'bg-primary/20 text-primary hover:bg-primary/20 hover:text-primary': isActive})}>

    <div class="flex items-center gap-x-2 py-4">
        <svelte:component this={icon} class={cn('text-muted-foreground', {'text-primary': isActive})} size={22}/>
        {label}
    </div>

    <!-- <div class={cn('ml-auto h-full border-2 border-primary opacity-0 transition-all', {'opacity-100': isActive})}/> -->
</a>