import { A } from '@/components/ui/a'
import { LogoImage } from '@/components/ui/logo-image'
import { LogoText } from '@/components/ui/logo-text'
import { APP_CONFIG } from '@/constants/app.c'
import { Routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

type LogoProps = {
	collapsed?: boolean
	className?: string
	imageClassName?: string
	textClassName?: string
	isLink?: boolean
	hideImage?: boolean
	logoImage?: boolean
}

export function CLogo({
	collapsed,
	className,
	imageClassName,
	textClassName,
	isLink,
	hideImage,
	logoImage = false,
}: LogoProps) {
	const shouldShowFullText = hideImage || className?.includes('flex-col')
	const classBase = 'flex justify-center' + (shouldShowFullText ? ' gap-2' : ' gap-0')
	const classAddition = collapsed ? 'items-end' : 'items-end'
	const defaultClassName = cn(classBase, classAddition)
	const content = (
		<div className={cn('flex items-center', className)} style={{ direction: 'ltr' }}>
			{!hideImage && (
				<div className="w-30px">
					<LogoImage className={cn('w-full', className, imageClassName)} />
				</div>
			)}
			{!collapsed && (
				<div className={cn(className, textClassName)}>
					<LogoText
						text={shouldShowFullText ? APP_CONFIG.appName : APP_CONFIG.appName.slice(1)}
						className={cn(
							'w-full h-[29px]',
							className,
							textClassName,
							shouldShowFullText ? '' : '-ms-1'
						)}
					/>
				</div>
			)}
		</div>
	)

	return isLink ? (
		<A className={cn(defaultClassName, className)} href={Routes.home()}>
			{content}
		</A>
	) : (
		<div className={cn(defaultClassName, className)}>{content}</div>
	)
}
