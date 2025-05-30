import { cn } from '@/lib/utils'
import React from 'react'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode
	className?: string
}

export function Section({ children, className, ...props }: SectionProps) {
	return (
		<section
			className={cn('py-12 w-full md:py-16 lg:py-20', className)}
			{...props}
		>
			{children}
		</section>
	)
}
