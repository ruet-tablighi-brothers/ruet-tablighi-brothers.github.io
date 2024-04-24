import { searchAtom } from "@/store/search"
import { ActionIcon, Group, Modal } from "@mantine/core"
import { Combobox, TextInput, useCombobox } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useMemo, useRef } from "react"
import { FaSearch } from "react-icons/fa"
import { FaArrowLeftLong } from "react-icons/fa6"

export const Route = createFileRoute("/search/")({
	component: Index,
})

function Index() {
	const router = useRouter()
	const navigate = useNavigate({ from: Route.fullPath })
	const search = useAtomValue(searchAtom)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [query, setQuery] = useDebouncedState("", 200)
	const suggestions = useMemo(
		() =>
			query === ""
				? []
				: Array.from(
						search
							.autoSuggest(query, {})
							.reduce<Set<string>>((acc, { terms }) => {
								for (const term of terms) {
									acc.add(term)
								}
								return acc
							}, new Set<string>()),
					).slice(0, 25),
		[search, query],
	)

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	})

	const options = suggestions.map((item) => (
		<Combobox.Option value={item} key={item}>
			{item}
		</Combobox.Option>
	))

	const quit = () => router.history.back()

	return (
		<Modal
			opened={true}
			onClose={quit}
			withCloseButton={false}
			fullScreen
			radius={0}
			padding={0}
		>
			<Combobox
				onOptionSubmit={(optionValue) => {
					if (inputRef.current) inputRef.current.value = optionValue
					setQuery(optionValue)
					navigate({
						to: "/search/results",
						search: { q: optionValue },
						replace: true,
					})
				}}
				store={combobox}
				withinPortal={false}
			>
				<Group
					component="form"
					onSubmit={(event) => {
						event.preventDefault()
						inputRef.current?.value &&
							navigate({
								to: "/search/results",
								search: { q: inputRef.current.value },
								replace: true,
							})
					}}
					gap="xs"
					px="xs"
					h={60}
					className="border-gray-200 border-b"
				>
					<ActionIcon
						aria-label="Back"
						onClick={quit}
						variant="subtle"
						color="dark"
						size="input-sm"
					>
						<FaArrowLeftLong />
					</ActionIcon>
					<Combobox.Target>
						<TextInput
							type="search"
							placeholder="Search"
							data-autofocus
							className="flex-grow"
							rightSection={<FaSearch />}
							ref={inputRef}
							defaultValue={query}
							onChange={(event) => {
								setQuery(event.currentTarget.value)
								combobox.openDropdown()
							}}
							onClick={() => combobox.openDropdown()}
							onFocus={() => combobox.openDropdown()}
							onBlur={() => combobox.closeDropdown()}
						/>
					</Combobox.Target>
				</Group>

				<Combobox.Options>{options}</Combobox.Options>
			</Combobox>
		</Modal>
	)
}
