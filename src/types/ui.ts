// UI component types and interfaces

import { LucideProps } from 'lucide-react'

// Base icon props extending Lucide icon props
export interface IconProps extends Omit<LucideProps, 'name'> {
	className?: string
	size?: number | string
}
