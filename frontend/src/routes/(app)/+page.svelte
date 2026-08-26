<script lang="ts">
	import { createAuth } from "$lib/auth.svelte"

	const auth = createAuth()
	const userStore = auth.user
	const currentUser = $derived($userStore.data)
</script>

<svelte:head>
	<title>Dashboard - FastAPI Template</title>
</svelte:head>

<div>
	<h1 class="text-2xl truncate max-w-sm">Hi, {currentUser?.full_name || currentUser?.email} 👋</h1>
	<p class="text-muted-foreground">Welcome back, nice to see you again!!!</p>
</div>
