import classNames from './Modal.module.pcss'
import { LoadingAnimation } from '../../layout/LoadingAnimation/LoadingAnimation'
import { IconButton } from '../../buttons/IconButton/IconButton'
import { ChestIcon } from '../../../assets/icons/ChestIcon'
import { ReactNode } from 'react'

interface ModalHeaderProps {
	title: ReactNode | string
	isLoading?: boolean
	onClick: () => void
}

export function ModalHeader({ title, isLoading = false, onClick }: ModalHeaderProps) {
	return (
		<div className={classNames.header}>
			{title}
			{isLoading ? <LoadingAnimation size={16} color={'var(--color-grey-600)'} /> : null}
			<IconButton onClick={onClick} variant="secondary" size="md">
				<ChestIcon />
			</IconButton>
		</div>
	)
}
