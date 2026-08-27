<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { UpdatePassword } from "$lib/client"
	import { UsersService } from "$lib/client"
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
	const errors = form.errors
</script>

<div class="max-w-md">
	<h3 class="py-4 text-lg font-semibold">Change Password</h3>
	<form method="POST" use:form.enhance class="flex flex-col gap-4">
		<Form.Field {form} name="current_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Current Password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.current_password} data-testid="current-password-input" placeholder="••••••••" />
				{/snippet}
			</Form.Control>
			{#if $errors.current_password}
				<p class="text-xs font-medium text-destructive">{$errors.current_password[0]}</p>
			{/if}
		</Form.Field>

		<Form.Field {form} name="new_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>New Password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.new_password} data-testid="new-password-input" placeholder="••••••••" />
				{/snippet}
			</Form.Control>
			{#if $errors.new_password}
				<p class="text-xs font-medium text-destructive">{$errors.new_password[0]}</p>
			{/if}
		</Form.Field>

		<Form.Field {form} name="confirm_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.confirm_password} data-testid="confirm-password-input" placeholder="••••••••" />
				{/snippet}
			</Form.Control>
			{#if $errors.confirm_password}
				<p class="text-xs font-medium text-destructive">{$errors.confirm_password[0]}</p>
			{/if}
		</Form.Field>

		<LoadingButton type="submit" class="self-start" loading={$mutation.isPending}>Update Password</LoadingButton>
	</form>
</div>
