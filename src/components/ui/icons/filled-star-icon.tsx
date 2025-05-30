import { IconProps } from '@/types/ui'
import React from 'react'

export const FilledStarIcon: React.FC<IconProps> = ({
	className,
	size,
	width,
	height,
	...props
}) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width={size || width || '1.5em'}
		height={size || height || '1.5em'}
		className={className}
		{...props}
	>
		<path
			fill='currentColor'
			d='m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z'
		/>
	</svg>
)
