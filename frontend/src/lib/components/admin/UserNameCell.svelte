<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { cn } from "$lib/utils";

	interface Props {
		fullName: string | null | undefined;
		isCurrentUser?: boolean;
	}

	let { fullName, isCurrentUser = false }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<span class={cn("font-medium", !fullName && "text-muted-foreground")}>{fullName || "N/A"}</span>
	{#if isCurrentUser}
		<Badge variant="outline" class="text-xs">You</Badge>
	{/if}
</div>
