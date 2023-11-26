import { SwapState } from '../../cards/SwapCard/swapReducer/types'
import { ButtonType } from './constants'
import { isInsufficientFee } from './isInsufficientFee'

export function getButtonType(swapState: SwapState, isConnected: boolean): ButtonType {
	const { from, to, routes, isLoading, balance, isNoRoutes } = swapState

	if (isLoading) {
		return ButtonType.LOADING
	}

	if (isNoRoutes) {
		return ButtonType.NO_ROUTES
	}

	if (!isConnected) {
		return ButtonType.CONNECT_WALLET
	}

	if (!from.amount || (from.amount && !routes.length)) {
		return ButtonType.ENTER_AMOUNT
	}

	if (balance && Number(from.amount) > parseFloat(balance)) {
		return ButtonType.LOW_BALANCE
	}

	const isInsufficient = isInsufficientFee(swapState)

	if (isInsufficient) {
		return ButtonType.LOW_FEES
	}

	if (from.amount && to.amount && routes.length) {
		return ButtonType.SWAP
	}

	return ButtonType.ENTER_AMOUNT
}
