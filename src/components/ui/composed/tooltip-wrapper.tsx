import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TooltipPortal } from '@radix-ui/react-tooltip'

type TooltipWrapperBaseProps = {
	children: React.ReactNode
	asChild?: boolean
	className?: string
}

type TooltipWithString = {
	tooltip: string
	maxContentLength?: number
}
type TooltipWithReactNode = {
	tooltip: React.ReactNode
}

type TooltipWrapperPropsWithTooltip = TooltipWrapperBaseProps &
	(TooltipWithString | TooltipWithReactNode) & {
		tooltipContentClassName?: string
		hideTooltip?: boolean
	}
type TooltipWrapperPropsWithoutTooltip = TooltipWrapperBaseProps & {
	tooltip: undefined
}

type TooltipWrapperProps =
	| TooltipWrapperPropsWithTooltip
	| TooltipWrapperPropsWithoutTooltip

export function TooltipWrapper({
	children,
	tooltip,
	asChild = true,
	className,
	...props
}: TooltipWrapperProps) {
	if (typeof tooltip === 'string') {
		const maxContentLength =
			'maxContentLength' in props
				? (props.maxContentLength as number)
				: 500
		if (tooltip.length > maxContentLength) {
			tooltip = tooltip.slice(0, maxContentLength) + '...'
		}
	}
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
				<TooltipPortal>
					<TooltipContent
						className={cn(
							'max-w-xl',
							(('hideTooltip' in props && props.hideTooltip) ||
								!tooltip) &&
								'hidden',
							className,
						)}
					>
						<pre>{tooltip}</pre>
					</TooltipContent>
				</TooltipPortal>
			</Tooltip>
		</TooltipProvider>
	)
}
