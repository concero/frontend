import { type FC, useState, type MouseEvent, HTMLProps, ReactNode, useId, MouseEventHandler } from 'react'
import cls from './Checkbox.module.pcss'
import { classNames } from '../../../utils/classNames/classNames'

type TProps = Omit<HTMLProps<HTMLDivElement>, 'onChange' | 'disabled' | 'className'> & {
	isChecked?: boolean
	onChange?: (isChecked: boolean) => void
	className?: string
	disabled?: boolean
	label?: string | number
	id?: string | number
}

export const Checkbox = (props: TProps) => {
	const { className, disabled, isChecked, onChange, id, label, ...otherProps } = props
	const [internalChecked, setInternalChecked] = useState(isChecked ?? false)
	const checkboxGeneratedId = useId()
	const checkboxId = id ?? checkboxGeneratedId

	const handleClick = (event: MouseEvent) => {
		if (disabled) return
		const nextChecked = isChecked ?? !internalChecked
		setInternalChecked(!internalChecked)
		onChange?.(nextChecked)
	}

	return (
		<div className={classNames(cls.wrap_with_label)}>
			<div
				className={classNames(
					cls.checkbox,
					{
						[cls.checked]: isChecked ?? internalChecked,
						[cls.disabled]: disabled,
					},
					[className],
				)}
				aria-disabled={disabled}
				onClick={handleClick}
				tabIndex={0}
				role="checkbox"
				aria-checked={isChecked ?? internalChecked}
				id={checkboxId}
				{...otherProps}
			>
				<div className={cls.inner}></div>
			</div>
			{label ? (
				<label
					onClick={handleClick}
					htmlFor={checkboxId}
					className={classNames(cls.label, { [cls.label_disabled]: disabled }, [])}
				>
					{label}
				</label>
			) : null}
		</div>
	)
}
