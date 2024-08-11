import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const messageDefaultStyles = cva(
	"block text-center rounded-md px-4 py-6 text-[14px] leading-none mb-2 font-sans text-[#2b805a] bg-[#e7fcf1] border border-[#d0f3e1]",
	{
		variants: {
			color: {
				danger: "text-[#ff6369] bg-[#fff8f8] border-[#822025]",
			},
		},
	},
)

interface MessageProps extends React.HTMLAttributes<HTMLSpanElement> {
	children: React.ReactNode
	color?: "danger"
	appearance?: Appearance
}

const Message: React.FC<MessageProps> = ({
	children,
	appearance,
	...props
}) => {
	return (
		<span
			{...props}
			style={appearance?.style?.message}
			className={messageDefaultStyles({ color: props.color })}
		>
			{children}
		</span>
	)
}

export { Message }
