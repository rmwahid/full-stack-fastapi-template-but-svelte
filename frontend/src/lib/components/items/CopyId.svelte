<script lang="ts">
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import Button from "$lib/components/ui/button/button.svelte";
	import { createCopyToClipboard } from "$lib/hooks/copy-to-clipboard.svelte";

	let { id }: { id: string } = $props();

	const clipboard = createCopyToClipboard();
</script>

<div class="group flex items-center gap-1.5">
	<span class="text-muted-foreground font-mono text-xs">{id}</span>
	<Button
		variant="ghost"
		size="icon-xs"
		class="opacity-0 transition-opacity group-hover:opacity-100"
		onclick={() => clipboard.copy(id)}
	>
		{#if clipboard.copiedText === id}
			<Check class="size-3 text-green-500" />
		{:else}
			<Copy class="size-3" />
		{/if}
		<span class="sr-only">Copy ID</span>
	</Button>
</div>
