import { useRegisterSW } from "virtual:pwa-register/react"
import { Button, Group, Text } from "@mantine/core"
import { Modal } from "@mantine/core"

export function ReloadPrompt() {
	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			console.log("SW Registered:", r)
		},
		onRegisterError(error) {
			console.log("SW registration error", error)
		},
	})
	const close = () => {
		setOfflineReady(false)
		setNeedRefresh(false)
	}

	return (
		<Modal
			opened={offlineReady || needRefresh}
			onClose={close}
			title={offlineReady ? "Ready" : "Update"}
		>
			<Text mb="md" fw={500}>
				{offlineReady ? "App ready to work offline" : "New version available!"}
			</Text>
			<Group>
				{needRefresh && (
					<Button onClick={() => updateServiceWorker(true)}>Update</Button>
				)}
				<Button onClick={close}>{offlineReady ? "OK" : "Cancel"}</Button>
			</Group>
		</Modal>
	)
}
