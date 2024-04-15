import type { Session } from "@supabase/supabase-js"
import { createStore, get } from "idb-keyval"
import { atom } from "jotai"

export const authStore = createStore("rtb-auth-store", "auth")

export const sessionAtom = atom<Session | null>(
	((await get("session", authStore)) as Session) ?? null,
)
