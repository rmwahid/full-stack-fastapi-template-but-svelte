<script lang="ts">
	import { Heading as BaseHeading } from "@better-svelte-email/components";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<BaseHeading
	as="h1"
	style="color:#17212b;font-size:26px;font-weight:700;letter-spacing:-0.3px;line-height:34px;margin:0 0 20px"
>
	{@render children()}
</BaseHeading>
