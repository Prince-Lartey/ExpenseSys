<script lang="ts">
    import { Button } from "$lib/components/ui/button"
    import LogOut from "lucide-svelte/icons/log-out"
    import * as Avatar from "$lib/components/ui/avatar";
    </script>
    
    <div class='flex gap-x-2 ml-auto'>
        <Avatar.Root>
            <Avatar.Fallback>PL</Avatar.Fallback>
        </Avatar.Root>
    
        <div class='border-r-2 border-r-black mx-2'/>

        <form method='POST' action="/?/logout">
            <Button type='submit' class='text-xs px-2'>
                <LogOut class='mr-2'/>
                Logout
            </Button>
        </form>
    </div>