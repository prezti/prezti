import { IconProps } from '@/types/ui'
import React from 'react'

export const RestoreIcon: React.FC<IconProps> = ({
	className,
	size,
	width,
	height,
	...props
}) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size || width || '2em'}
		height={size || height || '2em'}
		className={className}
		fill='none'
		stroke='currentColor'
		strokeWidth='1.5'
		strokeLinecap='round'
		strokeLinejoin='round'
		{...props}
	>
		{/* Back square (top-right) */}
		<rect x='8' y='4' width='10' height='10' rx='2' />
		{/* Front square (bottom-left) */}
		<rect x='4' y='8' width='10' height='10' rx='2' />
	</svg>
)
