import type { Tables } from "@/lib/supabase.types"
import { profilesStore } from "@/store/profiles"
import { searchResultsAtom } from "@/store/search"
import { Badge, Text, Title } from "@mantine/core"
import { Link, createFileRoute, redirect } from "@tanstack/react-router"
import { noCase } from "change-case"
import { getMany } from "idb-keyval"
import { getDefaultStore } from "jotai"
import { z } from "zod"

const validateSearch = z.object({
	q: z.string().catch(""),
})

export const Route = createFileRoute("/search/results")({
	component: Results,
	validateSearch,
	beforeLoad: ({ search }) => {
		if (!search.q) throw redirect({ to: "/search" })
	},
	loaderDeps: ({ search: { q } }) => ({ q }),
	loader: async ({ deps: { q } }) => {
		const results = getDefaultStore().get(searchResultsAtom)(q)
		const profiles = await getMany(
			results.map((x) => +x.id),
			profilesStore,
		)

		return results.map((x, i) => {
			const profile = profiles[i] as Tables<"profiles">
			const matchedFields = [
				...Object.values(x.match).reduce((fieldSet, fieldNames) => {
					for (const fieldName of fieldNames) {
						fieldSet.add(fieldName)
					}
					return fieldSet
				}, new Set<string>()),
			]
			return {
				id: profile.id,
				full_name: profile.full_name,
				department: profile.department,
				series: profile.series,
				matchedFields,
			} as const
		})
	},
})

function Results() {
	const { q } = Route.useSearch()
	const results = Route.useLoaderData()
	return (
		<div className="mx-auto max-w-96">
			<Title component="h1" order={5}>
				Search results for "{q}"
			</Title>
			<Text c="dimmed">{results.length || "No"} results found</Text>
			<ul className="mt-4 space-y-4">
				{results.map((x) => (
					<li key={x.id} className="group">
						<Link
							to="/profile/$id"
							params={{ id: x.id.toString(36) }}
							className="flex items-center rounded-lg border p-2 group-odd:bg-slate-100"
						>
							<span className="overflow-hidden text-ellipsis whitespace-nowrap">
								{x.full_name}
							</span>
							<Badge
								className="ml-auto flex-shrink-0 group-odd:bg-slate-100"
								radius="sm"
								variant="default"
								size="xl"
							>
								{x.department} {(x.series % 100).toString().padStart(2, "0")}
							</Badge>
						</Link>
						<Text c="dimmed" size="sm">
							matches: {x.matchedFields.map((x) => noCase(x)).join(", ")}
						</Text>
					</li>
				))}
			</ul>
		</div>
	)
}
