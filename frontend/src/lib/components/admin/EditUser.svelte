<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { UserPublic, UserUpdate } from "$lib/client"
	import { UsersService } from "$lib/client"
	import { Button } from "$lib/components/ui/button"
	import * as Dialog from "$lib/components/ui/dialog"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z.object({
		email: z.email("Invalid email address"),
		full_name: z.string(),
		is_superuser: z.boolean(),
		is_active: z.boolean(),
	})

	type FormData = z.infer<typeof schema>

	interface Props {
		user: UserPublic
		open?: boolean
		onSuccess?: () => void
	}

	let { user, open = $bindable(false), onSuccess }: Props = $props()

	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: UserUpdate) =>
			UsersService.updateUser({ path: { user_id: user.id }, body: data }),
		onSuccess: () => {
			showSuccessToast("User updated successfully")
			open = false
			onSuccess?.()
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] })
			queryClient.invalidateQueries({ queryKey: ["currentUser"] })
		},
	})

	const form = superForm<FormData>(
		defaults(
			{
				email: user.email,
				full_name: user.full_name ?? "",
				is_superuser: Boolean(user.is_superuser),
				is_active: Boolean(user.is_active),
			},
			zod4(schema),
		),
		{
			id: user.id,
			validators: zod4(schema),
			SPA: true,
			onUpdate: ({ result }) => {
				if (result.type !== "success") return
				if ($mutation.isPending) return
				$mutation.mutate({
					email: $fd.email,
					full_name: $fd.full_name ?? "",
					is_superuser: Boolean($fd.is_superuser),
					is_active: Boolean($fd.is_active),
				})
			},
		},
	)

	const fd = form.form
	const errors = form.errors
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Edit User</Dialog.Title>
			<Dialog.Description>Update the user details below.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:form.enhance>
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="full_name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Full Name</Form.Label>
							<Input {...props} bind:value={$fd.full_name} placeholder="Full name" type="text" />
						{/snippet}
					</Form.Control>
					{#if $errors.full_name}
						<p class="text-xs font-medium text-destructive">{$errors.full_name[0]}</p>
					{/if}
				</Form.Field>

				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email <span class="text-destructive">*</span></Form.Label>
							<Input {...props} bind:value={$fd.email} placeholder="Email" type="email" />
						{/snippet}
					</Form.Control>
					{#if $errors.email}
						<p class="text-xs font-medium text-destructive">{$errors.email[0]}</p>
					{/if}
				</Form.Field>

				<label class="flex items-center gap-2 text-sm">
					<input bind:checked={$fd.is_superuser} type="checkbox" class="size-4 accent-primary" />
					<span>Is superuser?</span>
				</label>

				<label class="flex items-center gap-2 text-sm">
					<input bind:checked={$fd.is_active} type="checkbox" class="size-4 accent-primary" />
					<span>Is active?</span>
				</label>
			</div>

			<Dialog.Footer>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button {...props} variant="outline" disabled={$mutation.isPending}>Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<LoadingButton type="submit" loading={$mutation.isPending}>Save</LoadingButton>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
