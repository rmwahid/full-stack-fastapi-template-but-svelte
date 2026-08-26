<script lang="ts">
	import { createMutation } from "@tanstack/svelte-query"
	import { goto } from "$app/navigation"

	import { UsersService } from "$lib/client"
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card"
	import * as Dialog from "$lib/components/ui/dialog"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { clearAccessToken } from "$lib/token"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	let isOpen = $state(false)

	const mutation = createMutation({
		mutationFn: async () => {
			await UsersService.deleteUserMe()
		},
		onSuccess: () => {
			showSuccessToast("Your account has been successfully deleted.")
			clearAccessToken()
			goto("/login")
		},
		onError: (error) => handleError(error, showErrorToast),
	})
</script>

<Card.Root class="border-destructive">
	<Card.Header>
		<Card.Title>Delete Account</Card.Title>
		<Card.Description>
			Permanently delete your account and all of its contents. This action cannot be undone.
		</Card.Description>
	</Card.Header>
	<Card.Footer class="justify-end">
		<Button variant="destructive" onclick={() => (isOpen = true)}>Delete Account</Button>
	</Card.Footer>
</Card.Root>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-md">
		<form onsubmit={() => $mutation.mutate()} method="POST">
			<Dialog.Header>
				<Dialog.Title>Delete Account</Dialog.Title>
				<Dialog.Description>
					All your data will be permanently removed. This action cannot be undone. Are you sure?
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="mt-4">
				<Dialog.Close>
					{#snippet child({ props })}
						<Button {...props} variant="outline" disabled={$mutation.isPending}>Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<LoadingButton variant="destructive" type="submit" loading={$mutation.isPending}>Delete</LoadingButton>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
