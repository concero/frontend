import { type FC, type MouseEvent, PropsWithChildren, type ReactNode, useEffect } from 'react'
import { animated, useSpring, useTransition } from '@react-spring/web'
import classNames from './Modal.module.pcss'
import { ModalHeader } from './ModalHeader'

export type ModalProps = PropsWithChildren<{
	title?: ReactNode | string
	show: boolean
	setShow: (show: boolean) => void
	className?: string
	isHeaderVisible?: boolean
	position?: 'top' | 'bottom' | 'center'
}>

const positionClassMap = {
	top: 'jfs',
	bottom: 'jfe',
	center: 'jc',
}

export const Modal: FC<ModalProps> = ({
	title = '',
	position = 'center',
	show,
	setShow,
	children,
	className,
	isHeaderVisible = true,
}) => {
	const stopPropagation = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		event.stopPropagation()
	}

	const handleKeyDown = (event: globalThis.KeyboardEvent) => {
		if (event.key === 'Escape') {
			setShow(false)
		}
	}

	useEffect(() => {
		if (show) {
			document.body.style.overflowY = 'hidden'
			document.addEventListener('keydown', handleKeyDown)
		} else {
			document.body.style.removeProperty('overflow-y')
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [show])

	const fadeAnimation = useSpring({
		opacity: show ? 1 : 0,
		pointerEvents: show ? ('auto' as const) : ('none' as const),
	})

	const transitions = useTransition(show, {
		from: { transform: 'translateY(20px)', opacity: 0 },
		enter: { transform: 'translateY(0)', opacity: 1 },
		leave: { transform: 'translateY(20px)', opacity: 0 },
	})

	return (
		fadeAnimation.opacity.to(o => o > 0) && (
			<animated.div
				style={fadeAnimation}
				className={`${classNames.overlay} ${positionClassMap[position]}`}
				onClick={() => {
					setShow(false)
				}}
			>
				{transitions((style, item) =>
					item ? (
						<animated.div
							style={style}
							className={`${classNames.container} ${className}`}
							onClick={stopPropagation}
						>
							{isHeaderVisible ? (
								<ModalHeader
									title={title}
									onClick={() => {
										setShow(false)
									}}
								/>
							) : null}
							{children}
						</animated.div>
					) : null,
				)}
			</animated.div>
		)
	)
}
