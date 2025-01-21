import { Address } from 'viem'
import { post } from '../../client'
import { SignMessageMutateAsync } from 'wagmi/query'

export const getAccessToken = async (
	address: Address,
	signMessageAsync: SignMessageMutateAsync<unknown>,
): Promise<true | never> => {
	if (!address) {
		console.error('Wallet not connected')
		throw new Error('Something went wrong')
	}

	try {
		const nonceResponse = await post(`${process.env.CONCERO_API_URL}/auth/nonce`, { address })
		const { data: nonce } = nonceResponse.data

		if (!nonce) {
			console.error('No nonce received')
			throw new Error('No nonce received')
		}

		const signature = await signMessageAsync({ message: nonce })

		const verifyResponse = await post(`${process.env.CONCERO_API_URL}/auth/verify`, {
			address,
			signature,
		})
		if (verifyResponse.status === 204) return true

		console.error('After verify status not 204, verifyResponse:', verifyResponse)
		throw new Error('After verify something went wrong')
	} catch (errMsg) {
		console.error('Error during authentication', errMsg)
		throw new Error('Something went wrong')
	}
}
