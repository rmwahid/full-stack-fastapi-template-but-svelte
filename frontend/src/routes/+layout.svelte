<script lang="ts">
	import "../app.css"
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query"
	import { ModeWatcher } from "mode-watcher"
	import { Toaster } from "$lib/components/ui/sonner";

	const queryClient = new QueryClient()

	let { children } = $props()

	$effect(() => {
		document.documentElement.setAttribute("data-hydrated", "true")
	})
</script>

<ModeWatcher defaultMode="dark" lightClassNames={["light"]} darkClassNames={["dark"]} />

<QueryClientProvider client={queryClient}>
	{#if import.meta.env.DEV}
		{#await import("@tanstack/svelte-query-devtools") then { SvelteQueryDevtools }}
			<SvelteQueryDevtools client={queryClient} />
		{/await}
	{/if}
	<Toaster richColors closeButton />
	{@render children()}
</QueryClientProvider>
