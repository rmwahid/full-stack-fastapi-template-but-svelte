<script lang="ts" generics="TData extends RowData & { id: string }">
	import { createTable, FlexRender, type ColumnDef, type RowData } from "@tanstack/svelte-table"
	import ChevronLeft from "@lucide/svelte/icons/chevron-left"
	import ChevronRight from "@lucide/svelte/icons/chevron-right"
	import ChevronsLeft from "@lucide/svelte/icons/chevrons-left"
	import ChevronsRight from "@lucide/svelte/icons/chevrons-right"

	import type { PaginatedFeatures } from "./table-features"
	import { paginatedFeatures } from "./table-features"
	import Button from "$lib/components/ui/button/button.svelte"
	import * as Select from "$lib/components/ui/select"
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "$lib/components/ui/table"

	interface Props {
		columns: ColumnDef<PaginatedFeatures, TData>[]
		data: TData[]
	}

	let { columns, data }: Props = $props()

	const table = createTable({
		features: paginatedFeatures,
		columns,
		get data() {
			return data;
		},
		initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
	})

	const pagination = $derived(table.atoms.pagination.get())
	const pageCount = $derived(table.getPageCount())
</script>

<div class="flex flex-col gap-4">
	<Table>
		<TableHeader>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<TableRow class="hover:bg-transparent">
					{#each headerGroup.headers as header (header.id)}
						<TableHead>
							<FlexRender {header} />
						</TableHead>
					{/each}
				</TableRow>
			{/each}
		</TableHeader>
		<TableBody>
			{#if table.getRowModel().rows.length}
				{#each table.getRowModel().rows as row (row.original.id)}
					<TableRow>
						{#each row.getAllCells() as cell (cell.id)}
							<TableCell>
								<FlexRender {cell} />
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			{:else}
				<TableRow class="hover:bg-transparent">
					<td colspan={columns.length} class="text-muted-foreground h-32 text-center">No results found.</td>
				</TableRow>
			{/if}
		</TableBody>
	</Table>

	{#if pageCount > 1}
		<div class="flex flex-col items-start justify-between gap-4 border-t bg-muted/20 p-4 sm:flex-row sm:items-center">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div class="text-muted-foreground text-sm">
					Showing
					{pagination.pageIndex * pagination.pageSize + 1}
					to
					{Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)}
					of <span class="text-foreground font-medium">{data.length}</span> entries
				</div>
				<div class="flex items-center gap-x-2">
					<p class="text-muted-foreground text-sm">Rows per page</p>
					<Select.Root
						type="single"
						value={`${pagination.pageSize}`}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<Select.Trigger class="h-8 w-[70px]">
							{pagination.pageSize}
						</Select.Trigger>
						<Select.Content side="top">
							{#each [5, 10, 25, 50] as pageSize (pageSize)}
								<Select.Item value={`${pageSize}`} label={`${pageSize}`} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<div class="flex items-center gap-x-6">
				<div class="text-muted-foreground flex items-center gap-x-1 text-sm">
					<span>Page</span>
					<span class="text-foreground font-medium">{pagination.pageIndex + 1}</span>
					<span>of</span>
					<span class="text-foreground font-medium">{pageCount}</span>
				</div>

				<div class="flex items-center gap-x-1">
					<Button
						variant="outline"
						size="icon-sm"
						onclick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Go to first page</span>
						<ChevronsLeft class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onclick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Go to previous page</span>
						<ChevronLeft class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onclick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Go to next page</span>
						<ChevronRight class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onclick={() => table.setPageIndex(pageCount - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Go to last page</span>
						<ChevronsRight class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
