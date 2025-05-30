'use client'

import { ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut } from '@/components/ui/context-menu'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import * as React from 'react'

interface MenuItemProps {
	icon?: LucideIcon
	label: string
	shortcut?: string
	onClick: () => void
	disabled?: boolean
	variant?: 'default' | 'destructive'
	className?: string
}

export function MenuItem({
	icon: Icon,
	label,
	shortcut,
	onClick,
	disabled = false,
	variant = 'default',
	className,
}: MenuItemProps) {
	return (
		<ContextMenuItem
			className={cn('flex items-center gap-2', className)}
			onClick={(e) => {
				e.preventDefault()
				e.stopPropagation()
				if (!disabled) {
					onClick()
				}
			}}
			disabled={disabled}
			variant={variant}>
			{Icon && <Icon className="h-4 w-4" />}
			<span className="flex-1">{label}</span>
			{shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
		</ContextMenuItem>
	)
}

export function MenuSeparator() {
	return <ContextMenuSeparator />
}

interface MenuGroupProps {
	children: React.ReactNode
	label?: string
}

export function MenuGroup({ children, label }: MenuGroupProps) {
	return (
		<div>
			{label && <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">{label}</div>}
			{children}
		</div>
	)
}
