'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { LoadingCircle } from '@/components/ui/icons/loading-circle'
import { cn } from '@/lib/utils'
import { type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface AProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof buttonVariants> {
	href?: string
	children: React.ReactNode
	className?: string
	external?: boolean
	disabled?: boolean
	prefetch?: boolean
	unstyled?: boolean
	isLoading?: boolean
}

const A: React.FC<AProps> = ({
	href,
	variant,
	size,
	children,
	className,
	disabled,
	prefetch = false,
	unstyled = false,
	external = false,
	isLoading,
	...props
}) => {
	const pathname = usePathname()

	// `startsWith` here to handle nested routes
	const isActive = href === '/' ? pathname === href : pathname?.startsWith(href ? href : '')
	const baseStyle = unstyled
		? ''
		: variant
		? buttonVariants({ variant, size })
		: 'h-fit text-sm text-primary hover:text-primary/75'

	const isActiveClasses = href && isActive && !unstyled ? 'text-secondary' : ''

	// Ensure children is wrapped in a single container if needed
	const wrappedChildren = React.Children.count(children) > 1 ? <>{children}</> : children

	if (disabled) {
		return (
			<span className={cn(baseStyle, 'cursor-not-allowed text-disabled hover:text-disabled', className)}>
				{wrappedChildren}
			</span>
		)
	}

	if (!href) {
		return (
			<Button
				variant={variant}
				className={cn(baseStyle, className)}
				disabled={disabled}
				size={size}
				isLoading={isLoading}
				onClick={(e) => {
					if (isLoading) {
						e.preventDefault()
						return
					}
					props.onClick?.(e as any)
				}}>
				{wrappedChildren}
			</Button>
		)
	}

	return (
		<Link
			href={href as any}
			prefetch={prefetch}
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				baseStyle,
				!variant && isActiveClasses,
				className,
				isLoading || disabled ? 'pointer-events-none opacity-50' : ''
			)}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			{...props}>
			{wrappedChildren}
			{isLoading && <LoadingCircle />}
		</Link>
	)
}

export { A }
