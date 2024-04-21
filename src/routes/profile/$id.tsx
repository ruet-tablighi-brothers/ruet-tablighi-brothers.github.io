import { type Profile, profilesStore } from "@/store/profiles"
import { Anchor, Badge, Title } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import { get } from "idb-keyval"
import type { ComponentProps, ReactNode } from "react"
import { FaQuestionCircle } from "react-icons/fa"
import {
	FaBriefcase,
	FaEnvelope,
	FaHouse,
	FaLocationDot,
	FaPhone,
	FaSchool,
} from "react-icons/fa6"
import type { IconType } from "react-icons/lib"
import { MdBloodtype } from "react-icons/md"
import { Fragment } from "react/jsx-runtime"

export const Route = createFileRoute("/profile/$id")({
	component: ProfilePage,
	loader: ({ params: { id } }) =>
		get(Number.parseInt(id, 36), profilesStore) as Promise<Profile>,
})

function ProfilePage() {
	const profile = Route.useLoaderData()

	return profile ? (
		<>
			<Title ta="center" my="lg">
				{profile.full_name}
			</Title>
			<div className="mt-4 space-y-4 text-center">
				<Badge size="xl" variant="light">
					{profile.department}{" "}
					{(profile.series % 100).toString().padStart(2, "0")}
				</Badge>
				<dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<Item
						title="Email"
						icon={FaEnvelope}
						data={
							<Anchor href={`mailto:${profile.email}`}>{profile.email}</Anchor>
						}
					/>
					<Item
						title="Phone number"
						icon={FaPhone}
						data={profile.phone.map((x, i, arr) => (
							<Fragment key={x}>
								<Anchor href={`tel:${x}`}>{x}</Anchor>
								{arr.length - 1 - i > 0 && ", "}
							</Fragment>
						))}
					/>
					<Item title="Days in tabligh" data={profile.days_in_tabligh} />
					<Item title="College" icon={FaSchool} data={profile.college} />
					<Item
						title="Home District"
						icon={FaHouse}
						data={profile.home_district}
					/>
					<Item
						title="Blood Group"
						icon={MdBloodtype}
						data={profile.blood_group}
					/>
					<Item
						title="Present Address"
						icon={FaLocationDot}
						className="col-span-full"
						data={profile.present_address}
					/>
					<Item
						title="Career"
						icon={FaBriefcase}
						className="col-span-full"
						data={profile.job.join(", ")}
					/>
				</dl>
			</div>
		</>
	) : (
		<div>404</div>
	)
}

function Item({
	title,
	data,
	icon: Icon,
	...props
}: {
	title: string
	icon?: IconType
	data: ReactNode
} & ComponentProps<"div">) {
	return (
		<div {...props}>
			<dt className="flex items-center justify-center gap-2 font-bold">
				{Icon && <Icon />} {title}
			</dt>
			<dd>{data ?? <FaQuestionCircle className="inline" />}</dd>
		</div>
	)
}
