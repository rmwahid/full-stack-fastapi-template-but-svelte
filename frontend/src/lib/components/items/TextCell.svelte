<script lang="ts">
	import { cn } from "$lib/utils.js";

	interface Props {
		text: string;
		class?: string;
	}

	let { text, class: className }: Props = $props();
</script>

<span class={cn("block max-w-xs truncate", className)}>{text}</span>
