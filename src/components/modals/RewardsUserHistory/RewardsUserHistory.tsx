import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { Modal } from '../Modal/Modal'
import classNames from './RewardsUserHistory.module.pcss'
import { UserAction } from './UserAction'
import { type IUserAction } from '../../../api/concero/userActions/userActionType'
import { fetchUserActions } from '../../../api/concero/userActions/fetchUserActions'
import { type IUser } from '../../../api/concero/user/userType'
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { Loader } from '../../layout/Loader/Loader'
import { useTranslation } from 'react-i18next'
import { Button } from '../../buttons/Button/Button'

interface UserHistoryProps {
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
	user: IUser
}

export const UserHistory = ({ isOpen, setIsOpen, user }: UserHistoryProps) => {
	const { t } = useTranslation()
	const limit = 6
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: ['userActions', user.address],
		queryFn: ({ pageParam = 0 }) => fetchUserActions(user.address, { limit, page: pageParam }),
		initialPageParam: 0,
		getNextPageParam: (lastPage, _, lastPageParam) => (lastPage.length === limit ? ++lastPageParam : undefined),
	})

	return (
		<Modal show={isOpen} setShow={setIsOpen} title="History" className={classNames.historyModal}>
			<div className={classNames.historyWrapper}>
				{!user && <h4>Connect wallet to see your history</h4>}
				{status === 'pending' && (
					<div className={classNames.loaderWrap}>
						<Loader />
					</div>
				)}
				{status === 'error' && <p>{t('utils.couldNotLoadData')}</p>}

				{data?.pages.map((page, pageIndex) => (
					<React.Fragment key={pageIndex}>
						{page.map((action: IUserAction) => (
							<UserAction key={action.timestamp} action={action} />
						))}
					</React.Fragment>
				))}
				<div className={classNames.loadNextWrap}>
					<Button
						variant="secondary"
						onClick={() => fetchNextPage()}
						isDisabled={!hasNextPage || isFetchingNextPage}
					>
						{isFetchingNextPage ? t('utils.loading') : hasNextPage ? t('utils.loadMoreData') : null}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
