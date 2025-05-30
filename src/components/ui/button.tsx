import { TooltipWrapper } from '@/components/ui/composed/tooltip-wrapper'
import { LoadingCircle } from '@/components/ui/icons/loading-circle'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
	'inline-flex items-center gap-1 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 hover:border-border/80',
				ghost: 'hover:bg-accent hover:text-primary',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4',
				xs: 'h-4 px-2 rounded-sm text-xs',
				sm: 'h-9 rounded-md px-3',
				lg: 'gap-2 h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	pressed?: boolean
	isLoading?: boolean
	isIcon?: boolean
	disabled?: boolean
	tooltip?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			isIcon,
			isLoading = false,
			pressed = false,
			asChild = false,
			disabled = false,
			children,
			tooltip,
			...props
		},
		ref
	) => {
		size = size ? size : isIcon ? 'sm' : 'default'
		const finalClassName = cn(buttonVariants({ variant, size, className }), isIcon && 'w-8 h-8 p-0')
		const Comp = asChild ? Slot : 'button'
		const content = (
			<Comp
				className={finalClassName}
				data-pressed={pressed}
				ref={ref}
				disabled={disabled || isLoading}
				{...props}>
				<>
					{children}
					{isLoading && <LoadingCircle className="ms-2" />}
				</>
			</Comp>
		)
		if (!tooltip) return content
		return <TooltipWrapper tooltip={tooltip}>{content}</TooltipWrapper>
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
