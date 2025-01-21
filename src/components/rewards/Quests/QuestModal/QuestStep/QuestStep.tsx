import { Button } from '../../../../buttons/Button/Button'
import classNames from './QuestStep.module.pcss'
import { Tag } from '../../../../layout/Tag/Tag'
import {
	type IQuest,
	type IQuestStep,
	OnChainSource,
	QuestCategory,
	QuestOnChainAction,
	QuestSocialAction,
	QuestType,
	SocialSource,
	VerificationStatus,
} from '../../../../../api/concero/quest/questType'
import { useEffect, useState } from 'react'
import { trackEvent } from '../../../../../hooks/useTracking'
import { action, category } from '../../../../../constants/tracking'
import { type IUser } from '../../../../../api/concero/user/userType'
import { verifyQuest } from '../../../../../api/concero/quest/verifyQuest'
import { fetchUserVolume } from '../../../../../api/concero/fetchUserVolume'
import { ProgressBar } from '../../../../layout/progressBar/ProgressBar'
import { getDayRangeDates, getWeekRangeDates } from '../../../../../utils/date/getRangeDates'
import { SkeletonLoader } from '../../../../layout/SkeletonLoader/SkeletonLoader'
import { toLocaleNumber } from '../../../../../utils/formatting'
import { termsIsActual } from '../../../../modals/TermsConditionModal/model/lib/termsIsActual'

type StepMode = 'group' | 'one'

export interface Props {
	step: IQuestStep
	user: IUser | null | undefined
	quest: IQuest
	mode?: StepMode
	addCompletedStep: (id: number) => void
	isCompleted?: boolean
	isConnected: boolean
}

const defaultStartQuestLinkMap: Record<any, string> = {
	[OnChainSource.INFRA]: 'https://lanca.io',
	[OnChainSource.POOL]: 'https://app.concero.io/pool',
	[SocialSource.DISCORD]: 'https://discord.com/channels/1155792755105214535',
	[SocialSource.TWITTER]: 'https://x.com/concero_io',
}

interface ButtonStepStyle {
	size?: 'sm' | 'lg'
	startButton: {
		text: 'Start step' | 'Start quest'
		variant: 'primary' | 'secondaryColor' | 'tetraryColor'
	}
	verifyButton: {
		text: 'Verify step' | 'Verify quest'
		variant: 'tetraryColor' | 'secondaryColor' | 'primary'
	}
}

const buttonsStyle: Record<StepMode, ButtonStepStyle> = {
	group: {
		size: 'sm',
		startButton: {
			text: 'Start step',
			variant: 'secondaryColor',
		},
		verifyButton: {
			text: 'Verify step',
			variant: 'tetraryColor',
		},
	},
	one: {
		size: 'lg',
		startButton: {
			text: 'Start quest',
			variant: 'primary',
		},
		verifyButton: {
			text: 'Verify quest',
			variant: 'secondaryColor',
		},
	},
}

export const QuestStep = ({ step, mode = 'group', user, quest, addCompletedStep, isCompleted, isConnected }: Props) => {
	const currentStatus = isCompleted ? VerificationStatus.SUCCESS : VerificationStatus.NOT_STARTED
	const [userVolume, setUserVolume] = useState<number | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [linkIsVisited, setLinkIsVisited] = useState<boolean>(false)
	const [buttonState, setButtonState] = useState<ButtonStepStyle>(buttonsStyle[mode])
	const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>(currentStatus)

	const isDailyQuest = quest.type === QuestType.Daily
	const isWeeklyQuest = quest.type === QuestType.Primary || quest.type === QuestType.Secondary

	const isCheckVolumeStep = step.questAction === QuestOnChainAction.CheckVolume

	const startQuestLink = step?.options?.link ? step.options.link : defaultStartQuestLinkMap[step.source]
	const isConnectNetwork = step.questAction === QuestSocialAction.ConnectSocialNetwork
	let termsOfUseIsActual = termsIsActual(user ?? undefined)
	useEffect(() => {
		if (linkIsVisited) {
			const newButtonState: ButtonStepStyle = {
				...buttonState,
				startButton: { ...buttonState.startButton, variant: 'tetraryColor' },
				verifyButton: { ...buttonState.verifyButton, variant: 'primary' },
			}

			setButtonState(newButtonState)
		}
	}, [linkIsVisited])

	useEffect(() => {
		if (!isCheckVolumeStep || !isConnected) {
			setLoading(false)
			return
		}
		if (!user || userVolume !== null) return

		let startDate = quest.startDate
		let endDate = quest.endDate

		if (isDailyQuest) {
			const dates = getDayRangeDates()
			startDate = dates.startDate
			endDate = dates.endDate
		} else if (isWeeklyQuest) {
			const dates = getWeekRangeDates()
			startDate = dates.startDate
			endDate = dates.endDate
		}

		setLoading(true)
		fetchUserVolume({
			address: user.address,
			startDate,
			endDate,
			isCrossChain: step.options?.isCrossChain,
		})
			.then(res => {
				setUserVolume(res)
			})
			.catch(error => {
				console.error(error)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [user, isConnected])

	const handleVerifyQuest = async () => {
		if (!user || !step) return

		if (step.category === QuestCategory.Socials && !linkIsVisited && !isConnectNetwork) {
			setVerifyStatus(VerificationStatus.FAILED)
			return
		}

		try {
			setVerifyStatus(VerificationStatus.PENDING)

			const [questRes] = await Promise.all([
				verifyQuest(quest._id, step.id, user._id),
				trackEvent({
					category: category.QuestCard,
					action: action.BeginQuest,
					label: 'concero_verify_quest_begin',
					data: { id: quest._id, step },
				}),
			])

			if (questRes.status) {
				addCompletedStep(+step.id)
				setVerifyStatus(VerificationStatus.SUCCESS)
				await trackEvent({
					category: category.QuestCard,
					action: action.SuccessQuest,
					label: 'concero_verify_quest_success',
					data: { id: quest._id, step },
				})
			} else {
				setVerifyStatus(VerificationStatus.FAILED)
			}
		} catch (error) {
			console.error(error)
			setVerifyStatus(VerificationStatus.FAILED)
			await trackEvent({
				category: category.QuestCard,
				action: action.FailedQuest,
				label: 'concero_verify_quest_fail',
				data: { id: quest._id, step },
			})
		}
	}

	const handleStartQuest = () => {
		if (!startQuestLink || startQuestLink.length === 0) return

		setLinkIsVisited(true)
		window.open(startQuestLink, '_blank')
	}

	const getErrorText = () => {
		if (isConnectNetwork) {
			const network = step.source === SocialSource.TWITTER ? 'Twitter' : 'Discord'
			return `Make sure you have ${network} connected in the top right menu.`
		}

		return 'You haven’t met the requirements for this task. Please complete it and try again.'
	}

	let swapLeft = 0

	if (isCheckVolumeStep && userVolume !== null) {
		swapLeft = Number(step.options?.value) - userVolume < 0 ? 0 : Number(step.options?.value) - userVolume
	}

	const oneStepProgressBar = (
		<div className={classNames.container}>
			<div className="gap-xs">
				{loading || userVolume === null ? (
					<SkeletonLoader height={22} width={200} />
				) : (
					<h4>Left to swap ${!step.options?.value ? 'n/a' : toLocaleNumber(swapLeft, 0)}</h4>
				)}
				<p className="body2">From {toLocaleNumber(Number(step.options!.value), 0)}</p>
			</div>
			<ProgressBar
				isLoading={loading}
				type="float"
				currentValue={Number(userVolume)}
				maxValue={Number(step.options!.value)}
			/>
		</div>
	)

	const actionButtons = user && isConnected && (
		<div className="gap-sm">
			<div className="gap-sm row">
				<Button
					onClick={handleStartQuest}
					size={buttonState.size}
					variant={buttonState.startButton.variant}
					isDisabled={!termsOfUseIsActual}
				>
					{buttonState.startButton.text}
				</Button>
				<Button
					onClick={handleVerifyQuest}
					isLoading={verifyStatus === VerificationStatus.PENDING}
					size={buttonState.size}
					variant={buttonState.verifyButton.variant}
					isDisabled={!termsOfUseIsActual}
				>
					{buttonState.verifyButton.text}
				</Button>
			</div>
			{verifyStatus === VerificationStatus.FAILED && (
				<p className={`${classNames.error} body2`}>{getErrorText()}</p>
			)}
		</div>
	)

	if (!isConnected) {
		return null
	}

	if (loading || (isCheckVolumeStep && userVolume === null)) {
		return oneStepProgressBar
	}

	if (verifyStatus === VerificationStatus.SUCCESS || (swapLeft === 0 && isCheckVolumeStep)) {
		return (
			<>
				<div className={classNames.containerSuccessState}>
					<h4>{step.title}</h4>
					<Tag size="md" variant="positive">
						Done!
					</Tag>
				</div>
				{mode === 'one' && verifyStatus !== VerificationStatus.SUCCESS && actionButtons}
			</>
		)
	}

	if (mode === 'one') {
		return (
			user &&
			isConnected && (
				<>
					{isCheckVolumeStep && oneStepProgressBar}
					{actionButtons}
				</>
			)
		)
	}

	return (
		<div className={classNames.container}>
			<div className="gap-xs">
				<h4>{step.title}</h4>
				<p className="body2">{step.description}</p>
			</div>
			{isCheckVolumeStep && isConnected && (
				<ProgressBar
					type="float"
					currentValue={Number(userVolume)}
					maxValue={Number(step.options!.value)}
					isLoading={loading}
				/>
			)}
			{user && isConnected && actionButtons}
		</div>
	)
}
