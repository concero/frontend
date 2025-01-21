import { useState } from 'react'
import { Modal } from '../../Modal/Modal'
import VerifyIcon from '../../../../assets/icons/VerifyIcon.svg?react'
import cls from './TermsConditionModal.module.pcss'
import { Checkbox } from '../../../layout/Checkbox/Checkbox'
import { classNames } from '../../../../utils/classNames/classNames'
import { Button } from '../../../buttons/Button/Button'

type TProps = {
	show: boolean
	setShow: (newShow: boolean) => void
	onVerify: () => void
	isVerifyLoading?: boolean
}
export const TermsConditionModal = (props: TProps): JSX.Element => {
	const { setShow, show, onVerify, isVerifyLoading } = props
	const [checked, setChecked] = useState(false)
	return (
		<Modal
			className={cls.modal_block}
			setShow={setShow}
			show={show}
			title={<span className={cls.title}>Verify your wallet</span>}
		>
			<div className={`${cls.icon} ${cls.block}`}>
				<VerifyIcon />
			</div>
			<p className={classNames(cls.block, {}, [cls.description])}>
				Please sign the message to verify that this account belongs to you. Without this verification, you will
				not be able to use the site
			</p>
			<div className={classNames(cls.block, {}, [cls.condition])}>
				<Checkbox onChange={setChecked} />
				<label htmlFor="checkbox" className={cls.condition_description}>
					I have read and agree to the
					<a
						target="_blank"
						rel="noreferrer"
						href="https://www.concero.io/terms-of-use.pdf"
						className={cls.link}
					>
						&nbsp;Terms of Use
					</a>
					&nbsp;and
					<a
						target="_blank"
						rel="noreferrer"
						href="https://www.concero.io/terms-of-use.pdf"
						className={cls.link}
					>
						&nbsp; Privacy Policy&nbsp;
					</a>
					.
				</label>
			</div>
			<Button
				variant="secondary"
				className={cls.block}
				isFull
				isDisabled={!checked}
				onClick={onVerify}
				isLoading={isVerifyLoading}
				size="lg"
			>
				Verify
			</Button>
			{isVerifyLoading && 'Please sign the message'}
		</Modal>
	)
}
