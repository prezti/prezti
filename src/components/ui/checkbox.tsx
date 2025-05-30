import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
		indeterminate?: boolean
	}
>(({ className, indeterminate, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer h-4 w-4 shrink-0 rounded-[0.35em] border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
			className,
		)}
		{...props}
	>
		{indeterminate && (
			<div className='flex justify-center items-center w-full h-full text-current'>
				<Icon name='Check' className='w-4 h-4' />
			</div>
		)}
		<CheckboxPrimitive.Indicator
			className={cn('flex justify-center items-center text-current')}
		>
			<Icon name='Check' className='w-4 h-4' />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
