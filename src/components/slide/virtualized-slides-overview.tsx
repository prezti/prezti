'use client'

import EnhancedSlideEditor from '@/components/slide/enhanced-slide-editor'
import TemplateGallery from '@/components/slide/template-gallery'
import { Button } from '@/components/ui/button'
import { createElementWithDefaults } from '@/lib/element-factory'
import type { ElementType, SlideType } from '@/lib/types'
import type { VirtualizedSlidesOverviewProps as OriginalVSOProps } from '@/lib/types/virtualizedSlides'
import { cn } from '@/lib/utils'
import type { VirtualItem } from '@tanstack/react-virtual'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Template elements creation function (imported from page.tsx logic)
function getElementsForTemplate(template: string): ElementType[] {
	switch (template) {
		case 'blank-card':
			return []
		case 'image-and-text':
			return [
				createElementWithDefaults('image', 0, 0, {
					src: '/placeholder.svg?height=300&width=400',
					alt: 'Image',
					width: 400,
					height: 300,
				}),
				createElementWithDefaults('heading', 450, 0, {
					content: 'Slide Title',
					width: 500,
					height: 60,
					style: {
						fontSize: 32,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 450, 80, {
					content: 'Add your content here',
					width: 500,
					height: 200,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'text-and-image':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Slide Title',
					width: 500,
					height: 60,
					style: {
						fontSize: 32,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 0, 80, {
					content: 'Add your content here',
					width: 500,
					height: 200,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('image', 550, 0, {
					src: '/placeholder.svg?height=300&width=400',
					alt: 'Image',
					width: 400,
					height: 300,
				}),
			]
		case 'two-columns':
			return [
				createElementWithDefaults('paragraph', 0, 0, {
					content: 'Column 1 content',
					width: 450,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 500, 0, {
					content: 'Column 2 content',
					width: 450,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'two-columns-with-headings':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Column 1 Heading',
					width: 450,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 0, 60, {
					content: 'Column 1 content',
					width: 450,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('heading', 500, 0, {
					content: 'Column 2 Heading',
					width: 450,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 500, 60, {
					content: 'Column 2 content',
					width: 450,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'three-columns':
			return [
				createElementWithDefaults('paragraph', 0, 0, {
					content: 'Column 1 content',
					width: 300,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 320, 0, {
					content: 'Column 2 content',
					width: 300,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 640, 0, {
					content: 'Column 3 content',
					width: 300,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'three-columns-with-headings':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Column 1 Heading',
					width: 300,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 0, 60, {
					content: 'Column 1 content',
					width: 300,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('heading', 320, 0, {
					content: 'Column 2 Heading',
					width: 300,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 320, 60, {
					content: 'Column 2 content',
					width: 300,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('heading', 640, 0, {
					content: 'Column 3 Heading',
					width: 300,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 640, 60, {
					content: 'Column 3 content',
					width: 300,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'four-columns':
			return [
				createElementWithDefaults('paragraph', 0, 0, {
					content: 'Column 1 content',
					width: 220,
					height: 300,
					style: {
						fontSize: 16,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 240, 0, {
					content: 'Column 2 content',
					width: 220,
					height: 300,
					style: {
						fontSize: 16,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 480, 0, {
					content: 'Column 3 content',
					width: 220,
					height: 300,
					style: {
						fontSize: 16,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 720, 0, {
					content: 'Column 4 content',
					width: 220,
					height: 300,
					style: {
						fontSize: 16,
						color: '#333333',
					},
				}),
			]
		case 'title-with-bullets':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Slide Title',
					width: 900,
					height: 60,
					style: {
						fontSize: 32,
						color: '#000000',
					},
				}),
				createElementWithDefaults('bullet-list', 0, 80, {
					content: ['First bullet point', 'Second bullet point', 'Third bullet point'],
					width: 900,
					height: 200,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'title-with-bullets-and-image':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Slide Title',
					width: 900,
					height: 60,
					style: {
						fontSize: 32,
						color: '#000000',
					},
				}),
				createElementWithDefaults('bullet-list', 0, 80, {
					content: ['First bullet point', 'Second bullet point', 'Third bullet point'],
					width: 500,
					height: 200,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('image', 550, 80, {
					src: '/placeholder.svg?height=200&width=300',
					alt: 'Image',
					width: 300,
					height: 200,
				}),
			]
		default:
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Slide Title',
					width: 900,
					height: 60,
					style: {
						fontSize: 32,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 0, 80, {
					content: 'Add your content here',
					width: 900,
					height: 200,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
	}
}

// Type for our candidate slide object
type CandidateSlideInfo = {
	index: number
	intersectionRatio: number
	distanceFromCenter: number
}

// Simple debounce utility function
function debounce<T extends unknown[]>(func: (...args: T) => void, waitFor: number) {
	let timeout: NodeJS.Timeout | null = null

	const debounced = (...args: T): void => {
		if (timeout !== null) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(() => func(...args), waitFor)
	}
	return debounced
}

// Define the props for this component, extending the base if necessary or defining fresh
export interface VirtualizedSlidesOverviewProps extends OriginalVSOProps {
	// onSlideSelect is already in OriginalVSOProps, we are effectively overriding its signature for this component
	onSlideSelect: (index: number, source?: 'click' | 'scroll') => void
	lastSelectionSource?: 'click' | 'scroll'
	// Add aspect ratio control
	aspectRatio?: '16:9' | '4:3'
	// Other props from OriginalVSOProps are implicitly included via `extends`
}

export function VirtualizedSlidesOverview({
	presentation,
	activeSlideIndex,
	onSlideSelect, // This will now be the extended version
	onPresentationUpdate,
	isFullscreen = false,
	className,
	showGrid = false,
	selectedElementIds = [],
	onSelectedElementIdsChange = () => {},
	lastSelectionSource, // New prop
	aspectRatio, // New prop
}: VirtualizedSlidesOverviewProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false)
	const [insertAfterIndex, setInsertAfterIndex] = useState<number>(-1)
	const [containerDimensions, setContainerDimensions] = useState({
		width: typeof window !== 'undefined' ? 800 : 800, // Conservative fallback, ResizeObserver will update quickly
		height: typeof window !== 'undefined' ? 600 : 600, // Conservative fallback, ResizeObserver will update quickly
	})
	const parentRef = useRef<HTMLDivElement>(null)
	const slideRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
	const [userManuallySelectedSlide, setUserManuallySelectedSlide] = useState(false)
	const manualSelectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const resizeObserverRef = useRef<ResizeObserver | null>(null)

	// State for measurement-driven approach
	const [measuredItemHeight, setMeasuredItemHeight] = useState<number>(400) // Initial fallback
	const [isInitialMeasurement, setIsInitialMeasurement] = useState(true)
	const [areContainerDimensionsReady, setAreContainerDimensionsReady] = useState(false)
	const measurementRef = useRef<HTMLDivElement>(null)
	const itemResizeObserver = useRef<ResizeObserver | null>(null)

	// Enhanced ResizeObserver for container-based sizing
	useEffect(() => {
		if (!parentRef.current) return

		const updateContainerDimensions = () => {
			if (parentRef.current) {
				const rect = parentRef.current.getBoundingClientRect()
				if (rect.width > 0 && rect.height > 0) {
					setContainerDimensions({
						width: rect.width,
						height: rect.height,
					})
					// If dimensions are not the initial fallback, mark as ready
					if (rect.width !== 800 || rect.height !== 600) {
						setAreContainerDimensionsReady(true)
					}
				}
			}
		}

		// Initial measurement with a small delay to ensure layout is stable
		const timeoutId = setTimeout(() => {
			updateContainerDimensions()
		}, 50) // Reduced delay for faster response to layout changes

		// Set up ResizeObserver for precise container tracking
		if (window.ResizeObserver) {
			resizeObserverRef.current = new ResizeObserver((entries) => {
				for (const entry of entries) {
					if (entry.target === parentRef.current) {
						if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
							setContainerDimensions({
								width: entry.contentRect.width,
								height: entry.contentRect.height,
							})
							// If dimensions are not the initial fallback, mark as ready
							if (entry.contentRect.width !== 800 || entry.contentRect.height !== 600) {
								setAreContainerDimensionsReady(true)
							}
						}
					}
				}
			})

			resizeObserverRef.current.observe(parentRef.current)
		}

		// Fallback to window resize listener
		const handleResize = debounce(() => {
			updateContainerDimensions()
		}, 150)

		window.addEventListener('resize', handleResize)

		return () => {
			clearTimeout(timeoutId)
			window.removeEventListener('resize', handleResize)
			if (resizeObserverRef.current) {
				resizeObserverRef.current.disconnect()
			}
		}
	}, [])

	// Debounced function to update active slide from scroll
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedUpdateActiveSlide = useCallback(
		debounce((index: number) => {
			if (!userManuallySelectedSlide) {
				onSlideSelect(index, 'scroll')
			}
		}, 300), // 300ms debounce delay
		[onSlideSelect, userManuallySelectedSlide] // userManuallySelectedSlide is important here
	)

	// Filter slides based on search query
	const filteredSlides = useMemo(() => {
		if (!searchQuery.trim()) return presentation.slides

		return presentation.slides.filter((slide: SlideType, index: number) => {
			// Search in slide title
			const titleElement = slide.elements.find((el: ElementType) => el.type === 'heading')
			const slideTitle = titleElement?.content?.toString() || `Slide ${index + 1}`

			// Search in slide content
			const textContent = slide.elements
				.filter(
					(el: ElementType) =>
						el.type === 'paragraph' || el.type === 'bullet-list' || el.type === 'numbered-list'
				)
				.map((el: ElementType) => el.content)
				.join(' ')

			const searchText = `${slideTitle} ${textContent}`.toLowerCase()
			return searchText.includes(searchQuery.toLowerCase())
		})
	}, [presentation.slides, searchQuery])

	// Calculate optimal dimensions to maintain aspect ratio
	// The wrapper should maintain the slide's aspect ratio
	const slideAspectRatio = aspectRatio || '16:9'
	const slideDimensions =
		slideAspectRatio === '16:9' ? { width: 960, height: 540 } : { width: 960, height: 720 } // 4:3 aspect ratio

	// Step 2: Calculate base wrapper dimensions with strict aspect ratio enforcement
	// Get aspect ratio constraints
	const aspectRatioValue = slideDimensions.width / slideDimensions.height // 16:9 = 1.777, 4:3 = 1.333

	// Calculate maximum possible width with container constraints (more aggressive)
	const containerWidthConstraint = containerDimensions.width * 0.98 // Increased from 0.95 to 0.98
	const absoluteMaxWidth = 1400 // Increased from 1200 to 1400
	const maxPossibleWidth = Math.min(containerWidthConstraint, absoluteMaxWidth)

	// Calculate height that would maintain aspect ratio
	const heightFromWidth = maxPossibleWidth / aspectRatioValue

	// Check if this height fits within container constraints (more aggressive)
	const virtualizationOverhead = 24 + 84 // Top spacing + button section
	const availableHeightForSlide = containerDimensions.height * 0.97 - virtualizationOverhead // Increased from 0.95 to 0.97

	// Determine final dimensions maintaining aspect ratio
	let finalWidth: number
	let finalHeight: number

	if (heightFromWidth <= availableHeightForSlide) {
		// Width-constrained scenario: use max width, calculate height
		finalWidth = maxPossibleWidth
		finalHeight = heightFromWidth
	} else {
		// Height-constrained scenario: use max height, calculate width
		finalHeight = availableHeightForSlide
		finalWidth = finalHeight * aspectRatioValue
	}

	// Apply absolute minimums while preserving aspect ratio
	const absoluteMinWidth = 300
	const minHeightForMinWidth = absoluteMinWidth / aspectRatioValue

	if (finalWidth < absoluteMinWidth) {
		finalWidth = absoluteMinWidth
		finalHeight = minHeightForMinWidth
	}

	// Assign to existing variables (maintaining compatibility)
	const baseWrapperWidth = finalWidth
	const baseWrapperHeight = finalHeight

	// MEASUREMENT-DRIVEN APPROACH: Measure real content, don't calculate
	// This system observes actual rendered dimensions and adapts dynamically

	// Step 1: Create a measurement slide to determine real dimensions
	const measurementSlide = useMemo(() => {
		if (filteredSlides.length === 0) return null
		// Use first slide as measurement template
		return filteredSlides[0]
	}, [filteredSlides])

	// Step 3: Real-time measurement system
	useEffect(() => {
		if (!measurementRef.current || !measurementSlide) return

		const measureActualHeight = () => {
			if (!measurementRef.current) return

			const rect = measurementRef.current.getBoundingClientRect()
			if (rect.height > 0) {
				console.log('📏 Measured actual item height:', rect.height)
				setMeasuredItemHeight(rect.height)
				setIsInitialMeasurement(false)
			}
		}

		// Initial measurement
		setTimeout(measureActualHeight, 100) // Allow rendering to complete

		// Set up ResizeObserver for continuous measurement
		if (window.ResizeObserver) {
			itemResizeObserver.current = new ResizeObserver((entries) => {
				for (const entry of entries) {
					if (entry.target === measurementRef.current && entry.contentRect.height > 0) {
						console.log('🔄 Item height changed:', entry.contentRect.height)
						setMeasuredItemHeight(entry.contentRect.height)
					}
				}
			})

			itemResizeObserver.current.observe(measurementRef.current)
		}

		return () => {
			if (itemResizeObserver.current) {
				itemResizeObserver.current.disconnect()
			}
		}
	}, [measurementSlide, containerDimensions, aspectRatio])

	// Step 4: Calculate final zoom based on measured dimensions
	const finalZoom = Math.min(
		baseWrapperWidth / slideDimensions.width,
		baseWrapperHeight / slideDimensions.height
	)

	// Debug logging for measurement system
	useEffect(() => {
		console.log('📐 Measurement-Based Layout Debug:', {
			containerDimensions,
			measuredItemHeight,
			baseWrapperDimensions: { width: baseWrapperWidth, height: baseWrapperHeight },
			finalZoom,
			aspectRatio: slideAspectRatio,
			isInitialMeasurement,
			// New aspect ratio calculation details
			calculationMethod:
				heightFromWidth <= availableHeightForSlide ? 'width-constrained' : 'height-constrained',
			availableHeightForSlide: availableHeightForSlide,
			heightFromWidth: heightFromWidth,
			aspectRatioEnforced: true,
			aspectRatioValue: aspectRatioValue,
			maxPossibleWidth: maxPossibleWidth,
		})
	}, [
		containerDimensions,
		measuredItemHeight,
		baseWrapperWidth,
		baseWrapperHeight,
		finalZoom,
		slideAspectRatio,
		isInitialMeasurement,
		// Add new variables to dependencies
		heightFromWidth,
		availableHeightForSlide,
		aspectRatioValue,
		maxPossibleWidth,
	])

	// Use measured height for virtualization
	const virtualizer = useVirtualizer({
		count: filteredSlides.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => measuredItemHeight,
		overscan: 3,
		paddingStart: 4,
		paddingEnd: 100,
	})

	// Force re-measurement when measuredItemHeight changes after initial setup
	useEffect(() => {
		if (!isInitialMeasurement && virtualizer) {
			virtualizer.measure()
			console.log('📏 Virtualizer re-measured due to item height change.')
		}
	}, [measuredItemHeight, isInitialMeasurement, virtualizer])

	// Scroll to active slide when activeSlideIndex changes, considering the source
	useEffect(() => {
		if (activeSlideIndex >= 0 && filteredSlides.length > 0) {
			// Scroll if it was a click (either internal or external, identified by lastSelectionSource)
			// or if lastSelectionSource is undefined (e.g. initial load)
			if (lastSelectionSource === 'click' || typeof lastSelectionSource === 'undefined') {
				const filteredIndex = filteredSlides.findIndex(
					(slide: SlideType) =>
						presentation.slides.findIndex((s: SlideType) => s.id === slide.id) === activeSlideIndex
				)
				if (filteredIndex !== -1) {
					virtualizer.scrollToIndex(filteredIndex, {
						align: 'center',
						behavior: 'smooth',
					})
				}
			}
		}
	}, [activeSlideIndex, filteredSlides, presentation.slides, virtualizer, lastSelectionSource])

	// Intersection Observer for scroll-based active slide selection
	useEffect(() => {
		if (!parentRef.current) return

		const scrollContainer = parentRef.current // Capture for stable reference in observer

		const observer = new IntersectionObserver(
			(entries) => {
				if (userManuallySelectedSlide) return

				const viewportCenterY = scrollContainer.clientHeight / 2

				const candidates: CandidateSlideInfo[] = entries
					.map((entry) => {
						if (entry.isIntersecting && entry.target instanceof HTMLElement) {
							const slideId = entry.target.dataset.slideId
							if (slideId) {
								const originalIndex = presentation.slides.findIndex((s: SlideType) => s.id === slideId)
								if (originalIndex !== -1) {
									const targetRect = entry.boundingClientRect
									const parentRect = scrollContainer.getBoundingClientRect()
									// Ensure parentRect is valid before calculating relative position
									// (scrollContainer is parentRef.current, so getBoundingClientRect should be valid if scrollContainer is)
									const slideCenterY = targetRect.top - parentRect.top + targetRect.height / 2
									const distanceFromCenter = Math.abs(slideCenterY - viewportCenterY)
									return {
										index: originalIndex,
										intersectionRatio: entry.intersectionRatio,
										distanceFromCenter,
									}
								}
							}
						}
						return null
					})
					.filter((c): c is CandidateSlideInfo => c !== null)

				if (candidates.length > 0) {
					candidates.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter)
					const topCandidate = candidates[0]
					if (topCandidate.index !== activeSlideIndex) {
						debouncedUpdateActiveSlide(topCandidate.index)
					}
				}
			},
			{ threshold: [0.1, 0.5, 0.9], root: scrollContainer }
		)

		slideRefs.current.forEach((element) => {
			if (element) observer.observe(element)
		})

		return () => {
			slideRefs.current.forEach((element) => {
				if (element) observer.unobserve(element)
			})
		}
	}, [
		filteredSlides,
		presentation.slides,
		activeSlideIndex,
		userManuallySelectedSlide,
		debouncedUpdateActiveSlide,
	])

	// Handle slide updates
	const handleSlideUpdate = useCallback(
		(slideIndex: number) => (updatedSlide: SlideType) => {
			const originalIndex = presentation.slides.findIndex(
				(s: SlideType) => s.id === filteredSlides[slideIndex].id
			)
			if (originalIndex === -1) return

			const updatedSlides = [...presentation.slides]
			updatedSlides[originalIndex] = updatedSlide

			onPresentationUpdate?.({
				...presentation,
				slides: updatedSlides,
			})
		},
		[presentation, filteredSlides, onPresentationUpdate]
	)

	// Handle element selection with automatic slide activation
	const handleElementSelection = useCallback(
		(slideIndex: number) => (elementIds: string[]) => {
			const selectedSlide = filteredSlides[slideIndex]
			if (!selectedSlide) return

			const originalIndex = presentation.slides.findIndex((s: SlideType) => s.id === selectedSlide.id)

			// If an element is selected and this isn't the active slide, make it active
			if (elementIds.length > 0 && originalIndex !== activeSlideIndex && originalIndex !== -1) {
				onSlideSelect(originalIndex, 'click')
			}

			// Always pass through the element selection
			onSelectedElementIdsChange(elementIds)
		},
		[presentation.slides, filteredSlides, activeSlideIndex, onSlideSelect, onSelectedElementIdsChange]
	)

	// Handle slide click to make it active
	const handleSlideClick = useCallback(
		(slideIndexInFilteredArray: number) => {
			const clickedSlide = filteredSlides[slideIndexInFilteredArray]
			if (!clickedSlide) return

			const originalIndex = presentation.slides.findIndex((s: SlideType) => s.id === clickedSlide.id)

			if (originalIndex !== -1) {
				onSlideSelect(originalIndex, 'click')
				setUserManuallySelectedSlide(true)

				if (manualSelectionTimeoutRef.current) {
					clearTimeout(manualSelectionTimeoutRef.current)
				}
				manualSelectionTimeoutRef.current = setTimeout(() => {
					setUserManuallySelectedSlide(false)
					manualSelectionTimeoutRef.current = null
				}, 1500)
			}
		},
		[presentation.slides, filteredSlides, onSlideSelect]
	)

	// Handle opening template gallery for adding a slide
	const handleOpenTemplateGallery = useCallback((afterIndex: number) => {
		setInsertAfterIndex(afterIndex)
		setIsTemplateGalleryOpen(true)
	}, [])

	// Handle template selection and slide creation
	const handleSelectTemplate = useCallback(
		(template: string) => {
			// Import the template creation logic from page.tsx
			const getLayoutFromTemplate = (tmpl: string): SlideType['layout'] => {
				if (tmpl.includes('two-columns')) return 'two-columns'
				if (tmpl.includes('three-columns')) return 'three-columns'
				if (tmpl === 'blank-card') return 'blank'
				if (tmpl === 'image-and-text' || tmpl === 'text-and-image') return 'image-caption'
				return 'title-content'
			}

			// Use current aspect ratio dimensions
			const slideDimensions =
				slideAspectRatio === '16:9' ? { width: 960, height: 540 } : { width: 960, height: 720 }

			const newSlide: SlideType = {
				id: `slide-${Date.now()}`,
				layout: getLayoutFromTemplate(template),
				width: slideDimensions.width,
				height: slideDimensions.height,
				backgroundColor: '#ffffff',
				transition: { type: 'fade' },
				elements: getElementsForTemplate(template),
			}

			const updatedSlides = [...presentation.slides]
			const insertIndex = insertAfterIndex + 1
			updatedSlides.splice(insertIndex, 0, newSlide)

			onPresentationUpdate?.({
				...presentation,
				slides: updatedSlides,
			})

			onSlideSelect(insertIndex, 'click')

			setIsTemplateGalleryOpen(false)
		},
		[presentation, insertAfterIndex, onPresentationUpdate, onSlideSelect, slideAspectRatio]
	)

	// Add Slide Button Component - restored for contextual insertion
	const AddSlideButton = ({ afterIndex }: { afterIndex: number }) => (
		<div className="flex justify-center">
			<Button
				variant="outline"
				size="sm"
				className="group bg-background/80 backdrop-blur-sm hover:bg-blue-50 border-2 border-dashed border-blue-300 hover:border-blue-500 text-primary hover:text-primary/80 transition-all duration-300 px-6 py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02]"
				onClick={() => handleOpenTemplateGallery(afterIndex)}>
				<Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
				<span className="font-medium">Add Slide</span>
			</Button>
		</div>
	)

	return (
		<div
			className={cn(
				'flex flex-col h-full bg-background',
				isFullscreen && 'fixed inset-0 z-50 bg-background',
				className
			)}>
			{/* Hidden measurement component - renders off-screen to measure actual dimensions */}
			{measurementSlide && (
				<div
					className="absolute top-0 left-[-9999px] opacity-0 pointer-events-none"
					style={{ width: baseWrapperWidth }}>
					<div ref={measurementRef} className="flex flex-col">
						{/* Top spacing */}
						<div style={{ height: 24 }} />

						{/* Slide content */}
						<div
							className="relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group mx-auto flex-shrink-0 shadow-md border border-gray-200"
							style={{
								width: baseWrapperWidth,
								height: baseWrapperHeight,
							}}>
							<div className="w-full h-full overflow-hidden rounded-2xl bg-white">
								<EnhancedSlideEditor
									slide={measurementSlide}
									onUpdateSlide={() => {}} // No-op for measurement
									zoom={finalZoom}
									showGrid={false}
									selectedElementIds={[]}
									onSelectedElementIdsChange={() => {}} // No-op for measurement
								/>
							</div>
						</div>

						{/* Add Slide Button section */}
						<div className="flex justify-center items-center flex-shrink-0" style={{ height: 84 }}>
							<div className="group bg-background/80 backdrop-blur-sm hover:bg-blue-50 border-2 border-dashed border-blue-300 hover:border-blue-500 text-primary hover:text-primary/80 transition-all duration-300 px-6 py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02]">
								<div className="flex items-center">
									<Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
									<span className="font-medium">Add Slide</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Slides List */}
			<div ref={parentRef} className="flex-1 overflow-auto px-4 py-1">
				{(!areContainerDimensionsReady || isInitialMeasurement) && (
					<div className="flex items-center justify-center h-full">
						<div className="text-center space-y-2 text-muted-foreground">
							<p>Calculating optimal layout...</p>
							{/* You could add a spinner here */}
						</div>
					</div>
				)}

				{areContainerDimensionsReady && !isInitialMeasurement && filteredSlides.length === 0 && (
					<div className="flex items-center justify-center h-full">
						<div className="text-center space-y-2">
							<p className="text-muted-foreground">No slides found</p>
							{searchQuery && (
								<Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
									Clear search
								</Button>
							)}
						</div>
					</div>
				)}

				{areContainerDimensionsReady && !isInitialMeasurement && filteredSlides.length > 0 && (
					// Always use virtualized list for consistent performance
					<div
						style={{
							height: virtualizer.getTotalSize(),
							width: '100%',
							position: 'relative',
						}}>
						{virtualizer.getVirtualItems().map((virtualItem: VirtualItem) => {
							const slide = filteredSlides[virtualItem.index]
							// Ensure slide is not undefined before proceeding
							if (!slide || !slide.id) {
								return null
							}
							const originalIndex = presentation.slides.findIndex((s: SlideType) => s.id === slide.id)
							const isActive = originalIndex === activeSlideIndex

							return (
								<div // This is the main container for each virtualized item
									key={virtualItem.key} // Use key from virtualizer
									ref={(el) => {
										if (slide.id && el) {
											slideRefs.current.set(slide.id, el)
										} else if (slide.id) {
											slideRefs.current.delete(slide.id)
										}
									}}
									data-slide-id={slide.id} // Assign data-slide-id here
									className="flex flex-col" // Use flexbox to ensure exact height distribution
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										height: `${(virtualItem as any).size}px`,
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										transform: `translateY(${(virtualItem as any).start}px)`,
									}}>
									{/* Top spacing */}
									<div style={{ height: 24 }} />

									{/* Slide content - exact dimensions */}
									<div // Inner div for slide content and click handling
										className={cn(
											'relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group mx-auto flex-shrink-0',
											// Enhanced shadow and border system
											'shadow-md hover:shadow-xl',
											// Active state with blue accent
											isActive
												? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl border-transparent'
												: 'border border-gray-200 hover:border-gray-300 hover:ring-1 hover:ring-gray-200 hover:ring-offset-1'
										)}
										style={{
											width: baseWrapperWidth,
											height: baseWrapperHeight,
										}}
										onClick={() => handleSlideClick(virtualItem.index)}>
										{/* Enhanced Slide Editor - no padding, fills entire container */}
										<div className="w-full h-full overflow-hidden rounded-2xl bg-white">
											<EnhancedSlideEditor
												slide={slide}
												onUpdateSlide={handleSlideUpdate(virtualItem.index)}
												zoom={finalZoom}
												showGrid={showGrid}
												selectedElementIds={selectedElementIds}
												onSelectedElementIdsChange={handleElementSelection(virtualItem.index)}
											/>
										</div>
									</div>

									{/* Add Slide Button section - exact height to fill remaining space */}
									<div
										className="flex justify-center items-center flex-shrink-0"
										style={{
											height: 84, // Fixed height for button section
										}}>
										<AddSlideButton afterIndex={originalIndex} />
									</div>
								</div>
							)
						})}

						{/* Add button at the very end */}
						{filteredSlides.length > 0 && (
							<div
								style={{
									position: 'absolute',
									top: virtualizer.getTotalSize(),
									left: 0,
									width: '100%',
									height: '84px',
								}}>
								<AddSlideButton afterIndex={presentation.slides.length - 1} />
							</div>
						)}
					</div>
				)}
			</div>

			{/* Template Gallery */}
			<TemplateGallery
				isOpen={isTemplateGalleryOpen}
				onClose={() => setIsTemplateGalleryOpen(false)}
				onSelectTemplate={handleSelectTemplate}
			/>
		</div>
	)
}
