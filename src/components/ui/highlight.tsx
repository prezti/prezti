import { cn } from '@/lib/utils'

export function Highlight({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<span
			className={cn(
				'font-medium text-primary p-1 py-0.5 bg-primary/10 rounded-sm',
				className,
			)}
		>
			{children}
		</span>
	)
}
