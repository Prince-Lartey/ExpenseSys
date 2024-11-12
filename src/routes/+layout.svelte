<script lang="ts">
    import '../app.css';
    import { Toaster } from "$lib/components/ui/sonner"
</script>

<Toaster richColors closeButton theme='light'/>

<main class="h-screen ">
    <slot />
</main>
