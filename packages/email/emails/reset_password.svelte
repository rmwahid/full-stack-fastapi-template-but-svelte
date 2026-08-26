<script lang="ts">
	import { Text } from "@better-svelte-email/components";
	import Heading from "../ui/Heading.svelte";
	import Layout from "../ui/Layout.svelte";
	import LinkButton from "../ui/LinkButton.svelte";
	import Link from "../ui/Link.svelte";

	let {
		projectName = "[[ project_name ]]",
		username = "[[ username ]]",
		link = "[[ link ]]",
		validHours = "[[ valid_hours ]]",
	}: { projectName?: string; username?: string; link?: string; validHours?: string } = $props();
</script>

<Layout
	title="{projectName} - Password recovery"
	preview="Reset your {projectName} password"
	projectName={projectName}
>
	<Heading>Reset your password</Heading>
	<Text style="color:#334155;font-size:15px;line-height:26px;margin:0 0 18px">Hi {username},</Text>
	<Text style="color:#334155;font-size:15px;line-height:26px;margin:0 0 18px">
		We've received a request to reset the password for your {projectName} account. Choose a new one by
		clicking the button below:
	</Text>
	<LinkButton href={link}>Reset password</LinkButton>
	<Text style="color:#64748b;font-size:14px;line-height:23px;margin:0 0 16px">
		Or copy and paste this link into your browser:
		<br />
		<Link href={link}>{link}</Link>
	</Text>
	<Text style="color:#64748b;font-size:14px;line-height:23px;margin:0 0 16px">
		This link will expire in {validHours} hours.
	</Text>
	<Text style="color:#64748b;font-size:14px;line-height:23px;margin:0 0 16px">
		If you didn't request a password recovery, you can safely ignore this email.
	</Text>
</Layout>
