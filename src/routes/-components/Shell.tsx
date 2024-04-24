import Logo from "@/assets/logo.svg?react"
import { NavLink } from "@/components/NavLink"
import { cn } from "@/lib/cn"
import { supabase } from "@/lib/supabase"
import { profilesStore } from "@/store/profiles"
import { authStore, sessionAtom } from "@/store/session"
import { sidebarOpenedAtom as openedAtom } from "@/store/sidebar"
import { ActionIcon, AppShell, Burger, Button, ScrollArea } from "@mantine/core"
import { Link, useRouterState } from "@tanstack/react-router"
import { clear } from "idb-keyval"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { type ReactNode, memo, useEffect } from "react"
import { FaHome, FaSearch } from "react-icons/fa"
import { RealtimeStatus } from "./RealtimeStatus"

const toggleAtom = atom(null, (get, set) => {
	set(openedAtom, !get(openedAtom))
})

export const Shell = memo(function Shell({
	children,
}: { children: ReactNode }) {
	const [opened, setOpened] = useAtom(openedAtom)
	const toggle = useSetAtom(toggleAtom)
	const session = useAtomValue(sessionAtom)
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	})

	useEffect(() => {
		pathname && setOpened(false)
	}, [pathname, setOpened])

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 360,
				breakpoint: "md",
				collapsed: { mobile: !session || !opened, desktop: !session },
			}}
			padding="md"
		>
			<AppShell.Header className="flex items-center gap-4 px-4">
				{session && (
					<Burger opened={opened} onClick={toggle} hiddenFrom="md" size="md" />
				)}
				<Link
					to="/"
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					search={{} as any}
					className={cn(
						"flex items-center gap-4",
						session ? "mr-auto" : "mx-auto",
					)}
				>
					<img
						src="/icon.svg"
						width={32}
						height={32}
						alt=""
						className="mr-auto"
					/>
					{!session && <Logo className="mr-auto block h-8 w-auto max-w-full" />}
				</Link>
				{session && (
					<>
						<RealtimeStatus />
						<ActionIcon
							component={Link}
							variant="subtle"
							color="dark"
							to="/search"
							radius="lg"
						>
							<FaSearch />
						</ActionIcon>
					</>
				)}
			</AppShell.Header>

			<AppShell.Navbar p="md" className="gap-4">
				<AppShell.Section>
					<Logo className="mx-auto block h-8 w-auto max-w-full" />
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

			<AppShell.Main className="break-words">{children}</AppShell.Main>
		</AppShell>
	)
})
