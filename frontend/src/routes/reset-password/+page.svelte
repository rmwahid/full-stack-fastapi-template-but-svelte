<script lang="ts">
	import { z } from "zod"
	import { createMutation } from "@tanstack/svelte-query"
	import { goto } from "$app/navigation"
	import { page } from "$app/state"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { NewPassword } from "$lib/client"
	import { LoginService } from "$lib/client"
	import AuthLayout from "$lib/components/common/AuthLayout.svelte"
	import * as Form from "$lib/components/ui/form"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import PasswordInput from "$lib/components/ui/password-input.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const token = $derived(page.url.searchParams.get("token") ?? "")

	const schema = z
		.object({
			new_password: z
				.string()
				.min(1, "Password is required")
				.min(8, "Password must be at least 8 characters"),
			confirm_password: z.string().min(1, "Password confirmation is required"),
		})
		.refine((data) => data.new_password === data.confirm_password, {
			message: "Passwords do not match",
			path: ["confirm_password"],
		})

	type FormData = z.infer<typeof schema>

	const resetPassword = createMutation({
		mutationFn: (data: NewPassword) => LoginService.resetPassword({ body: data }),
		onSuccess: () => {
			showSuccessToast("Password updated successfully.")
			goto("/login")
		},
		onError: (error) => handleError(error, showErrorToast),
	})

	const form = superForm<FormData>(defaults(zod4(schema)), {
		validators: zod4(schema),
		onSubmit: ({ formData, cancel }) => {
			cancel()
			if ($resetPassword.isPending) return
			const values = Object.fromEntries(formData.entries()) as unknown as FormData
			$resetPassword.mutate({ new_password: values.new_password, token })
		},
	})

	const fd = form.form
</script>

<svelte:head>
	<title>Reset Password - FastAPI Template</title>
</svelte:head>

<AuthLayout>
	<form onsubmit={form.submit} method="POST" class="flex flex-col gap-4">
		<h1 class="text-center text-2xl font-bold">Reset Password</h1>
		<p class="text-muted-foreground -mt-3 text-center text-sm">
			Please enter your new password below.
		</p>

		<Form.Field {form} name="new_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>New password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.new_password} placeholder="New password" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs" />
		</Form.Field>

		<Form.Field {form} name="confirm_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.confirm_password} placeholder="Confirm password" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs" />
		</Form.Field>

		{#if !token}
			<p class="text-destructive text-sm">
				Missing or invalid reset token. Please request a new recovery email.
			</p>
		{/if}

		<LoadingButton type="submit" loading={$resetPassword.isPending} disabled={!token}>Reset Password</LoadingButton>
	</form>
</AuthLayout>
