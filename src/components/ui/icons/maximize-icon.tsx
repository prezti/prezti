import { IconProps } from '@/types/ui'
import React from 'react'

export const MaximizeIcon: React.FC<IconProps> = ({
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
		<rect x='5' y='5' width='14' height='14' rx='2' />
	</svg>
)
