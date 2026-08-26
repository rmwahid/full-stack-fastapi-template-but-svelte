<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		isActive: boolean;
	}

	let { isActive }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<span class={cn("size-2 rounded-full", isActive ? "bg-green-500" : "bg-gray-400")}></span>
	<span class={!isActive ? "text-muted-foreground" : ""}>{isActive ? "Active" : "Inactive"}</span>
</div>
