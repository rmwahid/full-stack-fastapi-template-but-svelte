import { type ColumnDef, renderComponent } from "@tanstack/svelte-table";

import type { ItemPublic } from "$lib/client";
import type { PaginatedFeatures } from "$lib/components/common/table-features";
import CopyId from "./CopyId.svelte";
import ItemActionsMenu from "./ItemActionsMenu.svelte";
import TextCell from "./TextCell.svelte";

export const columns: ColumnDef<PaginatedFeatures, ItemPublic>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: (ctx) => renderComponent(CopyId, { id: ctx.row.original.id }),
	},
	{
		accessorKey: "title",
		header: "Title",
		cell: (ctx) =>
			renderComponent(TextCell, { text: ctx.row.original.title, class: "font-medium" }),
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: (ctx) => {
			const description = ctx.row.original.description;
			return renderComponent(TextCell, {
				text: description || "No description",
				class: `text-muted-foreground${!description ? " italic" : ""}`,
			});
		},
	},
	{
		id: "actions",
		header: () => "",
		cell: (ctx) =>
			renderComponent(ItemActionsMenu, { item: ctx.row.original, class: "flex justify-end" }),
	},
];
