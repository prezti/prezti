import { cn } from '@/lib/utils'
import React from 'react'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	className?: string
}

export function Container({ children, className, ...props }: ContainerProps) {
	return (
		<div
			className={cn(
				'px-4 mx-auto w-full max-w-7xl sm:px-6 lg:px-8',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	)
}
