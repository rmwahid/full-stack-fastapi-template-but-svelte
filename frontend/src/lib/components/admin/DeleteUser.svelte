<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"

	import { UsersService } from "$lib/client"
	import { Button } from "$lib/components/ui/button"
	import * as Dialog from "$lib/components/ui/dialog"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	interface Props {
		id: string
		email?: string
		open?: boolean
		onSuccess?: () => void
	}

	let { id, email = "", open = $bindable(false), onSuccess }: Props = $props()

	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: async (userId: string) => {
			await UsersService.deleteUser({ path: { user_id: userId } })
		},
		onSuccess: () => {
			showSuccessToast(`The user "${email || id}" was deleted successfully`)
			open = false
			onSuccess?.()
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries(),
	})

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault()
		$mutation.mutate(id)
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<form onsubmit={handleSubmit}>
			<Dialog.Header>
				<Dialog.Title>Delete User</Dialog.Title>
				<Dialog.Description>
					This account{email ? ` (${email})` : ""} will be permanently deleted. Are you sure? You
					will not be able to undo this action.
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
