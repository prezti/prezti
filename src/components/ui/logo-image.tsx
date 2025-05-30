import { APP_CONFIG } from '@/constants/app.c'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type LogoImageProps = {
	className?: string
}

const sizeMap = {
	'text-2xl': 24,
	'text-3xl': 30,
	'text-4xl': 36,
	'text-5xl': 48,
	'text-6xl': 60,
	'text-7xl': 72,
	'text-8xl': 84,
	'text-9xl': 96,
}

function findSizeBasedOnTextSize(className: string) {
	return sizeMap[className as keyof typeof sizeMap] || 60
}

export function LogoImage({ className }: LogoImageProps) {
	const textSizeRegex = /text-(2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/i
	const sizeClass = className?.match(textSizeRegex)?.[0]
	const shouldShowLargeImage = !!sizeClass
	const size = shouldShowLargeImage ? findSizeBasedOnTextSize(sizeClass) * 1.15 + 10 : 30
	return (
		<Image
			src={'/assets/logo.png'}
			alt={`${APP_CONFIG.appName} Logo Image`}
			className={cn(className, 'rounded-full')}
			width={size}
			height={size}
			priority
		/>
	)
}
