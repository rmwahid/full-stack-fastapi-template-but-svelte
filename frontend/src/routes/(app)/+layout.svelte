<script lang="ts">
	import { createAuth } from "$lib/auth.svelte"
	import Footer from "$lib/components/common/Footer.svelte"
	import AppSidebar from "$lib/components/sidebar/AppSidebar.svelte"
	import { SidebarInset, SidebarProvider, SidebarTrigger } from "$lib/components/ui/sidebar"

	let { children } = $props()
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<header class="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger class="-ml-1 text-muted-foreground" />
		</header>
		<main class="flex-1 p-6 md:p-8">
			<div class="mx-auto max-w-7xl">{@render children()}</div>
		</main>
		<Footer />
	</SidebarInset>
</SidebarProvider>
