import { type Address, erc20Abi, formatUnits } from 'viem'
import { base } from 'viem/chains'
import { config } from '../../constants/config'
import { getPoolLiquidity } from './getPoolLiquidity'
import { abi as ParentPool } from '../../abi/ParentPool.json'
import { getPublicClient } from '@wagmi/core'
import { config as wagmiConfig } from '../../web3/wagmi'

const client = getPublicClient(wagmiConfig, { chainId: base.id })
const lpTokenDecimals = 18

export const getUserLpTokens = async (userAddress: Address): Promise<number> => {
	const lpTokens = await client.readContract({
		address: config.LPTOKEN,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [userAddress],
	})

	return Number(formatUnits(lpTokens, lpTokenDecimals))
}

export const getLpTotalSupply = async () => {
	const totalSupply = await client.readContract({
		address: config.LPTOKEN,
		abi: erc20Abi,
		functionName: 'totalSupply',
	})

	return Number(formatUnits(totalSupply, lpTokenDecimals))
}

export const calculateLpAmount = async (amountToDeposit: bigint) => {
	const childPoolsBalance = await getPoolLiquidity(true)

	return await client.readContract({
		address: config.PARENT_POOL_CONTRACT,
		abi: ParentPool,
		functionName: 'calculateLpAmount',
		args: [childPoolsBalance, amountToDeposit],
	})
}

export const calculateWithdrawableAmount = async (clpAmount: bigint) => {
	const childPoolsBalance = await getPoolLiquidity(true)

	return await client.readContract({
		address: config.PARENT_POOL_CONTRACT,
		abi: ParentPool,
		functionName: 'calculateWithdrawableAmount',
		args: [childPoolsBalance, clpAmount],
	})
}
