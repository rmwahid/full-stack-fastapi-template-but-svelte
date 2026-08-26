<script lang="ts">
	import Home from "@lucide/svelte/icons/home";
	import Briefcase from "@lucide/svelte/icons/briefcase";
	import Users from "@lucide/svelte/icons/users";
	import { createAuth } from "$lib/auth.svelte";
	import Logo from "$lib/components/common/Logo.svelte";
	import SidebarAppearance from "$lib/components/common/SidebarAppearance.svelte";
	import SidebarMain, { type SidebarItem } from "./SidebarMain.svelte";
	import SidebarUser from "./SidebarUser.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar";

	const auth = createAuth();
	const userStore = auth.user
	const currentUser = $derived($userStore.data)

	const baseItems: SidebarItem[] = [
		{ icon: Home, title: "Dashboard", path: "/" },
		{ icon: Briefcase, title: "Items", path: "/items" },
	];

	const items = $derived(
		currentUser?.is_superuser
			? [...baseItems, { icon: Users, title: "Admin", path: "/admin" }]
			: baseItems,
	);
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header class="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
		<Logo variant="responsive" />
	</Sidebar.Header>
	<Sidebar.Content>
		<SidebarMain {items} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<SidebarAppearance />
		<SidebarUser user={currentUser} />
	</Sidebar.Footer>
</Sidebar.Root>
