import {
	createPaginatedRowModel,
	rowPaginationFeature,
	tableFeatures,
} from "@tanstack/svelte-table";

export const paginatedFeatures = tableFeatures({
	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel(),
});

export type PaginatedFeatures = typeof paginatedFeatures;
