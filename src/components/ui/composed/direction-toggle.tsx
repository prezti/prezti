import { TooltipWrapper } from './tooltip-wrapper'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useDirection } from '@/hooks/use-direction'
import { useDirectionStore } from '@/stores/direction.store'

export function DirectionToggle() {
	const { toggleDirection } = useDirectionStore()
	const { isRTL } = useDirection()
	const dirText = isRTL ? 'Left to Right' : 'Right to Left'
	const textToDisplay = `Switch to ${dirText} orientation`

	return (
		<TooltipWrapper tooltip={textToDisplay}>
			<Button
				variant='ghost'
				size='icon'
				onClick={toggleDirection}
				className='relative px-0 w-4 h-4 text-muted-foreground hover:bg-transparent'
			>
				<Icon
					name={isRTL ? 'PilcrowRight' : 'PilcrowLeft'}
					className='w-4 h-4'
				/>
				<span className='sr-only'>{textToDisplay}</span>
			</Button>
		</TooltipWrapper>
	)
}
