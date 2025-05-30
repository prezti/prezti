import { cn } from '@/lib/utils'

interface SectionHeaderProps {
	children: React.ReactNode
	className?: string
	centered?: boolean
}

export function SectionHeader({
	children,
	className,
	centered = true,
}: SectionHeaderProps) {
	return (
		<div
			className={cn(
				'mb-10 space-y-4 w-full',
				centered && 'text-center',
				className,
			)}
		>
			{children}
		</div>
	)
}
