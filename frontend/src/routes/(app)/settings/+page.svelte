<script lang="ts">
	import Appearance from "$lib/components/common/Appearance.svelte"
	import ChangePassword from "$lib/components/usersettings/ChangePassword.svelte"
	import DeleteAccount from "$lib/components/usersettings/DeleteAccount.svelte"
	import UserInformation from "$lib/components/usersettings/UserInformation.svelte"
	import { createAuth } from "$lib/auth.svelte"
	import * as Tabs from "$lib/components/ui/tabs"

	const auth = createAuth()
	const userStore = auth.user
	const currentUser = $derived($userStore.data)
</script>

<svelte:head>
	<title>Settings - FastAPI Template</title>
</svelte:head>

{#if currentUser}
	<div class="flex flex-col gap-6">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">User Settings</h1>
			<p class="text-muted-foreground">Manage your account settings and preferences</p>
		</div>

		<Tabs.Root value="my-profile">
			<Tabs.List>
				<Tabs.Trigger value="my-profile">My profile</Tabs.Trigger>
				<Tabs.Trigger value="password">Password</Tabs.Trigger>
				<Tabs.Trigger value="danger-zone">Danger zone</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="my-profile">
				<UserInformation user={currentUser} />
			</Tabs.Content>
			<Tabs.Content value="password">
				<ChangePassword />
			</Tabs.Content>
			<Tabs.Content value="danger-zone">
				<DeleteAccount />
			</Tabs.Content>
		</Tabs.Root>

		<div class="max-w-sm">
			<div class="text-muted-foreground mb-2 text-sm font-medium">Appearance</div>
			<Appearance />
		</div>
	</div>
{/if}
