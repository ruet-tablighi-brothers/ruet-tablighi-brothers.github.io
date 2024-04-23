import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-vite-plugin"
import react from "@vitejs/plugin-react-swc"
import million from "million/compiler"
import UnoCSS from "unocss/vite"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import svgr from "vite-plugin-svgr"
import topLevelAwait from "vite-plugin-top-level-await"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		topLevelAwait(),
		million.vite({
			auto: {
				threshold: 0.05,
				skip: ["useBadHook", /badVariable/g],
			},
		}),
		react(),
		TanStackRouterVite(),
		svgr(),
		UnoCSS(),
		tailwindcss(),
		VitePWA({
			registerType: "prompt",
			includeAssets: ["favicon.ico", "apple-touch-icon.png"],
			manifest: {
				name: "RUET Tablighi Brothers",
				short_name: "RUET Tablighi Brothers",
				description: "RUET Tablighi Brothers",
				theme_color: "#40c057",
				icons: [
					{
						src: "android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src/"),
		},
	},
})
