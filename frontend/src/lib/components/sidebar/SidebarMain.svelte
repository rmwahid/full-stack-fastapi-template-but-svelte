<script lang="ts">
	import type { Component } from "svelte";
	import { page } from "$app/state";
	import {
		SidebarGroup,
		SidebarGroupContent,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		useSidebar,
	} from "$lib/components/ui/sidebar";

	export type SidebarItem = {
		icon: Component
		title: string
		path: string
	}

	interface Props {
		items: SidebarItem[]
	}

	let { items }: Props = $props()

	const sidebar = useSidebar()

	function handleMenuClick() {
		if (sidebar.isMobile) {
			sidebar.setOpenMobile(false)
		}
	}
</script>

<SidebarGroup>
	<SidebarGroupContent>
		<SidebarMenu>
			{#each items as item (item.title)}
				{@const isActive = page.url.pathname === item.path}
				<SidebarMenuItem>
					<SidebarMenuButton tooltipContent={item.title} {isActive}>
						<a href={item.path} onclick={handleMenuClick} class="flex w-full items-center gap-2">
							<item.icon />
							<span>{item.title}</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			{/each}
		</SidebarMenu>
	</SidebarGroupContent>
</SidebarGroup>
