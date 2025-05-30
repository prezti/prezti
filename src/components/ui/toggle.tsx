import { Badge } from './badge'
import { cn } from '@/lib/utils'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const toggleVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'border border-foreground/20 data-[state=on]:border-primary bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90',
				outline:
					'border border-foreground/20 data-[state=on]:border-foreground/40 bg-transparent hover:bg-background/90 hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent data-[state=on]:hover:text-accent-foreground',
				secondary:
					'bg-secondary border border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-secondary/90 data-[state=on]:border-secondary-foreground/40 data-[state=on]:hover:bg-secondary/90',
				ghost: 'hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:hover:bg-accent/90',
			},
			size: {
				xs: 'h-8 rounded-md px-2 text-xs',
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

const Toggle = React.forwardRef<
	React.ElementRef<typeof TogglePrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
		VariantProps<typeof toggleVariants> & {
			showIndicator?: boolean
		}
>(({ className, variant, size, showIndicator, ...props }, ref) => (
	<div className='relative'>
		<TogglePrimitive.Root
			ref={ref}
			className={toggleVariants({ variant, size, className })}
			{...props}
		/>
		{showIndicator && (
			<Badge
				variant={'secondary'}
				data-state={props.pressed ? 'on' : 'off'}
				className={cn(
					'absolute top-1 right-2 text-xs w-[6px] h-[6px] p-0',
					// based on the state of the toggle, the badge will be either green or transparent
					'data-[state=on]:bg-green-500 data-[state=off]:bg-transparent',
				)}
			/>
		)}
	</div>
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
