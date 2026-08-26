<script lang="ts">
	import { Section, Text } from "@better-svelte-email/components";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<Section style="background-color:#f2f8f7;border-left:3px solid #00897b;margin:24px 0 28px;padding:6px 18px">
	{@render children()}
</Section>
