<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { ItemPublic, ItemUpdate } from "$lib/client"
	import { ItemsService } from "$lib/client"
	import { Button } from "$lib/components/ui/button"
	import * as Dialog from "$lib/components/ui/dialog"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z.object({
		title: z.string().min(1, "Title is required"),
		description: z.string().optional(),
	})

	type FormData = z.infer<typeof schema>

	interface Props {
		item: ItemPublic;
		open?: boolean;
		onsuccess?: () => void;
	}

	let {
		item,
		open = $bindable(false),
		onsuccess,
	}: Props = $props();

	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: FormData) =>
			ItemsService.updateItem({ path: { id: item.id }, body: data as ItemUpdate }),
		onSuccess: () => {
			showSuccessToast("Item updated successfully")
			open = false
			onsuccess?.()
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
	})

	const form = superForm<FormData>(
		defaults({ title: item.title, description: item.description ?? "" }, zod4(schema)),
		{
			id: item.id,
			validators: zod4(schema),
			SPA: true,
			onUpdate: ({ result }) => {
				if (result.type !== "success") return
				if ($mutation.isPending) return
				$mutation.mutate({
					title: $fd.title,
					description: $fd.description ?? "",
				})
			},
		},
	)

	const fd = form.form
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Edit Item</Dialog.Title>
			<Dialog.Description>Update the item details below.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:form.enhance>
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Title <span class="text-destructive">*</span></Form.Label>
							<Input {...props} bind:value={$fd.title} placeholder="Title" type="text" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Description</Form.Label>
							<Input {...props} bind:value={$fd.description} placeholder="Description" type="text" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
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
