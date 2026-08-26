<script lang="ts">
	import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
	import LogOut from "@lucide/svelte/icons/log-out";
	import Settings from "@lucide/svelte/icons/settings";
	import type { UserPublic } from "$lib/client";
	import { createAuth } from "$lib/auth.svelte";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import {
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		useSidebar,
	} from "$lib/components/ui/sidebar";
	import { getInitials } from "$lib/utils";

	interface Props {
		user: UserPublic | undefined | null;
	}

	let { user }: Props = $props();

	const { logout } = createAuth();
	const sidebar = useSidebar();

	function handleMenuClick() {
		if (sidebar.isMobile) {
			sidebar.setOpenMobile(false);
		}
	}
</script>

{#snippet userInfo(fullName: string | null | undefined, email: string | null | undefined)}
	<div class="flex w-full min-w-0 items-center gap-2.5">
		<Avatar class="size-8">
			<AvatarFallback class="bg-zinc-600 text-white">{getInitials(fullName || "User")}</AvatarFallback>
		</Avatar>
		<div class="flex min-w-0 flex-col items-start">
			<p class="w-full truncate text-sm font-medium">{fullName}</p>
			<p class="text-muted-foreground w-full truncate text-xs">{email}</p>
		</div>
	</div>
{/snippet}

{#if user}
	<SidebarMenu>
		<SidebarMenuItem>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<SidebarMenuButton
							{...props}
							size="lg"
							class="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
							data-testid="user-menu"
						>
							{@render userInfo(user.full_name, user.email)}
							<ChevronsUpDown class="text-muted-foreground ml-auto size-4" />
						</SidebarMenuButton>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
					side={sidebar.isMobile ? "bottom" : "right"}
					align="end"
					sideOffset={4}
				>
					<DropdownMenu.Label class="p-0 font-normal">
						{@render userInfo(user.full_name, user.email)}
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<a href="/settings" onclick={handleMenuClick}>
						<DropdownMenu.Item>
							<Settings />
							User Settings
						</DropdownMenu.Item>
					</a>
					<DropdownMenu.Item onclick={logout}>
						<LogOut />
						Log Out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</SidebarMenuItem>
	</SidebarMenu>
{/if}
