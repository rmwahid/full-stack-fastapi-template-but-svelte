<script lang="ts">
	import { createMutation } from "@tanstack/svelte-query"
	import { goto } from "$app/navigation"

	import { UsersService } from "$lib/client"
	import Button from "$lib/components/ui/button/button.svelte"
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

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault()
		$mutation.mutate()
	}
</script>

<div class="mt-4 max-w-md rounded-lg border border-destructive/50 p-4">
	<h3 class="font-semibold text-destructive">Delete Account</h3>
	<p class="mt-1 text-sm text-muted-foreground">
		Permanently delete your account and all associated data.
	</p>
	<Button variant="destructive" class="mt-3" onclick={() => (isOpen = true)}>Delete Account</Button>
</div>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-md">
		<form onsubmit={handleSubmit}>
			<Dialog.Header>
				<Dialog.Title>Confirmation Required</Dialog.Title>
				<Dialog.Description>
					All your account data will be <strong>permanently deleted.</strong> If you are sure,
					please click <strong>"Confirm"</strong> to proceed. This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="mt-4">
				<Dialog.Close>
					{#snippet child({ props })}
						<Button {...props} variant="outline" disabled={$mutation.isPending}>Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<LoadingButton variant="destructive" type="submit" loading={$mutation.isPending}>Confirm</LoadingButton>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
