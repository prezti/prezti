'use client'

import { Icon } from './icon'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type VariantProps } from 'class-variance-authority'
import { useEffect, useState } from 'react'

const directionIconNames = {
	up: 'ChevronUp',
	down: 'ChevronDown',
	left: 'ChevronLeft',
	right: 'ChevronRight',
}

export type ScrollButtonProps = {
	scrollRef: React.RefObject<HTMLElement | null>
	containerRef: React.RefObject<HTMLElement | null>
	className?: string
	threshold?: number
	variant?: VariantProps<typeof buttonVariants>['variant']
	size?: VariantProps<typeof buttonVariants>['size']
	direction?: 'up' | 'down' | 'left' | 'right'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function ScrollButton({
	scrollRef,
	containerRef,
	className,
	threshold = 100,
	variant = 'outline',
	size = 'sm',
	direction = 'down',
	...props
}: ScrollButtonProps) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				const {
					scrollTop,
					scrollLeft,
					scrollHeight,
					scrollWidth,
					clientHeight,
					clientWidth,
				} = containerRef.current

				switch (direction) {
					case 'down':
						setIsVisible(
							scrollTop + clientHeight < scrollHeight - threshold,
						)
						break
					case 'up':
						setIsVisible(scrollTop > threshold)
						break
					case 'right':
						setIsVisible(
							scrollLeft + clientWidth < scrollWidth - threshold,
						)
						break
					case 'left':
						setIsVisible(scrollLeft > threshold)
						break
				}
			}
		}

		const container = containerRef.current

		if (container) {
			container.addEventListener('scroll', handleScroll)
			handleScroll()
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll)
			}
		}
	}, [containerRef, threshold, direction])

	const handleScroll = () => {
		if (containerRef.current) {
			const { scrollHeight, scrollWidth, clientHeight, clientWidth } =
				containerRef.current

			switch (direction) {
				case 'down':
					containerRef.current.scrollTo({
						top: scrollHeight - clientHeight,
						behavior: 'smooth',
					})
					break
				case 'up':
					containerRef.current.scrollTo({
						top: 0,
						behavior: 'smooth',
					})
					break
				case 'right':
					containerRef.current.scrollTo({
						left: scrollWidth - clientWidth,
						behavior: 'smooth',
					})
					break
				case 'left':
					containerRef.current.scrollTo({
						left: 0,
						behavior: 'smooth',
					})
					break
			}
		}
	}

	const getTransformClass = () => {
		switch (direction) {
			case 'down':
				return 'translate-y-4'
			case 'up':
				return '-translate-y-4'
			case 'right':
				return 'translate-x-4'
			case 'left':
				return '-translate-x-4'
		}
	}

	return (
		<Button
			variant={variant}
			size={size}
			className={cn(
				'p-0 w-8 h-8 rounded-full transition-all duration-150 ease-out',
				isVisible
					? 'opacity-100 scale-100 translate-x-0 translate-y-0'
					: `opacity-0 scale-95 pointer-events-none ${getTransformClass()}`,
				className,
			)}
			onClick={handleScroll}
			{...props}
		>
			<Icon name={directionIconNames[direction]} className='w-4 h-4' />
		</Button>
	)
}

export { ScrollButton }
