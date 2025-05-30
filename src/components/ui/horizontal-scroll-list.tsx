'use client'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A reusable horizontal scrolling container with arrow navigation and keyboard support
 *
 * @example
 * ```tsx
 * <HorizontalScrollList
 *   className="my-custom-wrapper"
 *   scrollAmount={200}
 *   ariaLabel="Navigation items"
 * >
 *   <Button>Item 1</Button>
 *   <Button>Item 2</Button>
 *   <Button>Item 3</Button>
 * </HorizontalScrollList>
 * ```
 */
interface HorizontalScrollListProps {
	/** The content to be scrolled horizontally */
	children: React.ReactNode
	/** Additional CSS classes for the wrapper container */
	className?: string
	/** Additional CSS classes for the scrollable container */
	containerClassName?: string
	/** Additional CSS classes for the items wrapper */
	itemsWrapperClassName?: string
	/** Number of pixels to scroll when using arrow buttons (default: 150) */
	scrollAmount?: number
	/** Whether to show gradient fade effects (default: true) */
	showGradients?: boolean
	/** Size of the arrow icons in pixels (default: 14) */
	arrowSize?: number
	/** Additional CSS classes for the arrow buttons */
	arrowClassName?: string
	/** CSS classes for gradient width (default: 'w-10') */
	gradientWidth?: string
	/** Callback function triggered on scroll */
	onScroll?: () => void
	/** Whether to enable keyboard navigation with arrow keys (default: true) */
	enableKeyboardNavigation?: boolean
	/** ARIA role for the container (default: 'list') */
	role?: string
	/** ARIA label for accessibility (default: 'Scrollable list') */
	ariaLabel?: string
}

export function HorizontalScrollList({
	children,
	className,
	containerClassName,
	itemsWrapperClassName,
	scrollAmount = 150,
	showGradients = true,
	arrowSize = 14,
	arrowClassName,
	gradientWidth = 'w-10',
	onScroll,
	enableKeyboardNavigation = true,
	role = 'list',
	ariaLabel = 'Scrollable list',
}: HorizontalScrollListProps) {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [showLeftArrow, setShowLeftArrow] = useState(false)
	const [showRightArrow, setShowRightArrow] = useState(true)

	// Update scroll arrows based on scroll position
	const updateScrollArrows = useCallback(() => {
		const container = scrollRef.current
		if (container) {
			const { scrollLeft, scrollWidth, clientWidth } = container
			setShowLeftArrow(scrollLeft > 0)
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
		}
	}, [])

	// Initialize scroll arrows
	useEffect(() => {
		updateScrollArrows()
		// Add resize listener to update arrows when container size changes
		const handleResize = () => updateScrollArrows()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [updateScrollArrows])

	// Update scroll arrows when content changes
	useEffect(() => {
		// Small delay to ensure DOM is updated
		const timer = setTimeout(updateScrollArrows, 10)
		return () => clearTimeout(timer)
	}, [updateScrollArrows, children])

	// Scroll container
	const scrollItems = useCallback(
		(direction: 'left' | 'right') => {
			const container = scrollRef.current
			if (container) {
				const targetScroll =
					container.scrollLeft +
					(direction === 'left' ? -scrollAmount : scrollAmount)
				container.scrollTo({
					left: targetScroll,
					behavior: 'smooth',
				})
			}
		},
		[scrollAmount],
	)

	// Handle scroll events
	const handleScroll = useCallback(() => {
		updateScrollArrows()
		onScroll?.()
	}, [updateScrollArrows, onScroll])

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!enableKeyboardNavigation) return

			if (e.key === 'ArrowLeft') {
				e.preventDefault()
				scrollItems('left')
			} else if (e.key === 'ArrowRight') {
				e.preventDefault()
				scrollItems('right')
			}
		},
		[scrollItems, enableKeyboardNavigation],
	)

	return (
		<div className={cn('relative', className)}>
			{/* Left scroll arrow */}
			{showLeftArrow && (
				<Button
					variant='ghost'
					size='sm'
					className={cn(
						'absolute left-1 top-1/2 -translate-y-1/2 z-20 h-7 w-7 p-0 rounded-full shadow-sm bg-background/95 border border-border/50 hover:bg-accent transition-all duration-200 backdrop-blur-sm',
						arrowClassName,
					)}
					onClick={() => scrollItems('left')}
					aria-label='Scroll left'
				>
					<Icon name='ChevronLeft' size={arrowSize} />
				</Button>
			)}

			{/* Right scroll arrow */}
			{showRightArrow && (
				<Button
					variant='ghost'
					size='sm'
					className={cn(
						'absolute right-1 top-1/2 -translate-y-1/2 z-20 h-7 w-7 p-0 rounded-full shadow-sm bg-background/95 border border-border/50 hover:bg-accent transition-all duration-200 backdrop-blur-sm',
						arrowClassName,
					)}
					onClick={() => scrollItems('right')}
					aria-label='Scroll right'
				>
					<Icon name='ChevronRight' size={arrowSize} />
				</Button>
			)}

			{/* Left gradient fade */}
			{showGradients && showLeftArrow && (
				<div
					className={cn(
						'absolute left-0 top-0 bottom-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none',
						gradientWidth,
					)}
				/>
			)}

			{/* Right gradient fade */}
			{showGradients && showRightArrow && (
				<div
					className={cn(
						'absolute right-0 top-0 bottom-0 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none',
						gradientWidth,
					)}
				/>
			)}

			{/* Scrollable container */}
			<div
				ref={scrollRef}
				className={cn(
					'overflow-x-auto overflow-y-hidden scrollbar-hide px-2 focus:outline-none',
					containerClassName,
				)}
				style={{
					paddingLeft: showLeftArrow ? '36px' : '8px',
					paddingRight: showRightArrow ? '36px' : '8px',
				}}
				onScroll={handleScroll}
				onKeyDown={handleKeyDown}
				tabIndex={enableKeyboardNavigation ? 0 : -1}
				role={role}
				aria-label={ariaLabel}
			>
				<div
					className={cn(
						'flex py-2 gap-1 w-max',
						itemsWrapperClassName,
					)}
				>
					{children}
				</div>
			</div>
		</div>
	)
}
