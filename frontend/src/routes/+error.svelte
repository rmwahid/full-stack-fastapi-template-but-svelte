<script lang="ts">
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
</script>

<svelte:head>
	<title>{page.status} - FastAPI Template</title>
</svelte:head>

<div class="flex flex-col items-center justify-center gap-4 py-24 text-center">
	<p class="text-muted-foreground text-sm font-semibold uppercase tracking-wide">{page.status}</p>
	<h1 class="text-4xl font-bold tracking-tight">
		{page.status === 404 ? "Page not found" : "Something went wrong"}
	</h1>
	<p class="text-muted-foreground max-w-md">
		{page.status === 404
			? "Sorry, we couldn't find the page you're looking for."
			: (page.error?.message ?? "An unexpected error occurred.")}
	</p>
	<Button href="/">Back to home</Button>
</div>
