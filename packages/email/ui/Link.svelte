<script lang="ts">
	import { Link as EmailLink } from "@better-svelte-email/components";
	import type { Snippet } from "svelte";

	let { href, children }: { href: string; children: Snippet } = $props();
</script>

<EmailLink
	{href}
	style="color:#00695c;text-decoration:underline;word-break:break-all"
>
	{@render children()}
</EmailLink>
