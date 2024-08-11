import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const labelDefaultStyles = cva("block mb-2 text-gray-500 text-sm font-sans")

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	children: React.ReactNode
	appearance?: Appearance
}

const Label: React.FC<LabelProps> = ({ children, appearance, ...props }) => {
	return (
		<label
			{...props}
			style={appearance?.style?.label}
			className={labelDefaultStyles()}
		>
			{children}
		</label>
	)
}

export { Label }
