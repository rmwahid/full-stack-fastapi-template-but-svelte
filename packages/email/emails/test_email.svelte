<script lang="ts">
	import { Text } from "@better-svelte-email/components";
	import Callout from "../ui/Callout.svelte";
	import Detail from "../ui/Detail.svelte";
	import Heading from "../ui/Heading.svelte";
	import Layout from "../ui/Layout.svelte";

	let {
		projectName = "[[ project_name ]]",
		email = "[[ email ]]",
	}: { projectName?: string; email?: string } = $props();
</script>

<Layout
	title="{projectName} - Test email"
	preview="{projectName} email delivery is working"
	projectName={projectName}
>
	<Heading>Test email</Heading>
	<Text style="color:#334155;font-size:15px;line-height:26px;margin:0 0 18px">Hi,</Text>
	<Text style="color:#334155;font-size:15px;line-height:26px;margin:0 0 18px">
		This is a test email from {projectName}. If you're reading it, email delivery is configured correctly.
	</Text>
	<Callout>
		<Detail label="Sent to">{email}</Detail>
	</Callout>
	<Text style="color:#64748b;font-size:14px;line-height:23px;margin:0 0 16px">
		If you weren't expecting this email, you can safely ignore it.
	</Text>
</Layout>
