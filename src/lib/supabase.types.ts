export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			profiles: {
				Row: {
					blood_group: Database["public"]["Enums"]["blood_group"] | null
					college: string | null
					created_at: string
					days_in_tabligh: Database["public"]["Enums"]["days_in_tabligh"] | null
					department: Database["public"]["Enums"]["department"]
					email: string
					full_name: string
					home_district: Database["public"]["Enums"]["district"]
					id: number
					job: string[]
					phone: string[]
					present_address: string
					series: number
					updated_at: string
				}
				Insert: {
					blood_group?: Database["public"]["Enums"]["blood_group"] | null
					college?: string | null
					created_at?: string
					days_in_tabligh?:
						| Database["public"]["Enums"]["days_in_tabligh"]
						| null
					department: Database["public"]["Enums"]["department"]
					email: string
					full_name: string
					home_district: Database["public"]["Enums"]["district"]
					id?: number
					job: string[]
					phone: string[]
					present_address: string
					series: number
					updated_at?: string
				}
				Update: {
					blood_group?: Database["public"]["Enums"]["blood_group"] | null
					college?: string | null
					created_at?: string
					days_in_tabligh?:
						| Database["public"]["Enums"]["days_in_tabligh"]
						| null
					department?: Database["public"]["Enums"]["department"]
					email?: string
					full_name?: string
					home_district?: Database["public"]["Enums"]["district"]
					id?: number
					job?: string[]
					phone?: string[]
					present_address?: string
					series?: number
					updated_at?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
			days_in_tabligh:
				| "3 Chilla"
				| "1 Chilla"
				| "10-20 days"
				| "3-7 days"
				| "Not yet"
			department:
				| "ME"
				| "IPE"
				| "GCE"
				| "MTE"
				| "MSE"
				| "CFPE"
				| "CE"
				| "URP"
				| "Arch."
				| "BECM"
				| "CSE"
				| "EEE"
				| "ETE"
				| "ECE"
			district:
				| "Barishal"
				| "Jhalokati"
				| "Barguna"
				| "Pirojpur"
				| "Bhola"
				| "Brahmanbaria"
				| "Patuakhali"
				| "Chittagong"
				| "Bandarban"
				| "Cox's Bazar"
				| "Chandpur"
				| "Khagrachhari"
				| "Comilla"
				| "Noakhali"
				| "Feni"
				| "Dhaka"
				| "Lakshmipur"
				| "Gazipur"
				| "Rangamati"
				| "Kishoreganj"
				| "Faridpur"
				| "Manikganj"
				| "Gopalganj"
				| "Narayanganj"
				| "Madaripur"
				| "Rajbari"
				| "Munshiganj"
				| "Tangail"
				| "Narsingdi"
				| "Chuadanga"
				| "Shariatpur"
				| "Jhenaidah"
				| "Bagerhat"
				| "Kushtia"
				| "Jashore"
				| "Meherpur"
				| "Khulna"
				| "Satkhira"
				| "Magura"
				| "Mymensingh"
				| "Narail"
				| "Sherpur"
				| "Jamalpur"
				| "Joypurhat"
				| "Netrokona"
				| "Natore"
				| "Bogura"
				| "Pabna"
				| "Naogaon"
				| "Sirajganj"
				| "Chapai Nawabganj"
				| "Gaibandha"
				| "Rajshahi"
				| "Lalmonirhat"
				| "Dinajpur"
				| "Panchagarh"
				| "Kurigram"
				| "Thakurgaon"
				| "Nilphamari"
				| "Moulvibazar"
				| "Rangpur"
				| "Sylhet"
				| "Habiganj"
				| "Sunamganj"
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never
