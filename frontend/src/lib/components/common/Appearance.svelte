<script lang="ts">
	import { setMode } from "mode-watcher";
	import Monitor from "@lucide/svelte/icons/monitor";
	import Moon from "@lucide/svelte/icons/moon";
	import Sun from "@lucide/svelte/icons/sun";
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
</script>

<div class="flex items-center justify-center">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} data-testid="theme-button" variant="outline" size="icon">
					<Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span class="sr-only">Toggle theme</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item data-testid="light-mode" onclick={() => setMode("light")}>
				<Sun class="mr-2 h-4 w-4" />
				Light
			</DropdownMenu.Item>
			<DropdownMenu.Item data-testid="dark-mode" onclick={() => setMode("dark")}>
				<Moon class="mr-2 h-4 w-4" />
				Dark
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => setMode("system")}>
				<Monitor class="mr-2 h-4 w-4" />
				System
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
