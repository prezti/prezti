'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SlideType } from '@/lib/types'
import { Copy, Eye, EyeOff, Grid3X3, Lock, LockOpen, Plus, Search, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

interface SlideSorterProps {
	slides: SlideType[]
	currentSlideId: string
	onSlideSelect: (slideId: string) => void
	onSlideAdd: (afterSlideId?: string) => void
	onSlideDelete: (slideId: string) => void
	onSlideDuplicate: (slideId: string) => void
	onSlideReorder: (slideId: string, newIndex: number) => void
	onSlideUpdate: (slideId: string, updates: Partial<SlideType>) => void
	className?: string
	viewMode?: 'grid' | 'list'
	onViewModeChange?: (mode: 'grid' | 'list') => void
}

interface SlidePreviewProps {
	slide: SlideType
	index: number
	isSelected: boolean
	onSelect: () => void
	onDelete: () => void
	onDuplicate: () => void
	onToggleVisibility?: () => void
	onToggleLock?: () => void
	isDragging?: boolean
	dragHandleProps?: Record<string, unknown>
}

function SlidePreview({
	slide,
	index,
	isSelected,
	onSelect,
	onDelete,
	onDuplicate,
	onToggleVisibility,
	onToggleLock,
	isDragging = false,
	dragHandleProps = {},
}: SlidePreviewProps) {
	const [showActions, setShowActions] = useState(false)

	// Generate slide preview
	const slidePreview = useMemo(() => {
		const aspectRatio = (slide.width || 1920) / (slide.height || 1080)
		const previewWidth = 200
		const previewHeight = previewWidth / aspectRatio

		return {
			width: previewWidth,
			height: previewHeight,
			backgroundColor: slide.backgroundColor || '#ffffff',
			elements: slide.elements.slice(0, 10), // Limit for performance
		}
	}, [slide])

	const isLocked = slide.elements.every((el) => el.isLocked)
	const hasHiddenElements = slide.elements.some((el) => el.opacity === 0)

	return (
		<div
			className={`relative group border rounded-lg overflow-hidden transition-all duration-200 ${
				isSelected
					? 'ring-2 ring-primary border-primary shadow-lg'
					: 'border-border hover:border-primary/50'
			} ${isDragging ? 'opacity-50 rotate-2' : ''}`}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
			onClick={onSelect}
			{...dragHandleProps}>
			{/* Slide Preview */}
			<div
				className="relative overflow-hidden cursor-pointer"
				style={{
					width: slidePreview.width,
					height: slidePreview.height,
					backgroundColor: slidePreview.backgroundColor,
				}}>
				{/* Render simplified elements */}
				{slidePreview.elements.map((element) => (
					<div
						key={element.id}
						className="absolute border border-gray-300/30"
						style={{
							left: `${(element.x / (slide.width || 1920)) * 100}%`,
							top: `${(element.y / (slide.height || 1080)) * 100}%`,
							width: `${(element.width / (slide.width || 1920)) * 100}%`,
							height: `${(element.height / (slide.height || 1080)) * 100}%`,
							backgroundColor:
								element.style?.backgroundColor ||
								(['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type)
									? 'transparent'
									: '#e5e7eb'),
							opacity: element.opacity || 1,
							transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
						}}>
						{/* Text preview */}
						{['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type) && (
							<div
								className="text-xs truncate p-1"
								style={{
									color: element.style?.color || '#000000',
									fontSize: '6px',
									fontWeight: element.style?.fontWeight || 'normal',
									textAlign: element.style?.textAlign || 'left',
								}}>
								{typeof element.content === 'string'
									? element.content.substring(0, 20) + (element.content.length > 20 ? '...' : '')
									: Array.isArray(element.content)
									? element.content[0]?.substring(0, 20)
									: ''}
							</div>
						)}

						{/* Image preview */}
						{element.type === 'image' && element.src && (
							<img src={element.src} alt={element.alt || ''} className="w-full h-full object-cover" />
						)}

						{/* Shape indicator */}
						{['rectangle', 'circle', 'triangle', 'star', 'line', 'arrow'].includes(element.type) && (
							<div className="w-full h-full flex items-center justify-center">
								<span className="text-[4px] text-gray-600 uppercase font-bold">{element.type}</span>
							</div>
						)}
					</div>
				))}

				{/* Overlay for locked/hidden states */}
				{isLocked && (
					<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
						<Lock className="h-4 w-4 text-white" />
					</div>
				)}

				{hasHiddenElements && (
					<div className="absolute top-1 left-1">
						<EyeOff className="h-3 w-3 text-yellow-600" />
					</div>
				)}
			</div>

			{/* Slide Info */}
			<div className="p-2 bg-background">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium">Slide {index + 1}</span>
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						<span>{slide.elements.length}</span>
						<span>elements</span>
					</div>
				</div>

				{/* Layout info */}
				{slide.layout && (
					<div className="mt-1">
						<span className="text-xs text-muted-foreground capitalize">
							{slide.layout.replace('-', ' ')}
						</span>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			{showActions && (
				<div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="secondary"
									size="sm"
									className="h-6 w-6 p-0"
									onClick={(e) => {
										e.stopPropagation()
										onDuplicate()
									}}>
									<Copy className="h-3 w-3" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Duplicate Slide</TooltipContent>
						</Tooltip>

						{onToggleLock && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size="sm"
										className="h-6 w-6 p-0"
										onClick={(e) => {
											e.stopPropagation()
											onToggleLock()
										}}>
										{isLocked ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
									</Button>
								</TooltipTrigger>
								<TooltipContent>{isLocked ? 'Unlock Elements' : 'Lock Elements'}</TooltipContent>
							</Tooltip>
						)}

						{onToggleVisibility && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size="sm"
										className="h-6 w-6 p-0"
										onClick={(e) => {
											e.stopPropagation()
											onToggleVisibility()
										}}>
										{hasHiddenElements ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{hasHiddenElements ? 'Show Hidden Elements' : 'Hide Elements'}
								</TooltipContent>
							</Tooltip>
						)}

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="destructive"
									size="sm"
									className="h-6 w-6 p-0"
									onClick={(e) => {
										e.stopPropagation()
										onDelete()
									}}>
									<Trash2 className="h-3 w-3" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Delete Slide</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			)}

			{/* Selection indicator */}
			{isSelected && (
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute top-0 left-0 w-3 h-3 bg-primary rounded-br-lg" />
					<div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-tl-lg" />
				</div>
			)}
		</div>
	)
}

export function SlideSorter({
	slides,
	currentSlideId,
	onSlideSelect,
	onSlideAdd,
	onSlideDelete,
	onSlideDuplicate,
	onSlideReorder,
	onSlideUpdate,
	className,
	viewMode = 'grid',
	onViewModeChange,
}: SlideSorterProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [draggedSlide, setDraggedSlide] = useState<string | null>(null)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

	// Filter slides based on search
	const filteredSlides = useMemo(() => {
		if (!searchQuery.trim()) return slides

		return slides.filter((slide, index) => {
			const slideNumber = (index + 1).toString()
			const layout = slide.layout || ''
			const elementTypes = [...new Set(slide.elements.map((el) => el.type))].join(' ')
			const textContent = slide.elements
				.filter((el) => ['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(el.type))
				.map((el) => el.content)
				.join(' ')

			const searchText = `${slideNumber} ${layout} ${elementTypes} ${textContent}`.toLowerCase()
			return searchText.includes(searchQuery.toLowerCase())
		})
	}, [slides, searchQuery])

	// Handle drag and drop
	const handleDragStart = useCallback((slideId: string) => {
		setDraggedSlide(slideId)
	}, [])

	const handleDragOver = useCallback((index: number) => {
		setDragOverIndex(index)
	}, [])

	const handleDragEnd = useCallback(() => {
		if (draggedSlide && dragOverIndex !== null) {
			const slideIndex = slides.findIndex((s) => s.id === draggedSlide)
			if (slideIndex !== -1 && slideIndex !== dragOverIndex) {
				onSlideReorder(draggedSlide, dragOverIndex)
			}
		}
		setDraggedSlide(null)
		setDragOverIndex(null)
	}, [draggedSlide, dragOverIndex, slides, onSlideReorder])

	const handleSlideToggleLock = useCallback(
		(slideId: string) => {
			const slide = slides.find((s) => s.id === slideId)
			if (!slide) return

			const allLocked = slide.elements.every((el) => el.isLocked)
			const updatedElements = slide.elements.map((el) => ({
				...el,
				isLocked: !allLocked,
			}))

			onSlideUpdate(slideId, { elements: updatedElements })
		},
		[slides, onSlideUpdate]
	)

	const handleSlideToggleVisibility = useCallback(
		(slideId: string) => {
			const slide = slides.find((s) => s.id === slideId)
			if (!slide) return

			const hasHidden = slide.elements.some((el) => el.opacity === 0)
			const updatedElements = slide.elements.map((el) => ({
				...el,
				opacity: hasHidden ? 1 : 0,
			}))

			onSlideUpdate(slideId, { elements: updatedElements })
		},
		[slides, onSlideUpdate]
	)

	return (
		<div className={`flex flex-col h-full ${className}`}>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-semibold">Slide Sorter</h2>
					<span className="text-sm text-muted-foreground">
						{filteredSlides.length} of {slides.length} slides
					</span>
				</div>

				<div className="flex items-center gap-2">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search slides..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8 w-48"
						/>
					</div>

					{/* View Mode Toggle */}
					{onViewModeChange && (
						<Button
							variant={viewMode === 'grid' ? 'default' : 'outline'}
							size="sm"
							onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}>
							<Grid3X3 className="h-4 w-4" />
						</Button>
					)}

					{/* Add Slide */}
					<Button onClick={() => onSlideAdd()}>
						<Plus className="h-4 w-4 mr-1" />
						Add Slide
					</Button>
				</div>
			</div>

			{/* Slides Grid/List */}
			<div className="flex-1 p-4 overflow-auto">
				{filteredSlides.length === 0 ? (
					<div className="flex items-center justify-center h-64">
						{searchQuery ? (
							<div className="text-center">
								<Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
								<h3 className="text-lg font-medium mb-2">No slides found</h3>
								<p className="text-muted-foreground">Try adjusting your search terms</p>
							</div>
						) : (
							<div className="text-center">
								<Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
								<h3 className="text-lg font-medium mb-2">No slides yet</h3>
								<p className="text-muted-foreground mb-4">Get started by adding your first slide</p>
								<Button onClick={() => onSlideAdd()}>
									<Plus className="h-4 w-4 mr-1" />
									Add First Slide
								</Button>
							</div>
						)}
					</div>
				) : (
					<div
						className={
							viewMode === 'grid'
								? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
								: 'space-y-2'
						}>
						{filteredSlides.map((slide, index) => (
							<div
								key={slide.id}
								draggable
								onDragStart={() => handleDragStart(slide.id)}
								onDragOver={(e) => {
									e.preventDefault()
									handleDragOver(index)
								}}
								onDrop={handleDragEnd}
								className={dragOverIndex === index ? 'border-2 border-dashed border-primary' : ''}>
								<SlidePreview
									slide={slide}
									index={slides.findIndex((s) => s.id === slide.id)}
									isSelected={slide.id === currentSlideId}
									onSelect={() => onSlideSelect(slide.id)}
									onDelete={() => onSlideDelete(slide.id)}
									onDuplicate={() => onSlideDuplicate(slide.id)}
									onToggleLock={() => handleSlideToggleLock(slide.id)}
									onToggleVisibility={() => handleSlideToggleVisibility(slide.id)}
									isDragging={draggedSlide === slide.id}
								/>
							</div>
						))}

						{/* Add slide button in grid */}
						{viewMode === 'grid' && (
							<div
								className="flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
								style={{ height: 150 }}
								onClick={() => onSlideAdd()}>
								<div className="text-center">
									<Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Add Slide</span>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

// Hook for slide sorter functionality
export function useSlideSorter(slides: SlideType[], onSlidesUpdate: (slides: SlideType[]) => void) {
	const reorderSlides = useCallback(
		(slideId: string, newIndex: number) => {
			const currentIndex = slides.findIndex((s) => s.id === slideId)
			if (currentIndex === -1 || currentIndex === newIndex) return

			const newSlides = [...slides]
			const [movedSlide] = newSlides.splice(currentIndex, 1)
			newSlides.splice(newIndex, 0, movedSlide)

			onSlidesUpdate(newSlides)
		},
		[slides, onSlidesUpdate]
	)

	const deleteSlide = useCallback(
		(slideId: string) => {
			const newSlides = slides.filter((s) => s.id !== slideId)
			onSlidesUpdate(newSlides)
		},
		[slides, onSlidesUpdate]
	)

	const duplicateSlide = useCallback(
		(slideId: string) => {
			const slideIndex = slides.findIndex((s) => s.id === slideId)
			if (slideIndex === -1) return

			const originalSlide = slides[slideIndex]
			const duplicatedSlide: SlideType = {
				...originalSlide,
				id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				elements: originalSlide.elements.map((el) => ({
					...el,
					id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				})),
			}

			const newSlides = [...slides]
			newSlides.splice(slideIndex + 1, 0, duplicatedSlide)
			onSlidesUpdate(newSlides)

			return duplicatedSlide.id
		},
		[slides, onSlidesUpdate]
	)

	const addSlide = useCallback(
		(afterSlideId?: string) => {
			const newSlide: SlideType = {
				id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				layout: 'blank',
				width: 1920,
				height: 1080,
				backgroundColor: '#ffffff',
				elements: [],
			}

			let insertIndex = slides.length
			if (afterSlideId) {
				const afterIndex = slides.findIndex((s) => s.id === afterSlideId)
				if (afterIndex !== -1) {
					insertIndex = afterIndex + 1
				}
			}

			const newSlides = [...slides]
			newSlides.splice(insertIndex, 0, newSlide)
			onSlidesUpdate(newSlides)

			return newSlide.id
		},
		[slides, onSlidesUpdate]
	)

	return {
		reorderSlides,
		deleteSlide,
		duplicateSlide,
		addSlide,
	}
}
