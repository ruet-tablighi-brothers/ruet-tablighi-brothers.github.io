import { supabase } from "@/lib/supabase"
import { profilesAtom, profilesStore } from "@/store/profiles"
import { Center, Loader } from "@mantine/core"
import { entries, setMany } from "idb-keyval"
import { useSetAtom } from "jotai"
import { type ReactNode, useEffect, useState } from "react"

export function Sync({ children }: { children: ReactNode }) {
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
			.then((max_updated_at) => {
				let query = supabase.from("profiles").select()
				if (max_updated_at) query = query.gt("updated_at", max_updated_at)
				query.then(async (res) => {
					try {
						if (res.data)
							await setMany(
								res.data.map((x) => [x.id, x]),
								profilesStore,
							)
						setProfiles((await entries(profilesStore)).map(([, x]) => x))
					} finally {
						setLoading(false)
					}
				})
			})
	}, [setProfiles])

	return loading ? (
		<Center className="fixed inset-0">
			<Loader type="dots" />
		</Center>
	) : (
		children
	)
}
