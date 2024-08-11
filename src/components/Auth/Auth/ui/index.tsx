import { PREPENDED_CLASS_NAMES } from "@supabase/auth-ui-shared"
import { cva } from "class-variance-authority"
import type { CssComponent } from "node_modules/@stitches/core/types/styled-component"
import type { ReactNode } from "react"
import type { Auth as AuthProps } from "../../types"
import Auth from "../Auth"

const containerDefaultStyles = cva([
	"rounded-12px w-360px px-32px py-28px",
	"shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px]",
])

interface Card {
	className?: string | CssComponent
}

export const AuthCard = ({
	children,
	appearance,
}: {
	children?: ReactNode
	appearance?: Card
}) => {
	const classNames = [
		`${PREPENDED_CLASS_NAMES}_ui-card`,
		containerDefaultStyles(),
		appearance?.className,
	]
	return <div className={classNames.join("")}>{children}</div>
}

export const SignUp = (
	props: Omit<AuthProps, "view" | "onlyThirdPartyProviders">,
) => {
	return (
		<Auth
			showLinks={false}
			{...props}
			onlyThirdPartyProviders={false}
			view="sign_up"
		/>
	)
}

export const SignIn = (
	props: Omit<AuthProps, "view" | "onlyThirdPartyProviders" | "additionalData">,
) => {
	return (
		<Auth
			showLinks={false}
			{...props}
			onlyThirdPartyProviders={false}
			view="sign_in"
		/>
	)
}

export const MagicLink = (
	props: Omit<
		AuthProps,
		| "view"
		| "onlyThirdPartyProviders"
		| "magicLink"
		| "showLinks"
		| "additionalData"
	>,
) => {
	return <Auth {...props} view="magic_link" showLinks={false} />
}

export const SocialAuth = (
	props: Omit<
		AuthProps,
		| "view"
		| "onlyThirdPartyProviders"
		| "magicLink"
		| "showLinks"
		| "additionalData"
	>,
) => {
	return (
		<Auth
			{...props}
			view="sign_in"
			showLinks={false}
			onlyThirdPartyProviders={true}
		/>
	)
}

export const ForgottenPassword = (
	props: Pick<
		AuthProps,
		| "supabaseClient"
		| "appearance"
		| "localization"
		| "theme"
		| "showLinks"
		| "redirectTo"
	>,
) => {
	return <Auth showLinks={false} {...props} view="forgotten_password" />
}

export const UpdatePassword = (
	props: Pick<
		AuthProps,
		"supabaseClient" | "appearance" | "localization" | "theme"
	>,
) => {
	return <Auth {...props} view="update_password" />
}

export const VerifyOtp = (
	props: Pick<
		AuthProps,
		"supabaseClient" | "appearance" | "localization" | "theme" | "otpType"
	>,
) => {
	return <Auth {...props} view="verify_otp" />
}
