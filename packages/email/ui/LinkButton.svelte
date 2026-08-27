<script lang="ts">
	import { Button } from "@better-svelte-email/components";
	import type { Snippet } from "svelte";

	let { href, children }: { href: string; children: Snippet } = $props();
</script>

<Button
	{href}
	pX={28}
	pY={13}
	style="background-color:#00796b;border-radius:6px;display:inline-block;margin:8px 0 28px;text-align:center;text-decoration:none"
	class="text-[14px] font-bold leading-[20px] text-white"
>
	{@render children()}
</Button>
