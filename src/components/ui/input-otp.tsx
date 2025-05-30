'use client'

import { Icon } from './icon'
import { cn } from '@/lib/utils'
import { OTPInput, type SlotProps } from 'input-otp'
import * as React from 'react'

const InputOTP = React.forwardRef<
	React.ElementRef<typeof OTPInput>,
	React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, ...props }, ref) => (
	<OTPInput
		ref={ref}
		dir='ltr'
		containerClassName={cn('flex flex-row items-center gap-2', className)}
		{...props}
	/>
))
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = React.forwardRef<
	React.ElementRef<'div'>,
	React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		dir='ltr'
		className={cn('flex flex-row items-center', className)}
		style={{ direction: 'ltr' }}
		{...props}
	/>
))
InputOTPGroup.displayName = 'InputOTPGroup'

const InputOTPSlot = React.forwardRef<
	React.ElementRef<'div'>,
	SlotProps & React.ComponentPropsWithoutRef<'div'>
>(({ char, hasFakeCaret, isActive, className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				'relative flex h-16 w-16 items-center justify-center border-y border-e border-input text-2xl transition-all first:rounded-l-md first:border-s last:rounded-r-md',
				isActive && 'z-10 ring-1 ring-ring',
				className,
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
					<div className='w-px h-4 duration-1000 animate-caret-blink bg-foreground' />
				</div>
			)}
		</div>
	)
})
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = React.forwardRef<
	React.ElementRef<'div'>,
	React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
	<div ref={ref} {...props}>
		<Icon name='Dot' />
	</div>
))
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
