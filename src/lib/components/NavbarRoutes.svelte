<script lang="ts">
    import { Button } from "$lib/components/ui/button"
    import LogOut from "lucide-svelte/icons/log-out"
    import * as Avatar from "$lib/components/ui/avatar";
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';

    let initials: string = ''

    // Fetch initials from the server
    onMount(async () => {
        try {
            const response = await fetch('/api/userName'); // Adjust the URL to your endpoint
            const data = await response.json();

            if (data.initials) {
                initials = data.initials;  // Set initials to be displayed in the avatar
            } else {
                toast.error('Could not fetch initials');
            }
        } catch (error) {
            console.error('Error fetching initials:', error);
            toast.error('Error fetching initials');
        }
    });
</script>
    
<div class='flex gap-x-2 ml-auto'>
    <Avatar.Root>
        <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar.Root>

    <div class='border-r-2 border-r-black mx-2'></div>

    <form method='POST' action="/?/logout">
        <Button type='submit' class='text-xs px-2'>
            <LogOut class='mr-2'/>
            Logout
        </Button>
    </form>
</div>