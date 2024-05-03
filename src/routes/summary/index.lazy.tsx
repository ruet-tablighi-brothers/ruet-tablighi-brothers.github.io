import { departments } from "@/lib/enums"
import type { Enums } from "@/lib/supabase.types"
import { profilesAtom } from "@/store/profiles"
import { BarChart, PieChart } from "@mantine/charts"
import "@mantine/charts/styles.css"
import { Title } from "@mantine/core"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useMemo } from "react"

export const Route = createLazyFileRoute("/summary/")({
	component: Summary,
})

const colors = [
	"dark",
	"gray",
	"red",
	"pink",
	"grape",
	"violet",
	"indigo",
	"blue",
	"cyan",
	"green",
	"lime",
	"yellow",
	"orange",
	"teal",
] as const
const deptSeries = departments.map((x, i) => ({
	name: x,
	color: `${colors[i % colors.length]}.6`,
}))

function Summary() {
	const profiles = useAtomValue(profilesAtom)
	const seriesF = useMemo(() => {
		const f = new Map<number, Map<Enums<"department">, number>>()
		for (const profile of profiles) {
			let deptF = f.get(profile.series) as Map<Enums<"department">, number>
			if (!deptF) {
				deptF = new Map()
				f.set(profile.series, deptF)
			}
			deptF.set(profile.department, (deptF.get(profile.department) ?? 0) + 1)
		}
		return Array.from(f.entries(), ([series, f]) => ({
			series,
			...Object.fromEntries(f.entries()),
		}))
	}, [profiles])
	const deptF = useMemo(() => {
		const f = new Map<Enums<"department">, number>(
			departments.map((x) => [x, 0]),
		)
		for (const profile of profiles) {
			f.set(profile.department, (f.get(profile.department) ?? 0) + 1)
		}
		return Array.from(f.entries(), ([dept, f], i) => ({
			name: dept,
			value: f,
			color: `${colors[i % colors.length]}.6`,
		}))
	}, [profiles])

	return (
		<>
			<Title>Summary</Title>
			<Title order={2} mt="xl">
				Series wise count
			</Title>
			<p className="mt-4">Total {profiles.length}</p>
			<div className="mt-4 rounded border pr-2 pb-2">
				<BarChart
					h={300}
					data={seriesF}
					dataKey="series"
					type="stacked"
					series={deptSeries}
					withLegend
					tickLine="y"
				/>
			</div>
			<Title order={2} mt="xl">
				Department count
			</Title>
			<div className="mt-4 overflow-x-auto">
				<PieChart
					data={deptF}
					withLabels
					size={328}
					labelsType="percent"
					pieProps={{
						dataKey: "value",
						label: (x) =>
							`${x.name} ${((x.value * 100) / profiles.length).toPrecision(
								2,
							)}%`,
						outerRadius: "100%",
						fontSize: "8px",
					}}
					pieChartProps={{
						margin: { top: 60, left: 60, bottom: 60, right: 60 },
					}}
				/>
			</div>
		</>
	)
}
