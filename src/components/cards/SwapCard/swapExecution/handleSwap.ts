import { viemSigner } from '../../../../web3/ethers'
import { handleTransactionError } from '../handlers/handleTransactionError'
import { executeRangoRoute } from './executeRangoRoute'
import { executeLifiRoute } from '../../../../api/lifi/executeLifiRoute'
import { Route } from '../../../../api/lifi/types'
import { standardiseLifiRoute } from '../../../../api/lifi/standardiseLifiRoute'
import { updateLifiSteps } from './updateLifiSteps'

const handleExecuteRoute = async ({ route, provider, address, from, swapDispatch }) => {
  if (provider === 'lifi') {
    const updateCallback = (updatedRoute: Route) => {
      console.log('updatedRoute', updatedRoute)
      const stdRoute = standardiseLifiRoute(updatedRoute)
      console.log('stdRoute', stdRoute)
      updateLifiSteps({
        swapDispatch,
        selectedRoute: stdRoute,
      })
    }
    return await executeLifiRoute(viemSigner, route, { updateRouteHook: updateCallback })
  }
  if (provider === 'rango') return await executeRangoRoute(route, address, from)
}

const handleRangoResponse = (executedRoute, swapDispatch, provider) => {
  if (executedRoute.status === 'failed') {
    swapDispatch({
      type: 'SET_RESPONSES',
      payload: {
        provider,
        isOk: false,
        message: executedRoute.error,
      },
    })
  } else if (executedRoute.status === 'success') {
    swapDispatch({
      type: 'SET_RESPONSES',
      payload: {
        provider,
        isOk: true,
        message: 'Success',
      },
    })
  }
}

const handleLifiResponse = (executedRoute, swapDispatch, provider) => {
  if (executedRoute) {
    swapDispatch({
      type: 'SET_RESPONSES',
      payload: {
        provider,
        isOk: true,
        message: 'Success',
      },
    })
  }
}

export const handleSwap = async ({ swapDispatch, selectedRoute, provider, address, from, switchChainHook }) => {
  const { originalRoute } = selectedRoute
  if (!originalRoute) return console.error('No original route passed')

  swapDispatch({
    type: 'SET_LOADING',
    payload: true,
  })

  swapDispatch({
    type: 'SET_SWAP_STEP',
    payload: 'progress',
  })

  if (provider === 'lifi') {
    updateLifiSteps({
      swapDispatch,
      selectedRoute,
    })
  }

  try {
    await switchChainHook()
  } catch (e) {
    console.log('ERROR: ', e)
    swapDispatch({
      type: 'SET_LOADING',
      payload: false,
    })
    return
  }

  try {
    const executedRoute = await handleExecuteRoute({ route: originalRoute, provider, address, from, swapDispatch })

    if (provider === 'rango') {
      handleRangoResponse(executedRoute, swapDispatch, provider)
    } else if (provider === 'lifi') {
      handleLifiResponse(executedRoute, swapDispatch, provider)
    }
  } catch (e) {
    console.log('ERROR: ', e)
    handleTransactionError(e, swapDispatch, provider)
  } finally {
    swapDispatch({
      type: 'SET_LOADING',
      payload: false,
    })
  }
}
