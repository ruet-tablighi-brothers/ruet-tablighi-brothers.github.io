import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const inputDefaultStyles = cva(
	"w-full box-border cursor-text transition-colors duration-100 ease-in-out flex px-4 py-2 items-center justify-center gap-2 rounded cursor-pointer border w-full transition-colors duration-100 ease-in-out",
	{
		variants: {
			type: {
				default: "tracking-normal",
				password: "tracking-normal",
			},
		},
	},
)

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	children?: React.ReactNode
	type: "text" | "password" | "email"
	appearance?: Appearance
}

const Input: React.FC<InputProps> = ({ children, appearance, ...props }) => {
	return (
		<input
			{...props}
			style={appearance?.style?.input}
			className={inputDefaultStyles({
				type: props.type === "password" ? "password" : "default",
			})}
		/>
	)
}

export { Input }
