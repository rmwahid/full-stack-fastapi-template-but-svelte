<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { UserPublic, UserUpdateMe } from "$lib/client"
	import { UsersService } from "$lib/client"
	import { Button } from "$lib/components/ui/button"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z.object({
		full_name: z.string(),
		email: z.email("Invalid email address"),
	})

	type FormData = z.infer<typeof schema>

	let { user }: { user: UserPublic } = $props()

	let editing = $state(false)
	let dirty = $state(false)

	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: UserUpdateMe) => UsersService.updateUserMe({ body: data }),
		onSuccess: () => {
			showSuccessToast("User updated successfully")
			editing = false
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries(),
	})

	const form = superForm<FormData>(
		defaults({ full_name: user.full_name ?? "", email: user.email }, zod4(schema)),
		{
			validators: zod4(schema),
			SPA: true,
			// Mirrors React's formState.isDirty: Save stays disabled until a field changes.
			onChange: () => (dirty = true),
			onUpdate: ({ result }) => {
				if (result.type !== "success") return
				if ($mutation.isPending) return
				$mutation.mutate({
					full_name: $fd.full_name ?? "",
					email: $fd.email,
				})
			},
		},
	)

	const fd = form.form
	const errors = form.errors

	function startEdit() {
		form.reset({ newState: { full_name: user.full_name ?? "", email: user.email } })
		dirty = false
		editing = true
	}

	function cancelEdit() {
		form.reset({ newState: { full_name: user.full_name ?? "", email: user.email } })
		dirty = false
		editing = false
	}
</script>

<div class="max-w-md">
	<h3 class="py-4 text-lg font-semibold">User Information</h3>
	<form method="POST" use:form.enhance class="flex flex-col gap-4">
		<Form.Field {form} name="full_name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Full name</Form.Label>
					{#if editing}
						<Input {...props} bind:value={$fd.full_name} placeholder="Full name" type="text" />
						{#if $errors.full_name}
							<p class="text-xs font-medium text-destructive">{$errors.full_name[0]}</p>
						{/if}
					{:else}
						<p class="max-w-sm truncate py-2 {!user.full_name ? 'text-muted-foreground' : ''}">
							{user.full_name || "N/A"}
						</p>
					{/if}
				{/snippet}
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					{#if editing}
						<Input {...props} bind:value={$fd.email} placeholder="Email" type="email" />
						{#if $errors.email}
							<p class="text-xs font-medium text-destructive">{$errors.email[0]}</p>
						{/if}
					{:else}
						<p class="max-w-sm truncate py-2">{user.email}</p>
					{/if}
				{/snippet}
			</Form.Control>
		</Form.Field>

		<div class="flex gap-3">
			{#if editing}
				<LoadingButton type="submit" loading={$mutation.isPending} disabled={!dirty}>Save</LoadingButton>
				<Button type="button" variant="outline" onclick={cancelEdit} disabled={$mutation.isPending}>
					Cancel
				</Button>
			{:else}
				<Button type="button" onclick={startEdit}>Edit</Button>
			{/if}
		</div>
	</form>
</div>
