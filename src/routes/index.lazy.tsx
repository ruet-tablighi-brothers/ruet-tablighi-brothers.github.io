import { profilesAtom } from "@/store/profiles"
import {
	ActionIcon,
	Badge,
	Button,
	Group,
	MultiSelect,
	TextInput,
} from "@mantine/core"
import { YearPickerInput } from "@mantine/dates"
import { Link, createLazyFileRoute } from "@tanstack/react-router"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import Fuse from "fuse.js"
import { useAtomValue } from "jotai"
import { matchSorter } from "match-sorter"
import { useMemo, useRef, useState } from "react"
import { FaEllipsisV, FaSearch } from "react-icons/fa"
import { VscSearchFuzzy } from "react-icons/vsc"

export const Route = createLazyFileRoute("/")({
	component: Index,
})

const keys = ["department", "email", "full_name", "phone", "series"]
const departments = [
	"Arch.",
	"BECM",
	"CE",
	"CFPE",
	"CSE",
	"ECE",
	"EEE",
	"ETE",
	"GCE",
	"IPE",
	"ME",
	"MSE",
	"MTE",
	"URP",
]

function Index() {
	const profiles = useAtomValue(profilesAtom)
	const [search, setSearch] = useState("")
	const [fuzzy, setFuzzy] = useState(false)
	const [more, setMore] = useState(false)
	const [deptFilter, setDeptFilter] = useState<string[]>([])
	const [series, setSeries] = useState<[Date | null, Date | null]>([null, null])

	const listRef = useRef<HTMLDivElement | null>(null)

	const items = useMemo(() => {
		let items = profiles.slice().sort((a, b) => a.series - b.series)
		if (deptFilter.length)
			items = items.filter((x) => deptFilter.includes(x.department))
		const [fromSeries, toSeries] = series
		if (fromSeries && toSeries) {
			const from = fromSeries.getFullYear()
			const to = toSeries.getFullYear()
			items = items.filter((x) => from <= x.series && x.series <= to)
		}
		return items
	}, [profiles, deptFilter, series])
	const fuse = useMemo(
		() => (fuzzy ? new Fuse(items, { keys }) : null),
		[items, fuzzy],
	)
	const searchResults = useMemo(
		() =>
			!search
				? items
				: fuzzy
				  ? // biome-ignore lint/style/noNonNullAssertion: <explanation>
					  fuse!
							.search(search)
							.map((x) => x.item)
				  : matchSorter(items, search, { keys }),
		[search, items, fuzzy, fuse],
	)

	const virtualizer = useWindowVirtualizer({
		count: searchResults.length,
		estimateSize: () => 58,
		overscan: 5,
		scrollMargin: listRef.current?.offsetTop ?? 0,
	})

	return (
		<div className="space-y-4">
			<Group>
				<TextInput
					value={search}
					onChange={(event) => setSearch(event.currentTarget.value)}
					leftSection={<FaSearch />}
					className="flex-1"
				/>
				<ActionIcon
					variant={fuzzy ? "filled" : "default"}
					onClick={() => setFuzzy((x) => !x)}
					size="input-sm"
				>
					<VscSearchFuzzy size="1.2em" />
				</ActionIcon>
				<ActionIcon
					variant={more ? "filled" : "default"}
					onClick={() => setMore((x) => !x)}
					size="input-sm"
				>
					<FaEllipsisV size="1.2em" />
				</ActionIcon>
			</Group>
			{more && (
				<Group>
					<YearPickerInput
						type="range"
						placeholder="Series"
						className="basis-full md:basis-32"
						value={series}
						clearable
						allowSingleDateInRange
						onChange={setSeries}
						minDate={new Date("1964")}
						maxDate={new Date()}
						valueFormatter={({ date }) => {
							if (Array.isArray(date)) {
								const [a, b] = date.map((x) => x?.getFullYear())
								if (a === undefined) return ""
								if (b === undefined) return `${a} -`
								if (a === b) return `${a}`
								return `${a} - ${b}`
							}
							return ""
						}}
					/>
					<MultiSelect
						placeholder="Departments"
						data={departments}
						className="basis-full md:flex-1"
						value={deptFilter}
						onChange={setDeptFilter}
					/>
				</Group>
			)}
			{searchResults.length ? (
				<div ref={listRef}>
					<ul
						className="mx-auto max-w-96"
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const x = searchResults[virtualItem.index]
							return (
								<li
									key={virtualItem.key}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: `${virtualItem.size}px`,
										transform: `translateY(${
											virtualItem.start - virtualizer.options.scrollMargin
										}px)`,
									}}
								>
									<Link
										to="/profile/$id"
										params={{ id: x.id.toString(36) }}
										className="flex items-center rounded-lg border p-2"
									>
										{x.full_name}
										<Badge
											className="ml-auto"
											radius="sm"
											variant="default"
											size="xl"
										>
											{x.department} {x.series}
										</Badge>
									</Link>
								</li>
							)
						})}
					</ul>
				</div>
			) : (
				<p className="text-center text-lg">
					{!search ? (
						"No profiles added yet."
					) : fuzzy ? (
						"No results found!"
					) : (
						<>
							No results found!
							<br />
							<Button
								variant="subtle"
								onClick={() => setFuzzy(true)}
								leftSection={<VscSearchFuzzy size="1.2em" />}
								mt="md"
								size="lg"
							>
								Try Fuzzy Search
							</Button>
						</>
					)}
				</p>
			)}
		</div>
	)
}
