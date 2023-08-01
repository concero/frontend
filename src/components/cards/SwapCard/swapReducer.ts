import { useReducer } from 'react'
import { chains } from '../../../constants/chains'
import { lifiTokens } from '../../../constants/lifiTokens'
import { Action, State } from './types'

export function swapReducer(state: State, action: Action) {
  switch (action.type) {
    // ROUTE-RELATED ACTIONS
    case 'SET_ROUTES':
      return {
        ...state,
        routes: action.payload,
      }
    case 'POPULATE_ROUTES':
      return {
        ...state,
        isLoading: false,
        routes: action.payload.routes,
        originalRoutes: action.payload.originalRoutes,
        selectedRoute: action.payload.routes[0],
      }
    case 'CLEAR_ROUTES':
      return {
        ...state,
        isLoading: false,
        routes: [],
        selectedRoute: null,
        originalRoutes: [],
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_SELECTED_ROUTE':
      return {
        ...state,
        selectedRoute: action.payload,
      }
    case 'SET_ORIGINAL_ROUTES':
      return {
        ...state,
        originalRoutes: action.payload,
      }
    case 'SET_TYPING_TIMEOUT':
      return {
        ...state,
        typingTimeout: action.payload,
      }

    // INPUT_RELATED ACTIONS
    case 'SET_CHAIN':
      return {
        ...state,
        [action.direction]: {
          ...state[action.direction],
          chain: action.payload,
          token: lifiTokens[action.payload.id][0],
        },
      }
    case 'SET_TOKEN':
      return {
        ...state,
        [action.direction]: {
          ...state[action.direction],
          token: action.payload,
        },
      }
    case 'SET_AMOUNT':
      return {
        ...state,
        [action.direction]: {
          ...state[action.direction],
          ...(action.payload.amount !== undefined &&
            action.payload.amount !== null && { amount: action.payload.amount }),
          ...(action.payload.amount_usd !== undefined &&
            action.payload.amount_usd !== null && { amount_usd: action.payload.amount_usd }),
        },
      }
    case 'RESET_AMOUNTS':
      return {
        ...state,
        [action.direction]: {
          ...state[action.direction],
          amount: '',
          amount_usd: 0.0,
        },
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        [action.direction]: {
          ...state[action.direction],
          address: action.payload,
        },
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export const useSwapReducer = (selectionDispatch) => {
  const [state, dispatch] = useReducer(swapReducer, {
    from: {
      chain: {
        name: chains[0].name,
        symbol: chains[0].symbol,
        id: chains[0].id,
        logoURI: chains[0].logoURI,
      },
      token: {
        name: lifiTokens[chains[0].id][0].name,
        symbol: lifiTokens[chains[0].id][0].symbol,
        address: lifiTokens[chains[0].id][0].address,
        logoURI: lifiTokens[chains[0].id][0].logoURI,
      },
      amount: '',
      amount_usd: 0.0,
      address: '',
    },
    to: {
      chain: {
        name: chains[1].name,
        symbol: chains[1].symbol,
        id: chains[1].id,
        logoURI: chains[1].logoURI,
      },
      token: {
        name: lifiTokens[chains[1].id][0].name,
        symbol: lifiTokens[chains[1].id][0].symbol,
        address: lifiTokens[chains[1].id][0].address,
        logoURI: lifiTokens[chains[1].id][0].logoURI,
      },
      amount: '',
      amount_usd: 0.0,
      address: '',
    },
    routes: [],
    isLoading: false,
    selectedRoute: null,
    originalRoutes: [],
    typingTimeout: 0,
    errors: [],
  })

  return [state, dispatch]
}
