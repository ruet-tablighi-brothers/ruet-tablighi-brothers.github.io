import type { Tables } from "@/lib/supabase.types"
import { atom } from "jotai"
import MiniSearch from "minisearch"
import { profilesAtom } from "./profiles"

const collegeNameTerms = new Set(["school", "and", "college"])

export const searchAtom = atom((get) => {
	const miniSearch = new MiniSearch<Tables<"profiles">>({
		fields: [
			"full_name",
			"college",
			"blood_group",
			"days_in_tabligh",
			"department",
			"series",
			"home_district",
			"present_address",
			"email",
			"phone",
			"job",
		], // fields to index for full-text search
		storeFields: ["id"], // fields to return with search results
		extractField: (document, fieldName) => {
			if (fieldName === "phone") return document.phone.join(" ")
			if (fieldName === "job") return document.job.join(" ")

			const fieldExists = (
				fieldName: string,
			): fieldName is keyof Tables<"profiles"> => fieldName in document
			if (fieldExists(fieldName)) {
				const value = document[fieldName]
				if (typeof value === "string") return value
				if (typeof value === "number") return value.toString()
			}
			return ""
		},
		tokenize: (string, fieldName) => {
			if (fieldName === "email")
				return string.includes("@") ? [string, string.split("@")[1]] : [""]
			if (fieldName === undefined && string.includes("@")) return [string]
			return MiniSearch.getDefault("tokenize")(string, fieldName)
		},
		processTerm: (term, fieldName) => {
			if (
				fieldName === "college_name" &&
				collegeNameTerms.has(term.toLocaleLowerCase())
			)
				return null
			return MiniSearch.getDefault("processTerm")(term, fieldName)
		},
	})

	miniSearch.addAll(get(profilesAtom))

	return miniSearch
})

export const searchResultsAtom = atom((get) => {
	const miniSearch = get(searchAtom)
	return (query: string) => {
		let results = miniSearch.search(query)
		if (results.length === 0)
			results = miniSearch.search(query, { prefix: true })
		if (results.length === 0) results = miniSearch.search(query, { fuzzy: 0.2 })
		return results
	}
})
