import { supabase } from "@/lib/supabase"
import { profilesAtom, profilesStore } from "@/store/profiles"
import { Badge, Loader } from "@mantine/core"
import { useSubscription } from "@supabase-cache-helpers/postgrest-react-query"
import { entries, setMany } from "idb-keyval"
import { useSetAtom } from "jotai"
import { useEffect, useState } from "react"

export function RealtimeStatus() {
	const [loading, setLoading] = useState(true)
	const setProfiles = useSetAtom(profilesAtom)

	useEffect(() => {
		entries(profilesStore)
			.then((profiles) => {
				if (!profiles.length) return
				let max = profiles[0][1].updated_at
				for (let i = 0; i < profiles.length; ++i)
					if (profiles[i][1].updated_at > max) max = profiles[i][1].updated_at
				return max as string
			})
			.then(async (max_updated_at) => {
				let query = supabase.from("profiles").select()
				if (max_updated_at) query = query.gt("updated_at", max_updated_at)
				const res = await query
				if (res.data)
					await setMany(
						res.data.map((x) => [x.id, x]),
						profilesStore,
					)
				setProfiles((await entries(profilesStore)).map(([, x]) => x))
			})
			.finally(() => {
				setLoading(false)
			})
	}, [setProfiles])

	const { status } = useSubscription(
		supabase,
		"profiles-changes",
		{
			event: "*",
			table: "profiles",
			schema: "public",
		},
		["id"],
		{ callback: (payload) => console.log(payload) },
	)

	return loading ? (
		<Loader type="dots" />
	) : (
		status && (
			<Badge
				color={
					["TIMED_OUT"].includes(status)
						? "red"
						: ["CLOSED", "CHANNEL_ERROR"].includes(status)
							? "gray"
							: undefined
				}
			>
				{status === "CHANNEL_ERROR" ? "Offline" : status}
			</Badge>
		)
	)
}
