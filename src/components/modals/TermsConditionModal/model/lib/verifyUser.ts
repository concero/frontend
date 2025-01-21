import { Address } from 'viem'
import { acceptTerms } from '../../../../../api/concero/user/acceptTerms'
import { getAccessToken } from '../../../../../api/concero/user/getAccessToken'
import { SignMessageMutateAsync } from 'wagmi/query'
let isIdleVerify = true
export const verifyUser = async (address: Address, signMessageAsync: SignMessageMutateAsync<unknown>) => {
	try {
		await acceptTerms(address)
		//@ts-expect-error Here only AxiosResponse
	} catch (errObj: AxiosResponse) {
		if (errObj?.status === 403 && isIdleVerify) {
			try {
				await getAccessToken(address, signMessageAsync)
				isIdleVerify = false
				verifyUser(address, signMessageAsync)
			} catch (error) {
				console.error('Error during get access token', errObj)
				throw new Error(err)
			}
		} else {
			throw new Error('Error during authentication')
		}
	}
}
