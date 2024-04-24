import type { Tables } from "@/lib/supabase.types"
import { createStore, entries } from "idb-keyval"
import { atom } from "jotai"

export type Profile = Tables<"profiles">

export const profilesStore = createStore("rtb-profiles-store", "profiles")

export const profilesAtom = atom<Profile[]>(
	(await entries(profilesStore)).map(([, x]) => x),
)
