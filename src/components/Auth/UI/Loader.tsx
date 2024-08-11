import { cva } from "class-variance-authority"
import type { Appearance } from "../types"

const loaderDefaultStyles = cva(
	"rounded-full w-[10em] h-[10em] my-[60px] mx-auto text-[10px] relative border-t-[1.1em] border-r-[1.1em] border-b-[1.1em] border-l-[1.1em] border-t-[rgba(255,255,255,0.2)] border-r-[rgba(255,255,255,0.2)] border-b-[rgba(255,255,255,0.2)] border-l-[#ffffff] animate-spin",
)

export interface LoaderProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	appearance?: Appearance
}

function Loader({ appearance, ...props }: LoaderProps) {
	return (
		<div
			{...props}
			style={appearance?.style?.loader}
			className={loaderDefaultStyles()}
		/>
	)
}

export { Loader }
