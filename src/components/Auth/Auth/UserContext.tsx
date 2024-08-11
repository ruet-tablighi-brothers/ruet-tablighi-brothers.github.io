import type { Session, SupabaseClient, User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"

export interface AuthSession {
	user: User | null
	session: Session | null
}

const UserContext = createContext<AuthSession>({ user: null, session: null })

export interface Props {
	supabaseClient: SupabaseClient
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[propName: string]: any
}

export const UserContextProvider = (props: Props) => {
	const { supabaseClient } = props
	const [session, setSession] = useState<Session | null>(null)
	const [user, setUser] = useState<User | null>(session?.user ?? null)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		;(async () => {
			const { data } = await supabaseClient.auth.getSession()
			setSession(data.session)
			setUser(data.session?.user ?? null)
		})()

		const { data: authListener } = supabaseClient.auth.onAuthStateChange(
			async (_event, session) => {
				setSession(session)
				setUser(session?.user ?? null)
			},
		)

		return () => {
			authListener?.subscription.unsubscribe()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const value = {
		session,
		user,
	}
	return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error("useUser must be used within a UserContextProvider.")
	}
	return context
}
