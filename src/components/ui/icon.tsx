import { DiscordLogo } from '@/components/ui/icons/discord-logo'
import { FilledStarIcon } from '@/components/ui/icons/filled-star-icon'
import { GoogleSSOLogo } from '@/components/ui/icons/google-sso-icon'
import { Heart } from '@/components/ui/icons/heart'
import { LoadingCircle } from '@/components/ui/icons/loading-circle'
import { StarIcon } from '@/components/ui/icons/star-icon'
import { type AvailableIconName } from '@/components/ui/lucide-icons-db'
import { LucideIcon, icons as lucideIcons } from 'lucide-react'
import React from 'react'
import { MaximizeIcon } from './icons/maximize-icon'
import { RestoreIcon } from './icons/restore-icon'

const icons: Record<string, LucideIcon> = lucideIcons

const lucideIconsFromAIMap = {
	CheckSquare: 'CircleCheckBig',
	CheckCircle2: 'CircleCheckBig',
	CheckCircle: 'CircleCheckBig',
	StopCircle: 'CircleStop',
	AlertTriangle: 'TriangleAlert',
	Edit: 'Pencil',
	Tool: 'Construction',
	Loader2: 'Loader',
}

// Map custom icon names to their components
const customIcons: Record<any, any> = {
	LoadingCircle,
	DiscordLogo,
	FilledStarIcon,
	GoogleSSOLogo,
	Heart,
	StarIcon,
	RestoreIcon,
	MaximizeIcon,
}

// Export the type using our database
export type IconName = AvailableIconName

export interface IconProps {
	name: IconName
	className?: string
	size?: number | string
	[key: string]: unknown
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 16, ...props }) => {
	const LucideIconComponent = icons[name]
	if (LucideIconComponent) {
		return <LucideIconComponent className={className} size={size} {...props} />
	}

	const LucideIconNameFromAI = lucideIconsFromAIMap[name as keyof typeof lucideIconsFromAIMap]
	if (LucideIconNameFromAI) {
		const LucideIconComponentFromAI = icons[LucideIconNameFromAI]
		return <LucideIconComponentFromAI className={className} size={size} {...props} />
	}

	const CustomIconComponent = customIcons[name as keyof typeof customIcons]
	if (CustomIconComponent) {
		return <CustomIconComponent className={className} size={size} {...props} />
	}

	console.warn(`Icon "${name}" not found`)
	return null
}
