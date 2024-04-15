import { type Profile, profilesStore } from "@/store/profiles"
import { Anchor, Table } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import { get } from "idb-keyval"
import { Fragment } from "react/jsx-runtime"

export const Route = createFileRoute("/profile/$id")({
	component: ProfilePage,
	loader: ({ params: { id } }) =>
		get(Number.parseInt(id, 36), profilesStore) as Promise<Profile>,
})

function ProfilePage() {
	const profile = Route.useLoaderData()

	return profile ? (
		<Table>
			<Table.Tbody>
				<Table.Tr>
					<Table.Th>Name</Table.Th>
					<Table.Td>{profile.full_name}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Department</Table.Th>
					<Table.Td>{profile.department}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Series</Table.Th>
					<Table.Td>{profile.series}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Email</Table.Th>
					<Table.Td>
						<Anchor href={`mailto:${profile.email}`}>{profile.email}</Anchor>
					</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Phone</Table.Th>
					<Table.Td>
						{profile.phone.map((x, i, arr) => (
							<Fragment key={x}>
								<Anchor href={`tel:${x}`}>{x}</Anchor>
								{arr.length - 1 - i > 0 && ", "}
							</Fragment>
						))}
					</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Days in tableegh</Table.Th>
					<Table.Td>{profile.days_in_tableegh}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>College</Table.Th>
					<Table.Td>{profile.college}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Home District</Table.Th>
					<Table.Td>{profile.home_district}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Blood Group</Table.Th>
					<Table.Td>{profile.blood_group}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Present Address</Table.Th>
					<Table.Td>{profile.present_address}</Table.Td>
				</Table.Tr>
				<Table.Tr>
					<Table.Th>Career</Table.Th>
					<Table.Td>{profile.job.join(", ")}</Table.Td>
				</Table.Tr>
			</Table.Tbody>
		</Table>
	) : (
		<div>404</div>
	)
}
