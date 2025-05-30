'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ElementType, PresentationType, SlideType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

interface UnifiedSidebarProps {
	presentation: PresentationType
	activeSlideIndex: number
	onSlideChange: (index: number) => void
	onAddSlide: () => void
	onUpdateSlide: (updatedSlide: SlideType) => void
	onUpdatePresentation: (updatedPresentation: PresentationType) => void
	onElementSelect: (elementIds: string[]) => void
	onDeleteElements: () => void
}

// Mini slide preview component
function SlidePreview({ slide }: { slide: SlideType }) {
	const slidePreview = useMemo(() => {
		const aspectRatio = (slide.width || 1920) / (slide.height || 1080)
		const previewWidth = 120
		const previewHeight = previewWidth / aspectRatio

		return {
			width: previewWidth,
			height: previewHeight,
			backgroundColor: slide.backgroundColor || '#ffffff',
			elements: slide.elements.slice(0, 8), // Limit for performance
		}
	}, [slide])

	return (
		<div
			className="relative overflow-hidden rounded border border-border/50"
			style={{
				width: slidePreview.width,
				height: slidePreview.height,
				backgroundColor: slidePreview.backgroundColor,
			}}>
			{/* Render simplified elements */}
			{slidePreview.elements.map((element) => (
				<div
					key={element.id}
					className="absolute"
					style={{
						left: `${(element.x / (slide.width || 1920)) * 100}%`,
						top: `${(element.y / (slide.height || 1080)) * 100}%`,
						width: `${(element.width / (slide.width || 1920)) * 100}%`,
						height: `${(element.height / (slide.height || 1080)) * 100}%`,
						backgroundColor:
							element.style?.backgroundColor ||
							(element.type === 'image' ? 'transparent' : 'rgba(156, 163, 175, 0.3)'),
						opacity: element.opacity || 1,
						transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
					}}>
					{/* Text content preview */}
					{['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type) && (
						<div
							className="text-[6px] leading-tight p-0.5 truncate font-medium"
							style={{
								color: element.style?.color || '#000000',
								fontSize: `${Math.max(
									4,
									parseFloat(element.style?.fontSize?.toString() || '12') * 0.3
								)}px`,
								textAlign: element.style?.textAlign || 'left',
							}}>
							{typeof element.content === 'string'
								? element.content.substring(0, 15) + (element.content.length > 15 ? '...' : '')
								: Array.isArray(element.content)
								? element.content[0]?.substring(0, 15) + '...'
								: ''}
						</div>
					)}

					{/* Image preview */}
					{element.type === 'image' && element.content && (
						<img
							src={element.content.toString()}
							alt={element.alt || ''}
							className="w-full h-full object-cover rounded-sm"
						/>
					)}

					{/* Shape indicators */}
					{['rectangle', 'circle', 'triangle', 'star', 'line', 'arrow'].includes(element.type) && (
						<div
							className="w-full h-full flex items-center justify-center bg-gray-200 border border-gray-300 text-[4px] text-gray-600 font-bold uppercase"
							style={{
								borderRadius: element.type === 'circle' ? '50%' : '2px',
								backgroundColor: element.style?.backgroundColor || '#e5e7eb',
								borderColor: element.style?.color || '#d1d5db',
							}}>
							{element.type.charAt(0)}
						</div>
					)}
				</div>
			))}
		</div>
	)
}

export function UnifiedSidebar({
	presentation,
	activeSlideIndex,
	onSlideChange,
	onAddSlide,
	onUpdatePresentation,
}: UnifiedSidebarProps) {
	const [searchQuery, setSearchQuery] = useState('')

	// Virtualization setup
	const parentRef = useRef<HTMLDivElement>(null)

	// Filter slides based on search query
	const filteredSlides = presentation.slides.filter((slide) => {
		// Find the title element or use the slide index
		const titleElement = slide.elements.find((element) => element.type === 'heading')
		const slideTitle = titleElement
			? String(titleElement.content)
			: `Slide ${presentation.slides.indexOf(slide) + 1}`
		return slideTitle.toLowerCase().includes(searchQuery.toLowerCase())
	})

	// Setup virtualizer for the filtered slides
	const virtualizer = useVirtualizer({
		count: filteredSlides.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 180, // Estimated height of each slide item including preview
		overscan: 5, // Render 5 extra items outside of the visible area
	})

	const handleDuplicateSlide = (index: number) => {
		const slideToClone = presentation.slides[index]
		const newSlide = {
			...JSON.parse(JSON.stringify(slideToClone)), // Deep clone
			id: `slide-${Date.now()}`,
		}

		const updatedSlides = [...presentation.slides]
		updatedSlides.splice(index + 1, 0, newSlide)

		onUpdatePresentation({
			...presentation,
			slides: updatedSlides,
		})
	}

	const handleDeleteSlide = (index: number) => {
		if (presentation.slides.length <= 1) {
			return // Don't delete the last slide
		}

		const updatedSlides = [...presentation.slides]
		updatedSlides.splice(index, 1)

		onUpdatePresentation({
			...presentation,
			slides: updatedSlides,
		})

		// Adjust active slide index if needed
		if (activeSlideIndex >= updatedSlides.length) {
			onSlideChange(updatedSlides.length - 1)
		}
	}

	const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === presentation.slides.length - 1)
		) {
			return // Can't move beyond boundaries
		}

		const updatedSlides = [...presentation.slides]
		const newIndex = direction === 'up' ? index - 1 : index + 1

		// Swap slides
		const temp = updatedSlides[index]
		updatedSlides[index] = updatedSlides[newIndex]
		updatedSlides[newIndex] = temp

		onUpdatePresentation({
			...presentation,
			slides: updatedSlides,
		})

		// Update active slide index to follow the moved slide
		if (activeSlideIndex === index) {
			onSlideChange(newIndex)
		} else if (activeSlideIndex === newIndex) {
			onSlideChange(index)
		}
	}

	return (
		<div className="w-72 bg-background border-r border-border flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b border-border/50">
				<Input
					placeholder="Search slides..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="mb-2"
				/>
				<Button onClick={onAddSlide} className="w-full">
					<Plus className="h-4 w-4 mr-2" />
					Add Slide
				</Button>
			</div>

			{/* Virtualized slide list */}
			<div className="flex-1 overflow-hidden">
				<div
					ref={parentRef}
					className="h-full flex-1 overflow-auto p-4"
					style={{
						contain: 'strict',
					}}>
					<div
						style={{
							height: virtualizer.getTotalSize(),
							width: '100%',
							position: 'relative',
						}}>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const slide = filteredSlides[virtualItem.index]
							const slideIndex = presentation.slides.findIndex((s) => s.id === slide.id)

							return (
								<div
									key={virtualItem.key}
									data-index={virtualItem.index}
									ref={virtualizer.measureElement}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										transform: `translateY(${virtualItem.start}px)`,
									}}>
									<div
										className={cn(
											'border rounded-md p-3 cursor-pointer group transition-all duration-200 mb-3 bg-background hover:shadow-md',
											activeSlideIndex === slideIndex
												? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
												: 'hover:bg-muted/50 border-border/60'
										)}
										onClick={() => onSlideChange(slideIndex)}>
										{/* Slide preview image */}
										<div className="flex justify-center mb-3">
											<SlidePreview slide={slide} />
										</div>

										<div className="flex items-center justify-between mb-2 w-full">
											<div className="flex items-center space-x-2 w-full">
												<div className="bg-muted w-6 h-6 flex items-center justify-center rounded text-xs font-medium">
													{slideIndex + 1}
												</div>
												<span className="text-sm font-medium w-full truncate">
													{slide.elements.find((el) => el.type === 'heading')?.content ||
														`Slide ${slideIndex + 1}`}
												</span>
											</div>
											<div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6"
													onClick={(e) => {
														e.stopPropagation()
														handleDuplicateSlide(slideIndex)
													}}>
													<Copy className="h-3 w-3" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6"
													onClick={(e) => {
														e.stopPropagation()
														handleDeleteSlide(slideIndex)
													}}>
													<Trash2 className="h-3 w-3" />
												</Button>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<div className="text-xs text-muted-foreground">
												{slide.elements.length} elements
											</div>
											<div className="flex items-center space-x-1">
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6"
													disabled={slideIndex === 0}
													onClick={(e) => {
														e.stopPropagation()
														handleMoveSlide(slideIndex, 'up')
													}}>
													<ChevronUp className="h-3 w-3" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6"
													disabled={slideIndex === presentation.slides.length - 1}
													onClick={(e) => {
														e.stopPropagation()
														handleMoveSlide(slideIndex, 'down')
													}}>
													<ChevronDown className="h-3 w-3" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

// Draggable Element Component
interface DraggableElementProps {
	type: ElementType['type']
	name: string
	icon: React.ReactNode
}

export function DraggableElement({ type, name, icon }: DraggableElementProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: type,
	})

	const style = {
		transform: transform ? CSS.Translate.toString(transform) : undefined,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={cn(
				'flex flex-col items-center justify-center p-3 border border-border rounded-md bg-background hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors',
				isDragging && 'ring-2 ring-primary opacity-50'
			)}>
			<div className="text-primary mb-1">{icon}</div>
			<span className="text-xs font-medium">{name}</span>
		</div>
	)
}
