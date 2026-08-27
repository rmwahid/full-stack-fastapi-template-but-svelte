<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";

	let { isSuperuser }: { isSuperuser: boolean } = $props();
</script>

<Badge variant={isSuperuser ? "default" : "secondary"}>
	{isSuperuser ? "Superuser" : "User"}
</Badge>
