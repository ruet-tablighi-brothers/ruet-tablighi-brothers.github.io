import type { Database } from "@/lib/supabase.types"
import { createStore } from "idb-keyval"
import { atom } from "jotai"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export const profilesAtom = atom<Profile[]>([])

export const profilesStore = createStore("rtb-profiles-store", "profiles")
