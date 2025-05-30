'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ToolbarOption } from '../toolbar-options'

interface ToolbarButtonGroupProps {
	options: ToolbarOption[]
	onAction: (action: string, option: ToolbarOption) => void
	activeStates?: Record<string, boolean>
	disabled?: boolean
}

export function ToolbarButtonGroup({
	options,
	onAction,
	activeStates = {},
	disabled = false,
}: ToolbarButtonGroupProps) {
	return (
		<div className="flex items-center gap-1 px-2">
			{options.map((option) => {
				const IconComponent = option.icon
				const isActive = activeStates[option.id] || false
				const variant = isActive ? 'default' : option.variant || 'ghost'

				return (
					<TooltipProvider key={option.id}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={variant}
									size="icon"
									disabled={disabled}
									onClick={() => onAction(option.action, option)}>
									<IconComponent className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>{option.tooltip}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)
			})}
		</div>
	)
}
