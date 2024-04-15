import { supabase } from "@/lib/supabase"
import { Badge } from "@mantine/core"
import { useSubscription } from "@supabase-cache-helpers/postgrest-react-query"

export function RealtimeStatus() {
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

	return (
		status && (
			<Badge
				color={
					["CLOSED", "TIMED_OUT"].includes(status)
						? "red"
						: status === "CHANNEL_ERROR"
						  ? "gray"
						  : undefined
				}
			>
				{status === "CHANNEL_ERROR" ? "Offline" : status}
			</Badge>
		)
	)
}
