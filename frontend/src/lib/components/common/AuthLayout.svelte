<script lang="ts">
	import type { Snippet } from "svelte";
	import Appearance from "$lib/components/common/Appearance.svelte";
	import Logo from "$lib/components/common/Logo.svelte";
	import Footer from "$lib/components/common/Footer.svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="grid min-h-svh lg:grid-cols-2">
	<div class="bg-muted dark:bg-zinc-900 relative hidden lg:flex lg:items-center lg:justify-center">
		<Logo variant="full" className="h-16" asLink={false} />
	</div>
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-end">
			<Appearance />
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">{@render children()}</div>
		</div>
		<Footer />
	</div>
</div>
