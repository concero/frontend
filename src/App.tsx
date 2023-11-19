import './styles/App.css'
import { PostHogProvider } from 'posthog-js/react'
import { WagmiConfig } from 'wagmi'
import { Navigator } from './Navigator'
import { wagmiConfig } from './web3/wagmi'
import { ThemeProvider } from './hooks/themeContext'
import { SelectionProvider } from './hooks/SelectionContext'
import { Notifications } from './components/overlays/Notifications/Notifications'
import { NotificationsProvider } from './hooks/notificationsContext'
import { DataProvider } from './hooks/DataContext/DataContext'
import { lazy, useEffect } from 'react'
import { bigNumberSettings } from './utils/bigNumberSettings'
import { initPosthog } from './utils/initPosthog'
import { I18Provider } from './i18n/I18nextProvider'

const WalletConnectModal = lazy(() => import('./web3/WalletConnectModal').then(module => ({ default: module.WalletConnectModal })))

function App() {
	useEffect(() => {
		initPosthog()
		bigNumberSettings()
	}, [])

	return (
		<PostHogProvider>
			<I18Provider>
				<DataProvider>
					<SelectionProvider>
						<ThemeProvider>
							<NotificationsProvider>
								<Notifications />
								<WagmiConfig config={wagmiConfig}>
									<Navigator />
									<WalletConnectModal />
								</WagmiConfig>
							</NotificationsProvider>
						</ThemeProvider>
					</SelectionProvider>
				</DataProvider>
			</I18Provider>
		</PostHogProvider>
	)
}

export default App
