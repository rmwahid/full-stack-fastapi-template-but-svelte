<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"
	import Plus from "@lucide/svelte/icons/plus"

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

	const schema = z
		.object({
			email: z.email("Invalid email address"),
			full_name: z.string().optional(),
			password: z.string().min(8, "Password must be at least 8 characters"),
			confirm_password: z.string().min(1, "Password confirmation is required"),
			is_superuser: z.boolean(),
			is_active: z.boolean(),
		})
		.refine((data) => data.password === data.confirm_password, {
			message: "The passwords don't match",
			path: ["confirm_password"],
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
		defaults(
			{
				email: "",
				full_name: "",
				password: "",
				confirm_password: "",
				is_superuser: false,
				is_active: true,
			},
			zod4(schema),
		),
		{
			id: "admin-add-user",
			validators: zod4(schema),
			SPA: true,
			onUpdate: ({ result }) => {
				if (result.type !== "success") return
				if ($mutation.isPending) return
				$mutation.mutate({
					email: $fd.email,
					full_name: $fd.full_name,
					password: $fd.password,
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
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="my-4">
				<Plus class="mr-2" />
				Add User
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add User</Dialog.Title>
			<Dialog.Description>Create a new user account.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:form.enhance>
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="full_name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Full Name <span class="text-destructive">*</span></Form.Label>
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

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Set Password <span class="text-destructive">*</span></Form.Label>
							<PasswordInput {...props} bind:value={$fd.password} placeholder="Password" />
						{/snippet}
					</Form.Control>
					{#if $errors.password}
						<p class="text-xs font-medium text-destructive">{$errors.password[0]}</p>
					{/if}
				</Form.Field>

				<Form.Field {form} name="confirm_password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Confirm Password <span class="text-destructive">*</span></Form.Label>
							<PasswordInput {...props} bind:value={$fd.confirm_password} placeholder="Password" />
						{/snippet}
					</Form.Control>
					{#if $errors.confirm_password}
						<p class="text-xs font-medium text-destructive">{$errors.confirm_password[0]}</p>
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
