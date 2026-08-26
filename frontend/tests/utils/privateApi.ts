import { client } from "../../src/lib/client/client.gen"
import { PrivateService } from "../../src/lib/client"

client.setConfig({
	baseUrl: `${process.env.VITE_API_URL}`,
})

export const createUser = async ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	const response = await PrivateService.createUser({
		body: {
			email,
			password,
			is_verified: true,
			full_name: "Test User",
		},
	})
	return response.data
}
