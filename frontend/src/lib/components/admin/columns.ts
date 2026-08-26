import { type ColumnDef, renderComponent } from "@tanstack/svelte-table";
import type { PaginatedFeatures } from "$lib/components/common/table-features";
import TextCell from "$lib/components/items/TextCell.svelte";
import RoleBadge from "./RoleBadge.svelte";
import StatusBadge from "./StatusBadge.svelte";
import UserActionsMenu from "./UserActionsMenu.svelte";
import UserNameCell from "./UserNameCell.svelte";

export type UserTableData = {
	id: string;
	email: string;
	full_name: string | null | undefined;
	is_superuser: boolean;
	is_active: boolean;
	isCurrentUser: boolean;
};

export const columns: ColumnDef<PaginatedFeatures, UserTableData>[] = [
	{
		accessorKey: "full_name",
		header: "Full Name",
		cell: (ctx) => {
			const u = ctx.row.original;
			return renderComponent(UserNameCell, {
				fullName: u.full_name,
				isCurrentUser: u.isCurrentUser,
			});
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: (ctx) =>
			renderComponent(TextCell, { text: ctx.row.original.email, class: "text-muted-foreground" }),
	},
	{
		accessorKey: "is_superuser",
		header: "Role",
		cell: (ctx) =>
			renderComponent(RoleBadge, { isSuperuser: Boolean(ctx.row.original.is_superuser) }),
	},
	{
		accessorKey: "is_active",
		header: "Status",
		cell: (ctx) => renderComponent(StatusBadge, { isActive: Boolean(ctx.row.original.is_active) }),
	},
	{
		id: "actions",
		header: () => "",
		cell: (ctx) =>
			renderComponent(UserActionsMenu, { user: ctx.row.original, class: "flex justify-end" }),
	},
];
