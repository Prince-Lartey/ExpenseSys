<script lang='ts'>
	import Navbar from '$lib/components/Navbar.svelte'
	import Sidebar from '$lib/components/Sidebar.svelte'
</script>

<div class='h-full'>
	<div class="fixed inset-y-0 z-50 h-[80px] w-full md:pl-56">
		<Navbar />
	</div>

	<div class="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
		<Sidebar />
	</div>

	<main class="h-full pt-[80px] md:pl-56">
		<slot />
	</main>
</div>