<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";

	const skeletonCols = [1, 2, 3, 4];
	const skeletonRows = [1, 2, 3, 4, 5];
</script>

<div class="flex flex-col gap-4 py-4">
	<Table>
		<TableHeader>
			<TableRow class="hover:bg-transparent">
				{#each skeletonCols as c (c)}
					<TableHead><Skeleton class="h-6 w-full" /></TableHead>
				{/each}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each skeletonRows as r (r)}
				<TableRow>
					{#each skeletonCols as c (c)}
						<TableCell><Skeleton class="h-6 w-full" /></TableCell>
					{/each}
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
