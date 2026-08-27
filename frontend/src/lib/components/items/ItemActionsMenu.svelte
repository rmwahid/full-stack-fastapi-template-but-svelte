<script lang="ts">
	import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
	import type { ItemPublic } from "$lib/client";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import DeleteItem from "./DeleteItem.svelte";
	import EditItem from "./EditItem.svelte";

	interface Props {
		item: ItemPublic
		class?: string
	}

	let { item, class: className }: Props = $props()

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
				<Button {...props} variant="ghost" size="icon">
					<EllipsisVertical />
					<span class="sr-only">Open item actions menu</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item onclick={() => (editOpen = true)}>
				Edit Item
			</DropdownMenu.Item>
			<DropdownMenu.Item
				variant="destructive"
				onclick={() => {
					closeMenu()
					deleteOpen = true
				}}
			>
				Delete Item
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Key by item id so the dialogs are scoped to this item, even when the
	     table refetches and rows move between positions. -->
	{#key item.id}
		<EditItem bind:open={editOpen} {item} onSuccess={closeMenu} />
		<DeleteItem bind:open={deleteOpen} id={item.id} onSuccess={closeMenu} />
	{/key}
</div>
