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
			message: "The passwords don't match",
			path: ["confirm_password"],
		})
		.refine((data) => data.new_password !== data.current_password, {
			message: "New password cannot be the same as the current one",
			path: ["new_password"],
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
			SPA: true,
			onUpdate: ({ result }) => {
				if (result.type !== "success") return
				if ($mutation.isPending) return
				$mutation.mutate({
					current_password: $fd.current_password,
					new_password: $fd.new_password,
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
		<form method="POST" use:form.enhance class="flex flex-col gap-4">
			<Form.Field {form} name="current_password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Current Password <span class="text-destructive">*</span></Form.Label>
						<PasswordInput {...props} bind:value={$fd.current_password} data-testid="current-password-input" placeholder="Current password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<Form.Field {form} name="new_password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Set New Password <span class="text-destructive">*</span></Form.Label>
						<PasswordInput {...props} bind:value={$fd.new_password} data-testid="new-password-input" placeholder="New password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<Form.Field {form} name="confirm_password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm New Password <span class="text-destructive">*</span></Form.Label>
						<PasswordInput {...props} bind:value={$fd.confirm_password} data-testid="confirm-password-input" placeholder="Confirm new password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<div class="flex justify-end">
				<LoadingButton type="submit" loading={$mutation.isPending}>Update Password</LoadingButton>
			</div>
		</form>
	</Card.Content>
</Card.Root>
