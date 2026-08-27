<script lang="ts">
	import { Text } from "@better-svelte-email/components";
	import Callout from "../ui/Callout.svelte";
	import Detail from "../ui/Detail.svelte";
	import Heading from "../ui/Heading.svelte";
	import Layout from "../ui/Layout.svelte";
	import LinkButton from "../ui/LinkButton.svelte";
	import Link from "../ui/Link.svelte";

	let {
		projectName = "[[ project_name ]]",
		username = "[[ username ]]",
		password = "[[ password ]]",
		link = "[[ link ]]",
	}: { projectName?: string; username?: string; password?: string; link?: string } = $props();
</script>

<Layout
	title="{projectName} - New account"
	preview="Your {projectName} account is ready"
	projectName={projectName}
>
	<Heading>Welcome to {projectName}!</Heading>
	<Text style="color:#334155;font-size:15px;line-height:26px;margin:0 0 18px">Hi,</Text>
	<Text style="color:#334155;font-size:15px;line-height:26px;margin:0 0 18px">
		Your account has been successfully created and is ready to use. These are your credentials:
	</Text>
	<Callout>
		<Detail label="Username">{username}</Detail>
		<Detail label="Password">{password}</Detail>
	</Callout>
	<Text style="color:#334155;font-size:15px;line-height:26px;margin:0 0 18px">
		Get started by signing in to your dashboard:
	</Text>
	<LinkButton href={link}>Go to Dashboard</LinkButton>
	<Text style="color:#64748b;font-size:14px;line-height:23px;margin:0 0 16px">
		Or copy and paste this link into your browser:
		<br />
		<Link href={link}>{link}</Link>
	</Text>
	<Text style="color:#64748b;font-size:14px;line-height:23px;margin:0 0 16px">
		For security reasons, change your password after your first sign in.
	</Text>
</Layout>
