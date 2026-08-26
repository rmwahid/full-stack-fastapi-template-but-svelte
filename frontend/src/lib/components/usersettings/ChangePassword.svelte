<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { UpdatePassword } from "$lib/client"
	import { UsersService } from "$lib/client"
	import * as Card from "$lib/components/ui/card"
	import * as Form from "$lib/components/ui/form"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import PasswordInput from "$lib/components/ui/password-input.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z
		.object({
			current_password: z.string().min(1, "Current password is required"),
			new_password: z
				.string()
				.min(1, "New password is required")
				.min(8, "Password must be at least 8 characters"),
			confirm_password: z.string().min(1, "Please confirm your password"),
		})
		.refine((data) => data.new_password === data.confirm_password, {
			message: "Passwords do not match",
			path: ["confirm_password"],
		})

	type FormData = z.infer<typeof schema>

	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: UpdatePassword) => UsersService.updatePasswordMe({ body: data }),
		onSuccess: () => {
			showSuccessToast("Your password has been changed successfully.")
			form.reset()
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries(),
	})

	const form = superForm<FormData>(
		defaults(
			{
				current_password: "",
				new_password: "",
				confirm_password: "",
			},
			zod4(schema),
		),
		{
			validators: zod4(schema),
			onSubmit: ({ formData, cancel }) => {
				cancel()
				if ($mutation.isPending) return
				const values = Object.fromEntries(formData.entries()) as unknown as FormData
				$mutation.mutate({
					current_password: values.current_password,
					new_password: values.new_password,
				})
			},
		},
	)

	const fd = form.form
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Change Password</Card.Title>
		<Card.Description>Update your password</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={form.submit} method="POST" class="flex flex-col gap-4">
			<Form.Field {form} name="current_password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Current Password <span class="text-destructive">*</span></Form.Label>
						<PasswordInput {...props} bind:value={$fd.current_password} placeholder="Current password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<Form.Field {form} name="new_password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Set New Password <span class="text-destructive">*</span></Form.Label>
						<PasswordInput {...props} bind:value={$fd.new_password} placeholder="New password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<Form.Field {form} name="confirm_password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm New Password <span class="text-destructive">*</span></Form.Label>
						<PasswordInput {...props} bind:value={$fd.confirm_password} placeholder="Confirm new password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<div class="flex justify-end">
				<LoadingButton type="submit" loading={$mutation.isPending}>Save</LoadingButton>
			</div>
		</form>
	</Card.Content>
</Card.Root>
