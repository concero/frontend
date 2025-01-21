import { get } from '../../client'
import { type Address } from 'viem'
import { type IUser } from './userType'
import { TApiGetResponse } from '../../../types/utils'

export const fetchUserByAddress = async (address: Address) => {
	const url = `${process.env.CONCERO_API_URL}/users/${address}`

	const response = await get<TApiGetResponse<IUser>>(url)
	return response.data.data
}
