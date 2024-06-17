import type { Tables } from "@/lib/supabase.types"
import { createStore, entries } from "idb-keyval"
import { atom } from "jotai"

export type Profile = Tables<"profiles">

export const profilesStore = createStore("rtb-profiles-store", "profiles")

const _profilesAtom = atom<Profile[]>(
	(await entries(profilesStore)).map(([, x]) => x),
)

export const profilesAtom = atom(
	(get) => get(_profilesAtom).toSorted((a, b) => a.series - b.series),
	(_, set, profiles: Profile[]) => set(_profilesAtom, profiles),
)
