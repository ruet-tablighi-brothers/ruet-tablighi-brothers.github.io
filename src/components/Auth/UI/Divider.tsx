import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const dividerDefaultStyles = cva("block w-full h-px my-4 bg-[#eaeaea]")

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
	appearance?: Appearance
}

const Divider: React.FC<DividerProps> = ({
	children,
	appearance,
	...props
}) => {
	return (
		<div
			{...props}
			style={appearance?.style?.divider}
			className={dividerDefaultStyles()}
		/>
	)
}

export { Divider }
