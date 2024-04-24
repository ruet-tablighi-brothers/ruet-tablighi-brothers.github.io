import { departments } from "@/lib/enums"
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
import { useDebouncedCallback } from "@mantine/hooks"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import Fuse from "fuse.js"
import { useAtomValue } from "jotai"
import { matchSorter } from "match-sorter"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { FaEllipsisV, FaSearch } from "react-icons/fa"
import { VscSearchFuzzy } from "react-icons/vsc"
import { z } from "zod"

const validateSearch = z.object({
	search: z.string().catch(""),
	fuzzy: z.boolean().catch(false),
	deptFilter: z.string().array().catch([]),
	seriesRange: z.tuple([z.number(), z.number()]).catch([0, 0]),
})

type S = z.infer<typeof validateSearch>

export const Route = createFileRoute("/")({
	component: Index,
	validateSearch,
})

const keys = ["department", "email", "full_name", "series"]

const Filters = memo(function Filters() {
	const { search, fuzzy, deptFilter, seriesRange } = Route.useSearch()
	const [more, setMore] = useState(false)
	const seriesAsDates = useMemo(
		() => seriesRange.map((x) => (x ? new Date(`${x}`) : null)),
		[seriesRange],
	) as [Date | null, Date | null]
	const navigate = useNavigate({ from: Route.fullPath })
	const setSearch = <T extends keyof S>(key: T, value: S[T]) => {
		navigate({ search: (prev) => ({ ...prev, [key]: value }) })
	}
	const setSearchDebounced = useDebouncedCallback(setSearch, 450)

	const searchRef = useRef<HTMLInputElement | null>(null)
	useEffect(() => {
		if (searchRef.current) searchRef.current.value = search
	}, [search])

	return (
		<div className="space-y-4">
			<Group>
				<TextInput
					defaultValue={search}
					ref={searchRef}
					onChange={(event) => {
						setSearchDebounced("search", event.currentTarget.value)
					}}
					leftSection={<FaSearch />}
					placeholder="Search by name"
					className="flex-1"
				/>
				<ActionIcon
					variant={fuzzy ? "filled" : "default"}
					onClick={() => setSearch("fuzzy", !fuzzy)}
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
						defaultValue={seriesAsDates}
						key={JSON.stringify(seriesRange)}
						clearable
						allowSingleDateInRange
						onChange={([from, to]) => {
							if (!from === !to)
								setSearch("seriesRange", [
									from ? from.getFullYear() : 0,
									to ? to.getFullYear() : 0,
								])
						}}
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
						defaultValue={deptFilter}
						key={deptFilter.length}
						onChange={(value) => setSearch("deptFilter", value)}
						searchable
						clearable
					/>
				</Group>
			)}
		</div>
	)
})

function Index() {
	const profiles = useAtomValue(profilesAtom)
	const { search, fuzzy, deptFilter, seriesRange: series } = Route.useSearch()

	const listRef = useRef<HTMLDivElement | null>(null)

	const items = useMemo(() => {
		let items = profiles.slice().sort((a, b) => a.series - b.series)
		if (deptFilter.length)
			items = items.filter((x) => deptFilter.includes(x.department))
		const [from, to] = series
		if (from && to)
			items = items.filter((x) => from <= x.series && x.series <= to)
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
			<Filters />
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
									className="group"
								>
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
											{x.department}{" "}
											{(x.series % 100).toString().padStart(2, "0")}
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
								component={Link}
								variant="subtle"
								from={Route.fullPath}
								search={(prev: S) => ({ ...prev, fuzzy: true })}
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
