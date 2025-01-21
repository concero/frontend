import axios from 'axios'
import { useAccount, useSignMessage } from 'wagmi'
import { Button } from '../../buttons/Button/Button'
import { post } from '../../../api/client'

export function SignupBtn() {
	const { address } = useAccount()
	const { signMessageAsync } = useSignMessage()

	const handleSignMessage = async () => {
		if (!address) {
			console.error('Wallet not connected')
			return
		}

		try {
			const nonceResponse = await post(`${process.env.CONCERO_API_URL}/auth/nonce`, { address })
			const { data: nonce } = nonceResponse.data

			if (!nonce) {
				console.error('No nonce received')
				return
			}

			const signature = await signMessageAsync({ message: nonce })

			const verifyResponse = await post(`${process.env.CONCERO_API_URL}/auth/verify`, {
				address,
				signature,
			})

			if (verifyResponse.status === 204) {
				location.reload()
			} else {
				console.error('Authentication failed')
			}
		} catch (error) {
			console.error('Error during authentication', error)
		}
	}

	return (
		<Button variant="secondary" onClick={handleSignMessage}>
			Sign message
		</Button>
	)
}
