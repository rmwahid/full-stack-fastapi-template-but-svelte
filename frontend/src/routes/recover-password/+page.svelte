<script lang="ts">
	import { z } from "zod"
	import { createMutation } from "@tanstack/svelte-query"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { loginRecoverPasswordData } from "$lib/client"
	import { LoginService } from "$lib/client"
	import AuthLayout from "$lib/components/common/AuthLayout.svelte"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z.object({
		email: z.email("Invalid email address"),
	})

	type FormData = z.infer<typeof schema>

	let isSent = $state(false)

	const recoverPassword = createMutation({
		mutationFn: (data: loginRecoverPasswordData["path"]) =>
			LoginService.recoverPassword({ path: data }),
		onSuccess: () => {
			isSent = true
			showSuccessToast("Password recovery email sent successfully.")
		},
		onError: (error) => handleError(error, showErrorToast),
	})

	const form = superForm<FormData>(defaults(zod4(schema)), {
		validators: zod4(schema),
		SPA: true,
		onUpdate: ({ result }) => {
			if (result.type !== "success") return
			if ($recoverPassword.isPending) return
			$recoverPassword.mutate({ email: $fd.email })
		},
	})

	const fd = form.form
</script>

<svelte:head>
	<title>Password Recovery - FastAPI Template</title>
</svelte:head>

<AuthLayout>
	{#if isSent}
		<div class="mt-4 flex flex-col items-center gap-4 text-center">
			<h1 class="text-2xl font-bold">Check your email</h1>
			<p class="text-muted-foreground text-sm">
				If an account exists for that address, we have sent instructions to reset your password.
			</p>
			<a href="/login" class="text-sm underline underline-offset-4">Back to log in</a>
		</div>
	{:else}
		<form method="POST" use:form.enhance class="flex flex-col gap-4">
			<h1 class="text-center text-2xl font-bold">Password Recovery</h1>
			<p class="text-muted-foreground -mt-3 text-center text-sm">
				A password recovery email will be sent to the registered account.
			</p>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$fd.email} data-testid="email-input" placeholder="Email" type="email" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>
			<LoadingButton type="submit" loading={$recoverPassword.isPending}>Continue</LoadingButton>
		</form>
	{/if}
</AuthLayout>
