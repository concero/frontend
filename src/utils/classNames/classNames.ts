export type Mods = Record<string, boolean | string | undefined>
/**
 *
 * @example
 * import classNames from 'src/utils/classNames/classNames'
 * import cls from './xxx.module.pcss'
 * <div className={
 *    classNames(cls.defaultClass, { [cls.conditionClass]: true }, [additionalClasses] )
 * }>Text</div>
 */
export function classNames(cls: string, mods: Mods = {}, additional: Array<string | undefined> = []): string {
	return [
		cls,
		...additional.filter(Boolean),
		...Object.entries(mods)
			.filter(([_, value]) => Boolean(value))
			.map(([className]) => className),
	].join(' ')
}
