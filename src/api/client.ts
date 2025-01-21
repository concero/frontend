import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const client = axios.create({
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	withCredentials: true,
})

const request = async <TResponse extends any>(options: AxiosRequestConfig) => {
	try {
		const response: AxiosResponse<TResponse, any> = await client(options)
		return response
	} catch (error) {
		console.error('Error', error.response)
		throw error.response
	}
}

export const get = async <TResponse extends any>(url: string, params?: any, headers?: any) =>
	await request<TResponse>({
		url,
		method: 'GET',
		params,
		headers,
	})

export const post = async <TResponse extends any>(url: string, data: any, headers?: any) =>
	await request<TResponse>({
		url,
		method: 'POST',
		data,
		headers,
	})

export const patch = async <TResponse extends any>(url: string, data: any, headers?: any) =>
	await request<TResponse>({
		url,
		method: 'PATCH',
		data,
		headers,
	})
