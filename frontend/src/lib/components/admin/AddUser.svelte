<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { UserCreate } from "$lib/client"
	import { UsersService } from "$lib/client"
	import { Button } from "$lib/components/ui/button"
	import * as Dialog from "$lib/components/ui/dialog"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import PasswordInput from "$lib/components/ui/password-input.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z.object({
		email: z.email("Invalid email address"),
		full_name: z.string().min(1, "Full name is required"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		is_superuser: z.boolean(),
	})

	type FormData = z.infer<typeof schema>

	let open = $state(false)
	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: UserCreate) => UsersService.createUser({ body: data }),
		onSuccess: () => {
			showSuccessToast("User created successfully")
			form.reset()
			open = false
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
	})

	const form = superForm<FormData>(
		defaults({ email: "", full_name: "", password: "", is_superuser: false }, zod4(schema)),
		{
			validators: zod4(schema),
			onSubmit: ({ formData, cancel }) => {
				cancel()
				if ($mutation.isPending) return
				const entries = Object.fromEntries(formData.entries()) as Record<string, unknown>
				$mutation.mutate({
					email: String(entries.email ?? ""),
					full_name: String(entries.full_name ?? ""),
					password: String(entries.password ?? ""),
					is_superuser: formData.get("is_superuser") === "on" || entries.is_superuser === true,
				})
			},
		},
	)

	const fd = form.form
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props}>Add User</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add User</Dialog.Title>
			<Dialog.Description>Create a new user account.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={form.submit} method="POST">
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="full_name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Full Name <span class="text-destructive">*</span></Form.Label>
							<Input {...props} bind:value={$fd.full_name} placeholder="Full name" type="text" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email <span class="text-destructive">*</span></Form.Label>
							<Input {...props} bind:value={$fd.email} placeholder="Email" type="email" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Set Password <span class="text-destructive">*</span></Form.Label>
							<PasswordInput {...props} bind:value={$fd.password} placeholder="Password" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<label class="flex items-center gap-2 text-sm">
					<input bind:checked={$fd.is_superuser} type="checkbox" class="size-4 accent-primary" />
					<span>Superuser</span>
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
