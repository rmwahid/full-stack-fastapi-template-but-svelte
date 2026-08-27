<script lang="ts">
	import {
		Body,
		Column,
		Container,
		Hr,
		Html,
		Head,
		Preview,
		Row,
		Section,
		Text,
	} from "@better-svelte-email/components";
	import type { Snippet } from "svelte";

	interface Props {
		title: string;
		projectName: string;
		preview?: string;
		children: Snippet;
	}

	let { title, projectName, preview, children }: Props = $props();
</script>

<Html lang="en" dir="ltr">
	<Head>
		<title>{title}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	</Head>
	{#if preview}
		<Preview preview={preview} />
	{/if}
	<Body
		style="background-color:#f4f7f6;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;margin:0;padding:32px 12px"
	>
		<Container
			style="background-color:#ffffff;border:1px solid #dce7e5;border-radius:8px;box-sizing:border-box;margin:0 auto;max-width:560px;width:100%"
		>
			<Row>
				<Column style="padding:40px 36px 32px">
					<Section>
						<Hr style="border:0;border-top:3px solid #00897b;margin:0 0 16px;width:32px" />
						<Text
							style="color:#334155;font-size:13px;font-weight:700;letter-spacing:1px;line-height:20px;margin:0 0 32px;text-transform:uppercase"
						>
							{projectName}
						</Text>
					</Section>
					<Section>{@render children()}</Section>
					<Hr style="border:0;border-top:1px solid #dce7e5;margin:36px 0 18px;width:100%" />
					<Section>
						<Text style="color:#64748b;font-size:12px;line-height:20px;margin:0">
							&copy; {new Date().getFullYear()} {projectName}. All rights reserved.
						</Text>
					</Section>
				</Column>
			</Row>
		</Container>
	</Body>
</Html>
