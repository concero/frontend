import { useState } from 'react'
import { Modal } from '../../Modal/Modal'
import WarningBoxIcon from '../../../../assets/icons/WarningBox.svg?react'
import cls from './TermsConditionErrorModal.module.pcss'
import { classNames } from '../../../../utils/classNames/classNames'
import { Button } from '../../../buttons/Button/Button'

type TProps = {
	show: boolean
	setShow: (newShow: boolean) => void
	onTryAgain: () => void
}
export const TermsConditionErrorModal = (props: TProps): JSX.Element => {
	const { setShow, show, onTryAgain } = props
	return (
		<Modal
			className={cls.modal_block}
			setShow={setShow}
			show={show}
			title={<span className={cls.title}>Verification failed</span>}
		>
			<div className={`${cls.icon} ${cls.block}`}>
				<WarningBoxIcon />
			</div>
			<p className={classNames(cls.block, {}, [cls.description])}>Something went wrong, try again</p>
			<div className={classNames(cls.block, {}, [cls.condition])}></div>
			<Button variant="primary" className={cls.block} isFull onClick={onTryAgain} size="lg">
				Try again
			</Button>
		</Modal>
	)
}
