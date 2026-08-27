<script lang="ts">
	import { Text } from "@better-svelte-email/components";
	import type { Snippet } from "svelte";

	let { label, children }: { label: string; children: Snippet } = $props();
</script>

<Text style="margin:12px 0">
	<span
		style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:1px;line-height:16px;text-transform:uppercase"
	>
		{label}
	</span>
	<br />
	<span
		style="color:#1e293b;font-family:Consolas,'Courier New',monospace;font-size:14px;font-weight:700;line-height:22px;word-break:break-all"
	>
		{@render children()}
	</span>
</Text>
