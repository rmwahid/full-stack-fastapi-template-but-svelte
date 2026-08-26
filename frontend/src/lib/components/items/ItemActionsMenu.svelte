<script lang="ts">
	import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
	import type { ItemPublic } from "$lib/client";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import DeleteItem from "./DeleteItem.svelte";
	import EditItem from "./EditItem.svelte";

	interface Props {
		item: ItemPublic;
		class?: string;
	}

	let { item, class: className }: Props = $props();

	let menuOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);

	function closeMenu() {
		menuOpen = false;
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
					closeMenu();
					deleteOpen = true;
				}}
			>
				Delete Item
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Key by item id: table rows are keyed by index, so without this the
	     reused component would keep the previous row's form state. -->
	{#key item.id}
		<EditItem bind:open={editOpen} {item} onsuccess={closeMenu} />
		<DeleteItem bind:open={deleteOpen} id={item.id} onsuccess={closeMenu} />
	{/key}
</div>
