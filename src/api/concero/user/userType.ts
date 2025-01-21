export type CompletedSteps = number[]
export type IQuestsInProgressMap = Record<any, any>
export type ICompletedQuestsMap = Record<any, any>

export interface IUserTier {
	level: string
	title: string
	bonuses: string[]
	pointsRequired: number
}

export interface UserStreaks {
	dailySwap: number
	liquidityHold: number
}

export interface UserMultiplier {
	default: number
	dailySwap: number | null
	liquidityHold: number | null
}

export interface UserConnectedSocials {
	twitter: {
		id: string
		screen_name: string
		name: string
	} | null
	discord: {
		id: string
		username: string
		email: string
		avatar: string
		locale: string
	} | null
}

export interface IUser {
	_id: string
	address: string
	tier: IUserTier
	points: number
	completedQuests: ICompletedQuestsMap
	questsInProgress: IQuestsInProgressMap
	multiplier: UserMultiplier
	streak: UserStreaks
	connectedSocials: UserConnectedSocials
	termsOfUse?: {
		accepted_version: string | null
	}
}
