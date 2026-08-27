<script lang="ts" module>
	import { type ButtonProps } from "$lib/components/ui/button/index.js";
</script>

<script lang="ts">
	import Loader2 from "@lucide/svelte/icons/loader-2";
	import { Button } from "$lib/components/ui/button";

	let {
		loading = false,
		class: className,
		children,
		...restProps
	}: ButtonProps & { loading?: boolean } = $props();
</script>

<Button class={className} disabled={loading || restProps.disabled} {...restProps}>
	{#if loading}
		<Loader2 class="size-4 animate-spin" aria-hidden="true"></Loader2>
	{/if}
	{@render children?.()}
</Button>
