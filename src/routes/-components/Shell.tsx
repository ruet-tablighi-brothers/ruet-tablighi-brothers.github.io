import Logo from "@/assets/logo.svg?react"
import { NavLink } from "@/components/NavLink"
import { supabase } from "@/lib/supabase"
import { profilesStore } from "@/store/profiles"
import { authStore, sessionAtom } from "@/store/session"
import { sidebarOpenedAtom as openedAtom } from "@/store/sidebar"
import { AppShell, Burger, Button, ScrollArea } from "@mantine/core"
import { useRouterState } from "@tanstack/react-router"
import { clear } from "idb-keyval"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { type ReactNode, useEffect } from "react"
import { FaHome } from "react-icons/fa"
import { RealtimeStatus } from "./RealtimeStatus"

const toggleAtom = atom(null, (get, set) => {
	set(openedAtom, !get(openedAtom))
})

export function Shell({ children }: { children: ReactNode }) {
	const [opened, setOpened] = useAtom(openedAtom)
	const toggle = useSetAtom(toggleAtom)
	const session = useAtomValue(sessionAtom)
	const location = useRouterState({
		select: (state) => state.location,
	})

	useEffect(() => {
		location && setOpened(false)
	}, [location, setOpened])

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !session || !opened, desktop: !session },
			}}
			padding="md"
		>
			<AppShell.Header className="flex items-center px-4">
				{session && (
					<>
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="md"
							className="mr-auto"
						/>
						<RealtimeStatus />
					</>
				)}
			</AppShell.Header>

			<AppShell.Navbar p="md" className="gap-4">
				<AppShell.Section>
					<Logo className="mx-auto block max-w-full" />
				</AppShell.Section>
				<AppShell.Section grow component={ScrollArea}>
					{([["/", "Home", FaHome]] as const).map(([path, label, Icon]) => (
						<NavLink
							key={path}
							to={path}
							label={label}
							leftSection={<Icon />}
						/>
					))}
				</AppShell.Section>
				{session && (
					<Button
						onClick={() => {
							supabase.auth.signOut()
							clear(authStore)
							clear(profilesStore)
						}}
					>
						Logout
					</Button>
				)}
			</AppShell.Navbar>

			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	)
}
