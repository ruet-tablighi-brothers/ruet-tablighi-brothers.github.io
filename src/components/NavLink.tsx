import { type NavLinkProps, NavLink as _NavLink } from "@mantine/core"
import { type ToOptions, useLinkProps } from "@tanstack/react-router"

export function NavLink({
	to,
	...props
}: Omit<NavLinkProps, "onChange"> & { to: ToOptions["to"] }) {
	const { onChange, ...linkProps } = useLinkProps({ to })

	return (
		<_NavLink
			{...props}
			{...linkProps}
			active={
				(linkProps as { "data-status": string })["data-status"] === "active"
			}
		/>
	)
}
