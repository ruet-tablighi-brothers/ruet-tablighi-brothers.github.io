import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const anchorHTMLAttributes = cva([
	"text-4 text-gray-500 mb-1 block text-center underline hover:text-gray-700",
])

interface LabelProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	children: React.ReactNode
	appearance?: Appearance
}

const Anchor: React.FC<LabelProps> = ({ children, appearance, ...props }) => {
	return (
		<a
			{...props}
			style={appearance?.style?.anchor}
			className={anchorHTMLAttributes()}
		>
			{children}
		</a>
	)
}

export { Anchor }
