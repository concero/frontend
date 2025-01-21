export type NestedObj<TObj, TKey extends keyof TObj> = {
	[key in TKey]: TObj[key] extends Record<string, unknown> ? NestedObj<TObj[key], keyof TObj[key]> : string
}

export interface ChartData {
	value: number
	time: number
}

export type TApiGetResponse<TData extends any> = {
	success: boolean
	data: TData
}
