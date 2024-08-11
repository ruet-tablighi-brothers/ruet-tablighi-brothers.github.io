import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const containerDefaultStyles = cva("flex gap-1", {
	variants: {
		direction: {
			horizontal: "grid grid-cols-[repeat(auto-fit,minmax(48px,1fr))]",
			vertical: "flex flex-col my-2",
		},
		gap: {
			small: "gap-1",
			medium: "gap-2",
			large: "gap-4",
		},
	},
	defaultVariants: {
		gap: "small",
	},
})

export interface ContainerProps
	extends React.HtmlHTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	direction?: "horizontal" | "vertical"
	gap?: "small" | "medium" | "large"
	appearance?: Appearance
}

const Container: React.FC<ContainerProps> = ({
	children,
	appearance,
	...props
}) => {
	return (
		<div
			{...props}
			style={appearance?.style?.container}
			className={containerDefaultStyles({
				direction: props.direction,
				gap: props.gap,
			})}
		>
			{children}
		</div>
	)
}

export { Container }
