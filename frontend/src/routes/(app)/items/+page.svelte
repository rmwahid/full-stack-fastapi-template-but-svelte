<script lang="ts">
	import Search from "@lucide/svelte/icons/search";
	import { createQuery } from "@tanstack/svelte-query"

	import type { ItemsPublic } from "$lib/client"
	import { ItemsService } from "$lib/client"
	import DataTable from "$lib/components/common/DataTable.svelte"
	import AddItem from "$lib/components/items/AddItem.svelte"
	import { columns } from "$lib/components/items/columns"
	import PendingItems from "$lib/components/pending/PendingItems.svelte"

	const itemsQuery = createQuery<ItemsPublic>({
		queryKey: ["items"],
		queryFn: async () => (await ItemsService.readItems({ query: { skip: 0, limit: 100 } })).data,
	})

	const items = $derived($itemsQuery.data)
</script>

<svelte:head>
	<title>Items - FastAPI Template</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Items</h1>
			<p class="text-muted-foreground">Create and manage your items</p>
		</div>
		<AddItem />
	</div>

	{#if $itemsQuery.isPending}
		<PendingItems />
	{:else if items}
		{#if items.data.length === 0}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<div class="bg-muted mb-4 rounded-full p-4">
					<Search class="text-muted-foreground h-8 w-8" />
				</div>
				<h3 class="text-lg font-semibold">You don't have any items yet</h3>
				<p class="text-muted-foreground">Add a new item to get started</p>
			</div>
		{:else}
			<DataTable {columns} data={items.data} />
		{/if}
	{/if}
</div>
