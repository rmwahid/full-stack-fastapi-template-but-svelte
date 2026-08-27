<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query"

	import type { UserPublic, UsersPublic } from "$lib/client"
	import { UsersService } from "$lib/client"
	import DataTable from "$lib/components/common/DataTable.svelte"
	import { columns, type UserTableData } from "$lib/components/admin/columns"
	import AddUser from "$lib/components/admin/AddUser.svelte"
	import PendingUsers from "$lib/components/pending/PendingUsers.svelte"
	import { createAuth } from "$lib/auth.svelte"

	const auth = createAuth()
	const userStore = auth.user
	const currentUser = $derived($userStore.data)

	const usersQuery = createQuery<UsersPublic>({
		queryKey: ["users"],
		queryFn: async () => (await UsersService.readUsers({ query: { skip: 0, limit: 100 } })).data,
	})

	const tableData = $derived(
		$usersQuery.data?.data.map(
			(user: UserPublic): UserTableData => ({
				id: user.id,
				email: user.email,
				full_name: user.full_name,
				is_superuser: Boolean(user.is_superuser),
				is_active: Boolean(user.is_active),
				isCurrentUser: currentUser?.id === user.id,
			}),
		),
	)
</script>

<svelte:head>
	<title>Admin - FastAPI Template</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Users</h1>
			<p class="text-muted-foreground">Manage user accounts and permissions</p>
		</div>
		<AddUser />
	</div>

	{#if $usersQuery.isPending || !tableData}
		<PendingUsers />
	{:else}
		<DataTable {columns} data={tableData} />
	{/if}
</div>
