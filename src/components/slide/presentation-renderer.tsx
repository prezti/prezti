'use client'

import { Button } from '@/components/ui/button'
import type { ElementType, PresentationType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PresentationRendererProps {
	presentation: PresentationType
	isFullscreen: boolean
	activeSlideIndex: number
	onSlideChange: (index: number) => void
	onExit?: () => void
}

// Helper function to parse font size (consistent with slide-canvas)
const parseFontSize = (fontSize: string | number | undefined): number => {
	if (!fontSize) return 16

	// If it's already a number, return it
	if (typeof fontSize === 'number') return fontSize

	// Handle rem units
	if (fontSize.includes('rem')) {
		const remValue = parseFloat(fontSize)
		return remValue * 16 // 1rem = 16px
	}

	// Handle px units or raw numbers
	return parseInt(fontSize) || 16
}

export default function PresentationRenderer({
	presentation,
	isFullscreen,
	activeSlideIndex,
	onSlideChange,
	onExit,
}: PresentationRendererProps) {
	const [isControlsVisible, setIsControlsVisible] = useState(true)
	const [mouseIdleTimer, setMouseIdleTimer] = useState<NodeJS.Timeout | null>(null)
	const [slideTransitioning, setSlideTransitioning] = useState(false)

	// Handle mouse movement to show/hide controls in fullscreen mode
	useEffect(() => {
		if (!isFullscreen) return

		const handleMouseMove = () => {
			setIsControlsVisible(true)

			if (mouseIdleTimer) {
				clearTimeout(mouseIdleTimer)
			}

			const timer = setTimeout(() => {
				setIsControlsVisible(false)
			}, 3000)

			setMouseIdleTimer(timer)
		}

		window.addEventListener('mousemove', handleMouseMove)

		// Initial timer
		const initialTimer = setTimeout(() => {
			setIsControlsVisible(false)
		}, 3000)

		setMouseIdleTimer(initialTimer)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			if (mouseIdleTimer) {
				clearTimeout(mouseIdleTimer)
			}
		}
	}, [isFullscreen, mouseIdleTimer])

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isFullscreen) {
				if (e.key === 'ArrowRight' || e.key === 'Space') {
					e.preventDefault()
					handleNextSlide()
				} else if (e.key === 'ArrowLeft') {
					e.preventDefault()
					handlePrevSlide()
				} else if (e.key === 'Escape') {
					e.preventDefault()
					onExit?.()
				} else if (e.key === 'Home') {
					e.preventDefault()
					onSlideChange(0)
				} else if (e.key === 'End') {
					e.preventDefault()
					onSlideChange(presentation.slides.length - 1)
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isFullscreen, activeSlideIndex, presentation.slides.length, onSlideChange, onExit])

	const handleNextSlide = () => {
		if (activeSlideIndex < presentation.slides.length - 1 && !slideTransitioning) {
			setSlideTransitioning(true)
			setTimeout(() => {
				onSlideChange(activeSlideIndex + 1)
				setSlideTransitioning(false)
			}, 300)
		}
	}

	const handlePrevSlide = () => {
		if (activeSlideIndex > 0 && !slideTransitioning) {
			setSlideTransitioning(true)
			setTimeout(() => {
				onSlideChange(activeSlideIndex - 1)
				setSlideTransitioning(false)
			}, 300)
		}
	}

	// Render element function (consistent with slide-canvas)
	const renderElement = (element: ElementType) => {
		const elementColor = element.style?.color || '#000000'

		const commonStyle: React.CSSProperties = {
			position: 'absolute',
			left: element.x || 0,
			top: element.y || 0,
			width: element.width || 'auto',
			height: element.height || 'auto',
			transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
			transformOrigin: 'center center',
			zIndex: element.zIndex || 0,
			cursor: 'default',
		}

		switch (element.type) {
			case 'heading':
				return (
					<div
						key={element.id}
						style={{
							...commonStyle,
							color: elementColor,
							fontSize: parseFontSize(element.style?.fontSize),
							fontWeight: 'bold',
							textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
							padding: 5,
							overflow: 'hidden',
							display: 'flex',
							alignItems: 'flex-start',
							wordWrap: 'break-word',
						}}>
						{element.content?.toString() || ''}
					</div>
				)

			case 'paragraph':
				return (
					<div
						key={element.id}
						style={{
							...commonStyle,
							color: elementColor,
							fontSize: parseFontSize(element.style?.fontSize),
							textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
							padding: 5,
							overflow: 'hidden',
							display: 'flex',
							alignItems: 'flex-start',
							wordWrap: 'break-word',
						}}>
						{element.content?.toString() || ''}
					</div>
				)

			case 'bullet-list':
			case 'numbered-list':
				const items = Array.isArray(element.content) ? element.content : []
				return (
					<div
						key={element.id}
						style={{
							...commonStyle,
							color: elementColor,
							fontSize: parseFontSize(element.style?.fontSize),
							textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
							padding: 5,
							overflow: 'hidden',
						}}>
						{items.map((item, index) => (
							<div key={index} style={{ marginBottom: 4 }}>
								{element.type === 'bullet-list' ? '• ' : `${index + 1}. `}
								{item}
							</div>
						))}
					</div>
				)

			case 'image':
				const src = element.content?.toString() || '/placeholder.svg'
				return (
					<div key={element.id} style={commonStyle}>
						<img
							src={src}
							alt=""
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'contain',
								display: 'block',
							}}
						/>
					</div>
				)

			case 'rectangle':
				return (
					<div
						key={element.id}
						style={{
							...commonStyle,
							backgroundColor: element.backgroundColor || 'transparent',
							border: element.borderColor
								? `${element.borderWidth || 1}px solid ${element.borderColor}`
								: 'none',
							borderRadius: 4,
						}}
					/>
				)

			case 'circle':
				return (
					<div
						key={element.id}
						style={{
							...commonStyle,
							backgroundColor: element.backgroundColor || 'transparent',
							border: element.borderColor
								? `${element.borderWidth || 1}px solid ${element.borderColor}`
								: 'none',
							borderRadius: '50%',
						}}
					/>
				)

			default:
				return (
					<div
						key={element.id}
						style={{
							...commonStyle,
							backgroundColor: 'rgba(200, 0, 0, 0.2)',
							border: '1px solid red',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 12,
						}}>
						Unknown: {element.type}
					</div>
				)
		}
	}

	const currentSlide = presentation.slides[activeSlideIndex]

	return (
		<div
			className={cn(
				'relative w-full h-full flex flex-col items-center justify-center bg-black',
				isFullscreen ? 'cursor-none' : ''
			)}
			style={{ cursor: isControlsVisible ? 'auto' : 'none' }}>
			<div
				className="relative w-full h-full flex items-center justify-center"
				style={{
					backgroundColor:
						currentSlide?.backgroundColor || presentation.theme?.backgroundColor || '#ffffff',
				}}>
				{/* Slide content */}
				<div
					className={cn(
						'w-full h-full flex items-center justify-center p-8',
						slideTransitioning && 'transition-opacity duration-300 opacity-0'
					)}>
					<div
						className="relative shadow-lg"
						style={{
							width: currentSlide?.width || 960,
							height: currentSlide?.height || 540,
							backgroundColor: currentSlide?.backgroundColor || '#ffffff',
						}}>
						{/* Render all elements */}
						{currentSlide?.elements.map((element) => renderElement(element))}
					</div>
				</div>

				{/* Navigation controls */}
				{isFullscreen && (
					<>
						<div
							className={cn(
								'absolute top-0 left-0 w-full p-4 flex items-center justify-between transition-opacity duration-300',
								isControlsVisible ? 'opacity-100' : 'opacity-0'
							)}>
							<div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
								{activeSlideIndex + 1} / {presentation.slides.length}
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={onExit}
								className="text-white hover:bg-black hover:bg-opacity-20">
								<X size={24} />
							</Button>
						</div>

						<div
							className={cn(
								'absolute bottom-4 left-0 w-full flex items-center justify-center space-x-4 transition-opacity duration-300',
								isControlsVisible ? 'opacity-100' : 'opacity-0'
							)}>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onSlideChange(0)}
								disabled={activeSlideIndex === 0}
								className="text-white hover:bg-black hover:bg-opacity-20">
								<SkipBack size={20} />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handlePrevSlide}
								disabled={activeSlideIndex === 0}
								className="text-white hover:bg-black hover:bg-opacity-20">
								<ChevronLeft size={24} />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleNextSlide}
								disabled={activeSlideIndex === presentation.slides.length - 1}
								className="text-white hover:bg-black hover:bg-opacity-20">
								<ChevronRight size={24} />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onSlideChange(presentation.slides.length - 1)}
								disabled={activeSlideIndex === presentation.slides.length - 1}
								className="text-white hover:bg-black hover:bg-opacity-20">
								<SkipForward size={20} />
							</Button>
						</div>
					</>
				)}

				{/* Non-fullscreen navigation */}
				{!isFullscreen && (
					<div className="absolute bottom-4 right-4 flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handlePrevSlide}
							disabled={activeSlideIndex === 0}
							className="bg-background">
							<ChevronLeft size={16} />
						</Button>
						<div className="text-sm font-medium">
							{activeSlideIndex + 1} / {presentation.slides.length}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleNextSlide}
							disabled={activeSlideIndex === presentation.slides.length - 1}
							className="bg-background">
							<ChevronRight size={16} />
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
