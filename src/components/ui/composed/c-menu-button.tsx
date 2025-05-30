import { A } from '../a'
import { Button, ButtonProps } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

export type MenuItemBase = {
	onClick?: () => void
	href?: string
	disabled?: boolean
	className?: string
	variant?: 'default' | 'destructive' | 'primary'
}

type MenuItemLabel = MenuItemBase & {
	label: string
	icon?: React.ReactNode
}

export type MenuItemComponent = MenuItemBase & {
	component: React.ReactNode
}

export type MenuItemSeparator = {
	separator: boolean
}

export type MenuItem = MenuItemLabel | MenuItemComponent | MenuItemSeparator
type MenuIconVariant = 'ellipsis' | 'chevron'

export interface CMenuButtonProps extends ButtonProps {
	icon?: React.ReactNode
	iconVariant?: 'ellipsis' | 'chevron'
	label?: string
	menuItems: Array<MenuItem>
	align?: 'start' | 'center' | 'end'
	isHorizontal?: boolean
	keepShownOnOpen?: boolean
	classNameOverride?: string
}

function getMenuIcon(
	isHorizontal: boolean,
	iconVariant?: MenuIconVariant,
	open?: boolean,
) {
	if (iconVariant === 'chevron')
		return (
			<Icon
				name={open ? 'ChevronUp' : 'ChevronDown'}
				className='w-4 h-4'
			/>
		)
	return isHorizontal ? (
		<Icon name='Ellipsis' />
	) : (
		<Icon name='EllipsisVertical' />
	)
}

const menuItemVariants = {
	destructive:
		'text-destructive focus:text-destructive focus:bg-destructive/10',
	primary: 'text-primary focus:text-primary focus:bg-primary/10',
} as const

type MenuItemVariant = keyof typeof menuItemVariants

function getMenuItemVariant(variant: MenuItemVariant) {
	return menuItemVariants[variant]
}

function MenuItem({ item }: { item: MenuItem }) {
	if ('separator' in item && item.separator) {
		return <DropdownMenuSeparator />
	}
	// Type assertion to narrow down the type
	const menuItem = item as MenuItemLabel

	const classNames = cn(
		menuItem.className,
		menuItem.variant &&
			getMenuItemVariant(menuItem.variant as MenuItemVariant),
	)

	const content = (
		<div className='flex items-center gap-2'>
			{menuItem.icon && (
				<span className='me-2'>
					{typeof menuItem.icon === 'string' ? (
						<Icon name={menuItem.icon} className='w-4 h-4' />
					) : (
						menuItem.icon
					)}
				</span>
			)}
			{menuItem.label}
		</div>
	)

	if (menuItem.href) {
		return (
			<A href={menuItem.href} className={cn('w-full h-full', classNames)}>
				{content}
			</A>
		)
	}
	return (
		<DropdownMenuItem
			onSelect={menuItem.onClick}
			disabled={menuItem.disabled}
			className={classNames}
		>
			{content}
		</DropdownMenuItem>
	)
}

export const CMenuButton: React.FC<CMenuButtonProps> = ({
	icon,
	iconVariant,
	label,
	size,
	variant,
	disabled = false,
	className,
	menuItems,
	align = 'center',
	keepShownOnOpen = false,
	isHorizontal = false,
	...buttonProps
}) => {
	const [open, setOpen] = useState(false)
	if (!menuItems.length) return <div></div>
	const defaultMenuIcon = getMenuIcon(isHorizontal, iconVariant, open)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					size={size || label ? 'default' : 'icon'}
					variant={variant}
					disabled={disabled}
					pressed={open}
					className={cn(
						'gap-2',
						className,
						open && 'bg-accent opacity-100',
						keepShownOnOpen && open && 'block',
					)}
					data-state={open ? 'open' : 'closed'}
					{...buttonProps}
				>
					<span className='sr-only'>Open menu</span>
					{icon || defaultMenuIcon}
					{label}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={align}>
				{menuItems.map((item, index) => {
					return <MenuItem key={index} item={item} />
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
