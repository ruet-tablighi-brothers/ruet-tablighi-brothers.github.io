import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const buttonDefaultStyles = cva(
	"flex items-center justify-center gap-2 rounded cursor-pointer border w-full transition-colors duration-100 ease-in-out px-4 py-2",
	{
		variants: {
			color: {
				default: ["bg-white text-gray-500 border-gray-300 hover:bg-gray-100"],
				primary: [
					"bg-[hsl(153_60%_53%)] text-white border-[hsl(154_54.8%_45.1%)] hover:bg-[hsl(154_54.8%_45.1%)]",
				],
			},
		},
		defaultVariants: {
			color: "default",
		},
	},
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	icon?: React.ReactNode
	color?: "default" | "primary"
	loading?: boolean
	appearance?: Appearance
}

const Button: React.FC<ButtonProps> = ({
	children,
	color = "default",
	appearance,
	icon,
	loading = false,
	...props
}) => {
	return (
		<button
			{...props}
			style={appearance?.style?.button}
			className={buttonDefaultStyles({ color: color })}
			disabled={loading}
		>
			{icon}
			{children}
		</button>
	)
}

export { Button }
