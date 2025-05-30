import { cn } from '@/lib/utils'
import * as React from 'react'

const Table = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div className='relative w-full'>
		<div
			ref={ref}
			role='table'
			className={cn('w-full text-sm caption-bottom', className)}
			{...props}
		/>
	</div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} role='rowgroup' className={cn('', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role='rowgroup'
		className={cn('[&_div[role=row]:last-child]:border-0', className)}
		{...props}
	/>
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role='rowgroup'
		className={cn(
			'bg-muted/50 font-medium [&>div[role=row]]:last:border-b-0',
			className,
		)}
		{...props}
	/>
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		dataIndex?: number
	}
>(({ className, dataIndex, ...props }, ref) => {
	return (
		<div
			ref={ref}
			role='row'
			data-index={dataIndex}
			className={cn(
				'transition-colors group/table-row hover:bg-muted-subtle data-[state=selected]:bg-muted-subtle',
				className,
			)}
			{...props}
		/>
	)
})
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role='columnheader'
		className={cn(
			'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-4',
			className,
		)}
		{...props}
	/>
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role='cell'
		className={cn(
			'flex min-h-8 items-center justify-center p-2 align-middle [&:has([role=checkbox])]:pe-4',
			className,
		)}
		{...props}
	/>
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role='caption'
		aria-label='Table caption'
		className={cn('mt-4 text-sm text-muted-foreground', className)}
		{...props}
	/>
))
TableCaption.displayName = 'TableCaption'

export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
}
