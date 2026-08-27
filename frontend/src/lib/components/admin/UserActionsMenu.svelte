<script lang="ts">
	import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
	import type { UserPublic } from "$lib/client";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import DeleteUser from "./DeleteUser.svelte";
	import EditUser from "./EditUser.svelte";

	interface Props {
		user: UserPublic & { isCurrentUser?: boolean }
		class?: string
	}

	let { user, class: className }: Props = $props()

	let menuOpen = $state(false)
	let editOpen = $state(false)
	let deleteOpen = $state(false)

	function closeMenu() {
		menuOpen = false
	}
</script>

<div class={className}>
	<DropdownMenu.Root bind:open={menuOpen}>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" disabled={user.isCurrentUser}>
					<EllipsisVertical />
					<span class="sr-only">Open user actions menu</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => (editOpen = true)}>Edit User</DropdownMenu.Item>
		<DropdownMenu.Item
			variant="destructive"
			onclick={() => {
				closeMenu()
				deleteOpen = true
			}}
		>
			Delete User
		</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Key by user id so the dialogs are scoped to this user, even when the
	     table refetches and rows move between positions. -->
	{#key user.id}
		<EditUser bind:open={editOpen} {user} onSuccess={closeMenu} />
		<DeleteUser bind:open={deleteOpen} id={user.id} email={user.email} onSuccess={closeMenu} />
	{/key}
</div>
