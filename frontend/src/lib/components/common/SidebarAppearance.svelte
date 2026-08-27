<script lang="ts">
	import { useSidebar } from "$lib/components/ui/sidebar";
	import { setMode, userPrefersMode } from "mode-watcher";
	import Monitor from "@lucide/svelte/icons/monitor";
	import Moon from "@lucide/svelte/icons/moon";
	import Sun from "@lucide/svelte/icons/sun";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { SidebarMenuItem, SidebarMenuButton } from "$lib/components/ui/sidebar";

	const sidebar = useSidebar()

	const icon = $derived(
		userPrefersMode.current === "system"
			? Monitor
			: userPrefersMode.current === "dark"
				? Moon
				: Sun,
	)
</script>

<SidebarMenuItem>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<SidebarMenuButton {...props} tooltipContent="Appearance" data-testid="theme-button">
					<svelte:component this={icon} class="text-muted-foreground size-4" />
					<span>Appearance</span>
					<span class="sr-only">Toggle theme</span>
				</SidebarMenuButton>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content
			preventScroll={false}
			side={sidebar.isMobile ? "top" : "right"}
			align="end"
			class="w-(--bits-dropdown-menu-anchor-width) min-w-56"
		>
			<DropdownMenu.Item data-testid="light-mode" onclick={() => setMode("light")}>
				<Sun class="mr-2 h-4 w-4" />
				Light
			</DropdownMenu.Item>
			<DropdownMenu.Item data-testid="dark-mode" onclick={() => setMode("dark")}>
				<Moon class="mr-2 h-4 w-4" />
				Dark
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => setMode("system")}>
				<Monitor class="mr-2 h-4 w-4" />
				System
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</SidebarMenuItem>
