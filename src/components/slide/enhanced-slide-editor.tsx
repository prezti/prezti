'use client'

import type React from 'react'

import { AlignmentGuides } from '@/components/slide/alignment-guides'
import { SlideCanvas } from '@/components/slide/slide-canvas'
import { useHistory } from '@/hooks/use-history'
import { useToast } from '@/hooks/use-toast'
import type { ElementType, SlideType as Slide, ElementType as SlideElement } from '@/lib/types'
import { useThemeStore } from '@/stores/theme-store'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface EnhancedSlideEditorProps {
	slide: Slide
	onUpdateSlide: (slide: Slide) => void
	zoom: number
	showGrid: boolean
	selectedElementIds: string[]
	onSelectedElementIdsChange: (ids: string[]) => void
}

// Changed from export function to export default function
export default function EnhancedSlideEditor({
	slide,
	onUpdateSlide,
	zoom,
	showGrid,
	selectedElementIds,
	onSelectedElementIdsChange,
}: EnhancedSlideEditorProps) {
	const { toast } = useToast()

	// Theme store for theme gallery
	const { openThemeGallery } = useThemeStore()

	// History management for undo/redo
	const {
		state: currentSlide,
		undo,
		redo,
		set: setSlideState,
		reset: resetSlideState,
	} = useHistory(slide)

	const [isDragging, setIsDragging] = useState(false)
	const [isResizing, setIsResizing] = useState(false)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [editingElement, setEditingElement] = useState<{
		id: string
		value: string
		cursorPosition?: { x: number; y: number }
	} | null>(null)
	const [lockedElements, setLockedElements] = useState<string[]>([])

	const editorRef = useRef<HTMLDivElement>(null)

	// Handle updating multiple elements
	const handleUpdateElements = useCallback(
		(updates: Partial<ElementType>[]) => {
			const updatedElements = currentSlide.elements.map((element) => {
				const update = updates.find((u) => u.id === element.id)
				if (update) {
					// Properly merge style objects to avoid overwriting other style properties
					const mergedUpdate = {
						...update,
						style: update.style ? { ...element.style, ...update.style } : element.style,
					}
					return { ...element, ...mergedUpdate }
				}
				return element
			})

			const newSlide = {
				...currentSlide,
				elements: updatedElements,
			}

			setSlideState(newSlide)
			onUpdateSlide(newSlide)
		},
		[currentSlide, onUpdateSlide, setSlideState]
	)

	// Handle lock/unlock element
	const handleLockToggle = useCallback(() => {
		if (selectedElementIds.length === 0) return
		// For simplicity, lock/unlock applies to all selected elements for now
		// A more granular approach might be needed if multiple elements have different lock states.
		const anySelectedLocked = selectedElementIds.some((id) => lockedElements.includes(id))

		if (anySelectedLocked) {
			setLockedElements((prev) => prev.filter((id) => !selectedElementIds.includes(id)))
			toast({
				title: 'Unlocked',
				description: `${selectedElementIds.length} element${
					selectedElementIds.length > 1 ? 's' : ''
				} unlocked`,
			})
		} else {
			setLockedElements((prev) => [...new Set([...prev, ...selectedElementIds])])
			toast({
				title: 'Locked',
				description: `${selectedElementIds.length} element${
					selectedElementIds.length > 1 ? 's' : ''
				} locked`,
			})
		}
	}, [selectedElementIds, lockedElements, toast])

	// Handle alignment functions (moved before keyboard shortcuts to fix dependency order)
	const handleAlignLeft = useCallback(() => {
		if (selectedElementIds.length === 0) return

		const updates = selectedElementIds.map((id: string) => {
			const element = currentSlide.elements.find((el) => el.id === id)
			return {
				id,
				style: {
					...element?.style,
					textAlign: 'left' as const,
				},
			}
		})

		handleUpdateElements(updates)
		toast({
			title: 'Aligned Left',
			description: `${selectedElementIds.length} element${
				selectedElementIds.length > 1 ? 's' : ''
			} aligned to left`,
		})
	}, [selectedElementIds, currentSlide.elements, handleUpdateElements, toast])

	const handleAlignCenter = useCallback(() => {
		if (selectedElementIds.length === 0) return

		const updates = selectedElementIds.map((id: string) => {
			const element = currentSlide.elements.find((el) => el.id === id)
			return {
				id,
				style: {
					...element?.style,
					textAlign: 'center' as const,
				},
			}
		})

		handleUpdateElements(updates)
		toast({
			title: 'Aligned Center',
			description: `${selectedElementIds.length} element${
				selectedElementIds.length > 1 ? 's' : ''
			} aligned to center`,
		})
	}, [selectedElementIds, currentSlide.elements, handleUpdateElements, toast])

	const handleAlignRight = useCallback(() => {
		if (selectedElementIds.length === 0) return

		const updates = selectedElementIds.map((id: string) => {
			const element = currentSlide.elements.find((el) => el.id === id)
			return {
				id,
				style: {
					...element?.style,
					textAlign: 'right' as const,
				},
			}
		})

		handleUpdateElements(updates)
		toast({
			title: 'Aligned Right',
			description: `${selectedElementIds.length} element${
				selectedElementIds.length > 1 ? 's' : ''
			} aligned to right`,
		})
	}, [selectedElementIds, currentSlide.elements, handleUpdateElements, toast])

	// Synchronize history with external slide changes
	useEffect(() => {
		// If the incoming slide prop is different from the current history state,
		// reset the history to this new slide state.
		// This typically happens when the parent component changes the active slide
		// or provides a completely new slide object (e.g., after an external update).
		if (slide.id !== currentSlide.id || JSON.stringify(slide) !== JSON.stringify(currentSlide)) {
			resetSlideState(slide)
		}
	}, [slide, resetSlideState, currentSlide.id, currentSlide]) // Ensure dependencies are correct

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Delete selected elements with Delete key
			if (e.key === 'Delete' && selectedElementIds.length > 0) {
				e.preventDefault()
				const elementsToDelete = selectedElementIds.filter((id) => !lockedElements.includes(id))
				if (elementsToDelete.length === 0) {
					toast({
						title: 'Cannot Delete',
						description: 'Selected elements are locked',
					})
					return
				}

				const newElements = currentSlide.elements.filter((el) => !elementsToDelete.includes(el.id))
				const newSlide = { ...currentSlide, elements: newElements }

				setSlideState(newSlide)
				onUpdateSlide(newSlide)
				onSelectedElementIdsChange([])
				toast({
					title: 'Deleted',
					description: `${elementsToDelete.length} element${
						elementsToDelete.length > 1 ? 's' : ''
					} deleted`,
				})
			}

			// Copy with Ctrl+C
			if (e.ctrlKey && e.key === 'c' && selectedElementIds.length > 0) {
				const elementsToCopy = currentSlide.elements.filter((el: SlideElement) =>
					selectedElementIds.includes(el.id)
				)
				localStorage.setItem('copiedElements', JSON.stringify(elementsToCopy))
			}

			// Paste with Ctrl+V
			if (e.ctrlKey && e.key === 'v') {
				const copiedElementsJSON = localStorage.getItem('copiedElements')
				if (copiedElementsJSON) {
					try {
						const copiedElements = JSON.parse(copiedElementsJSON) as SlideElement[]
						const newElements = copiedElements.map((el: SlideElement) => ({
							...el,
							id: uuidv4(),
							x: el.x + 20,
							y: el.y + 20,
						}))

						const newSlideState = {
							...currentSlide,
							elements: [...currentSlide.elements, ...newElements],
						}
						setSlideState(newSlideState) // Update local history
						onUpdateSlide(newSlideState) // Propagate to parent

						// Select the newly pasted elements globally
						onSelectedElementIdsChange(newElements.map((el) => el.id))
					} catch (error) {
						console.error('Error pasting elements:', error)
					}
				}
			}

			// Duplicate with Ctrl+D - Will be handled globally in page.tsx
			// if (e.ctrlKey && e.key === 'd' && selectedElementIds.length > 0) {
			// e.preventDefault()
			// globalDuplicateHandler() // This would call a prop from page.tsx
			// }

			// Select all with Ctrl+A
			if (e.ctrlKey && e.key === 'a') {
				e.preventDefault()
				if (currentSlide.elements.length > 0) {
					onSelectedElementIdsChange(currentSlide.elements.map((el) => el.id))
				}
			}

			// Alignment shortcuts with Ctrl+Shift
			if (e.ctrlKey && e.shiftKey && selectedElementIds.length > 0) {
				e.preventDefault()
				if (e.key === 'L' || e.key === 'l') handleAlignLeft()
				else if (e.key === 'E' || e.key === 'e') handleAlignCenter()
				else if (e.key === 'R' || e.key === 'r') handleAlignRight()
			}

			// Undo with Ctrl+Z
			if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
				e.preventDefault()
				undo() // Uses local history for the slide
			}

			// Redo with Ctrl+Y or Ctrl+Shift+Z
			if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
				e.preventDefault()
				redo() // Uses local history for the slide
			}

			// Reset to original slide with Ctrl+Shift+R
			if (e.ctrlKey && e.shiftKey && e.key === 'R') {
				// Changed key to 'R' to avoid conflict with redo
				e.preventDefault()
				resetSlideState(slide) // Resets to initial prop slide
				onUpdateSlide(slide) // Ensure parent is notified of reset
				onSelectedElementIdsChange([])
			}

			// Escape key to clear selection and close context menu
			if (e.key === 'Escape') {
				onSelectedElementIdsChange([])
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [
		// handleDeleteElements, // REMOVED
		// handleDuplicateElements, // REMOVED
		handleAlignLeft,
		handleAlignCenter,
		handleAlignRight,
		currentSlide,
		onUpdateSlide,
		selectedElementIds, // CHANGED: now a prop
		onSelectedElementIdsChange, // ADDED
		lockedElements, // ADDED for delete key functionality
		toast,
		undo,
		redo,
		resetSlideState,
		slide, // Added slide to dependency array for resetSlideState
	])

	// Handle element click
	const handleElementClick = useCallback(
		(e: React.MouseEvent, elementId: string) => {
			if (isDragging) return

			if (e.ctrlKey || e.metaKey || e.shiftKey) {
				const newSelection = selectedElementIds.includes(elementId)
					? selectedElementIds.filter((id: string) => id !== elementId) // Added type for id
					: [...selectedElementIds, elementId]
				onSelectedElementIdsChange(newSelection)
			} else {
				onSelectedElementIdsChange([elementId])
			}
		},
		[isDragging, onSelectedElementIdsChange, selectedElementIds] // Added selectedElementIds to dependency array
	)

	// Handle slide click (background)
	const handleSlideClick = () => {
		onSelectedElementIdsChange([])
	}

	// Enhanced drag algorithm with grid snapping and improved performance
	const handleDragStart = (e: React.MouseEvent, elementId: string) => {
		// Only respond to left mouse button
		if (e.button !== 0) return

		// Check if element is locked
		if (lockedElements.includes(elementId)) {
			toast({
				title: 'Element Locked',
				description: 'This element is locked. Unlock it to move.',
			})
			return
		}

		setIsDragging(true)

		// Cache initial state for performance
		const initialState = {
			startX: e.clientX,
			startY: e.clientY,
			startTime: Date.now(),
		}

		// Reset drag offset
		setDragOffset({ x: 0, y: 0 })

		// Handle selection logic
		const currentSelection = [...selectedElementIds]
		let selectionForDrag = currentSelection

		if (!currentSelection.includes(elementId)) {
			if (e.shiftKey) {
				// Add to selection
				selectionForDrag = [...currentSelection, elementId]
				onSelectedElementIdsChange(selectionForDrag)
			} else {
				// Replace selection
				selectionForDrag = [elementId]
				onSelectedElementIdsChange(selectionForDrag)
			}
		}

		// Grid snapping configuration
		const gridSize = 10 // Base grid size
		const snapThreshold = 5 // Snap when within 5px

		const snapToGrid = (value: number, isShiftPressed: boolean) => {
			if (!isShiftPressed || !showGrid) return value
			return Math.round(value / gridSize) * gridSize
		}

		// Performance optimization with throttling
		let lastUpdateTime = 0
		const updateThreshold = 16 // ~60fps
		let isDragActive = false

		const handleDragMove = (moveEvent: MouseEvent) => {
			const now = Date.now()
			if (now - lastUpdateTime < updateThreshold) return
			lastUpdateTime = now

			if (!isDragActive) {
				isDragActive = true
				document.body.style.cursor = 'grabbing'
			}

			// Calculate deltas with zoom compensation
			const rawDeltaX = moveEvent.clientX - initialState.startX
			const rawDeltaY = moveEvent.clientY - initialState.startY

			// Apply grid snapping if enabled
			const deltaX = snapToGrid(rawDeltaX, moveEvent.shiftKey)
			const deltaY = snapToGrid(rawDeltaY, moveEvent.shiftKey)

			// Update drag offset for visual feedback
			setDragOffset({ x: deltaX, y: deltaY })

			// Boundary checking for all dragged elements
			const scaledOffsetX = deltaX / zoom
			const scaledOffsetY = deltaY / zoom
			const slideWidth = currentSlide.width || 960
			const slideHeight = currentSlide.height || 540

			// Check if any element would go out of bounds
			const wouldExceedBounds = selectionForDrag.some((id) => {
				const element = currentSlide.elements.find((el) => el.id === id)
				if (!element) return false

				const newX = (element.x || 0) + scaledOffsetX
				const newY = (element.y || 0) + scaledOffsetY
				const elementWidth = element.width || 100
				const elementHeight = element.height || 50

				return (
					newX < 0 || newY < 0 || newX + elementWidth > slideWidth || newY + elementHeight > slideHeight
				)
			})

			// If would exceed bounds, constrain the movement
			if (wouldExceedBounds) {
				// Calculate maximum allowed movement
				let maxDeltaX = scaledOffsetX
				let maxDeltaY = scaledOffsetY

				selectionForDrag.forEach((id) => {
					const element = currentSlide.elements.find((el) => el.id === id)
					if (!element) return

					const currentX = element.x || 0
					const currentY = element.y || 0
					const elementWidth = element.width || 100
					const elementHeight = element.height || 50

					// Constrain X movement
					if (currentX + scaledOffsetX < 0) {
						maxDeltaX = Math.max(maxDeltaX, -currentX)
					}
					if (currentX + elementWidth + scaledOffsetX > slideWidth) {
						maxDeltaX = Math.min(maxDeltaX, slideWidth - currentX - elementWidth)
					}

					// Constrain Y movement
					if (currentY + scaledOffsetY < 0) {
						maxDeltaY = Math.max(maxDeltaY, -currentY)
					}
					if (currentY + elementHeight + scaledOffsetY > slideHeight) {
						maxDeltaY = Math.min(maxDeltaY, slideHeight - currentY - elementHeight)
					}
				})

				// Update with constrained values
				setDragOffset({ x: maxDeltaX * zoom, y: maxDeltaY * zoom })
			}
		}

		const handleDragEnd = (endEvent: MouseEvent) => {
			isDragActive = false
			document.body.style.cursor = ''

			// Calculate final movement
			const finalDeltaX = (endEvent.clientX - initialState.startX) / zoom
			const finalDeltaY = (endEvent.clientY - initialState.startY) / zoom

			// Apply grid snapping to final position
			const snappedDeltaX = snapToGrid(finalDeltaX, endEvent.shiftKey)
			const snappedDeltaY = snapToGrid(finalDeltaY, endEvent.shiftKey)

			// Apply movement to all selected elements
			const updatedElements = currentSlide.elements.map((element) => {
				if (selectionForDrag.includes(element.id)) {
					const newX = Math.max(
						0,
						Math.min(
							(element.x || 0) + snappedDeltaX,
							(currentSlide.width || 960) - (element.width || 100)
						)
					)
					const newY = Math.max(
						0,
						Math.min(
							(element.y || 0) + snappedDeltaY,
							(currentSlide.height || 540) - (element.height || 50)
						)
					)

					return {
						...element,
						x: newX,
						y: newY,
					}
				}
				return element
			})

			// Batch update
			const newSlideState = { ...currentSlide, elements: updatedElements }
			setSlideState(newSlideState)
			onUpdateSlide(newSlideState)

			// Reset states
			setIsDragging(false)
			setDragOffset({ x: 0, y: 0 })

			// Provide feedback
			// const dragDistance = Math.sqrt(finalDeltaX * finalDeltaX + finalDeltaY * finalDeltaY)

			// Clean up listeners
			document.removeEventListener('mousemove', handleDragMove)
			document.removeEventListener('mouseup', handleDragEnd)
		}

		// Add optimized event listeners
		document.addEventListener('mousemove', handleDragMove, { passive: true })
		document.addEventListener('mouseup', handleDragEnd, { passive: true })
	}

	// Enhanced resize algorithm with improved performance and accuracy
	const handleResizeStart = (e: React.MouseEvent, elementId: string, direction: string) => {
		e.stopPropagation()
		if (lockedElements.includes(elementId)) {
			toast({
				title: 'Element Locked',
				description: 'This element is locked. Unlock it to resize.',
			})
			return
		}

		const element = currentSlide.elements.find((el) => el.id === elementId)
		if (!element) return

		setIsResizing(true)
		onSelectedElementIdsChange([elementId])

		// Cache initial values for better performance
		const initialState = {
			startX: e.clientX,
			startY: e.clientY,
			startWidth: element.width || 100,
			startHeight: element.height || 50,
			startPosX: element.x || 0,
			startPosY: element.y || 0,
			aspectRatio: (element.width || 100) / (element.height || 50),
		}

		// Enhanced constraints
		const constraints = {
			minSize: 20,
			maxSize: Math.max(currentSlide.width || 960, currentSlide.height || 540),
			slideWidth: currentSlide.width || 960,
			slideHeight: currentSlide.height || 540,
		}

		// Optimized resize calculation function
		const calculateNewDimensions = (deltaX: number, deltaY: number, isShiftPressed: boolean) => {
			let newWidth = initialState.startWidth
			let newHeight = initialState.startHeight
			let newX = initialState.startPosX
			let newY = initialState.startPosY

			// Apply zoom compensation once
			const scaledDeltaX = deltaX / zoom
			const scaledDeltaY = deltaY / zoom

			// Direction-specific calculations with improved accuracy
			switch (direction) {
				case 'top-left':
					newWidth = Math.max(constraints.minSize, initialState.startWidth - scaledDeltaX)
					newHeight = Math.max(constraints.minSize, initialState.startHeight - scaledDeltaY)

					if (isShiftPressed) {
						// Improved proportional resizing
						const widthScale = newWidth / initialState.startWidth
						const heightScale = newHeight / initialState.startHeight
						const uniformScale = Math.min(widthScale, heightScale)

						newWidth = initialState.startWidth * uniformScale
						newHeight = initialState.startHeight * uniformScale
					}

					// Position adjustment for top-left anchor
					newX = initialState.startPosX + (initialState.startWidth - newWidth)
					newY = initialState.startPosY + (initialState.startHeight - newHeight)
					break

				case 'top-right':
					newWidth = Math.max(constraints.minSize, initialState.startWidth + scaledDeltaX)
					newHeight = Math.max(constraints.minSize, initialState.startHeight - scaledDeltaY)

					if (isShiftPressed) {
						const widthScale = newWidth / initialState.startWidth
						const heightScale = newHeight / initialState.startHeight
						const uniformScale = Math.min(widthScale, heightScale)

						newWidth = initialState.startWidth * uniformScale
						newHeight = initialState.startHeight * uniformScale
					}

					// Position adjustment for top anchor
					newY = initialState.startPosY + (initialState.startHeight - newHeight)
					break

				case 'bottom-left':
					newWidth = Math.max(constraints.minSize, initialState.startWidth - scaledDeltaX)
					newHeight = Math.max(constraints.minSize, initialState.startHeight + scaledDeltaY)

					if (isShiftPressed) {
						const widthScale = newWidth / initialState.startWidth
						const heightScale = newHeight / initialState.startHeight
						const uniformScale = Math.min(widthScale, heightScale)

						newWidth = initialState.startWidth * uniformScale
						newHeight = initialState.startHeight * uniformScale
					}

					// Position adjustment for left anchor
					newX = initialState.startPosX + (initialState.startWidth - newWidth)
					break

				case 'bottom-right':
					newWidth = Math.max(constraints.minSize, initialState.startWidth + scaledDeltaX)
					newHeight = Math.max(constraints.minSize, initialState.startHeight + scaledDeltaY)

					if (isShiftPressed) {
						const widthScale = newWidth / initialState.startWidth
						const heightScale = newHeight / initialState.startHeight
						const uniformScale = Math.max(widthScale, heightScale)

						newWidth = initialState.startWidth * uniformScale
						newHeight = initialState.startHeight * uniformScale
					}
					break

				case 'top':
					newHeight = Math.max(constraints.minSize, initialState.startHeight - scaledDeltaY)
					newY = initialState.startPosY + (initialState.startHeight - newHeight)
					break

				case 'bottom':
					newHeight = Math.max(constraints.minSize, initialState.startHeight + scaledDeltaY)
					break

				case 'left':
					newWidth = Math.max(constraints.minSize, initialState.startWidth - scaledDeltaX)
					newX = initialState.startPosX + (initialState.startWidth - newWidth)
					break

				case 'right':
					newWidth = Math.max(constraints.minSize, initialState.startWidth + scaledDeltaX)
					break

				default:
					return null // Invalid direction
			}

			// Enhanced boundary checking with elastic constraints
			const elasticFactor = 0.9 // Allow slight overshoot for better UX

			// Boundary enforcement
			if (newX < 0) {
				const overflow = Math.abs(newX)
				newWidth = Math.max(constraints.minSize, newWidth - overflow)
				newX = 0
			}

			if (newY < 0) {
				const overflow = Math.abs(newY)
				newHeight = Math.max(constraints.minSize, newHeight - overflow)
				newY = 0
			}

			if (newX + newWidth > constraints.slideWidth) {
				newWidth = Math.max(constraints.minSize, constraints.slideWidth - newX)
			}

			if (newY + newHeight > constraints.slideHeight) {
				newHeight = Math.max(constraints.minSize, constraints.slideHeight - newY)
			}

			// Apply maximum size constraints
			newWidth = Math.min(newWidth, constraints.maxSize)
			newHeight = Math.min(newHeight, constraints.maxSize)

			return { newWidth, newHeight, newX, newY }
		}

		// Throttled update function for better performance
		let lastUpdateTime = 0
		const updateThreshold = 16 // ~60fps

		const handleResizeMove = (moveEvent: MouseEvent) => {
			const now = Date.now()
			if (now - lastUpdateTime < updateThreshold) return
			lastUpdateTime = now

			const deltaX = moveEvent.clientX - initialState.startX
			const deltaY = moveEvent.clientY - initialState.startY
			const isShiftPressed = moveEvent.shiftKey

			const newDimensions = calculateNewDimensions(deltaX, deltaY, isShiftPressed)
			if (!newDimensions) return

			const { newWidth, newHeight, newX, newY } = newDimensions

			// Batch DOM updates for better performance
			requestAnimationFrame(() => {
				const updatedElements = currentSlide.elements.map((el) => {
					if (el.id === elementId) {
						return {
							...el,
							width: newWidth,
							height: newHeight,
							x: newX,
							y: newY,
						}
					}
					return el
				})

				const newSlideState = { ...currentSlide, elements: updatedElements }
				setSlideState(newSlideState)
				onUpdateSlide(newSlideState)
			})
		}

		const handleResizeEnd = () => {
			setIsResizing(false)
			document.removeEventListener('mousemove', handleResizeMove)
			document.removeEventListener('mouseup', handleResizeEnd)
		}

		// Use passive listeners for better performance
		document.addEventListener('mousemove', handleResizeMove, { passive: true })
		document.addEventListener('mouseup', handleResizeEnd, { passive: true })
	}

	// Handle bring to front
	const handleBringToFront = () => {
		if (selectedElementIds.length === 0) return
		const elementsToMove = currentSlide.elements.filter((el) => selectedElementIds.includes(el.id))
		const otherElements = currentSlide.elements.filter((el) => !selectedElementIds.includes(el.id))
		const newElements = [...otherElements, ...elementsToMove]
		const newSlideState = { ...currentSlide, elements: newElements }
		setSlideState(newSlideState)
		onUpdateSlide(newSlideState)
		toast({
			title: 'Brought to Front',
			description: `${elementsToMove.length} element${
				elementsToMove.length > 1 ? 's' : ''
			} moved to front`,
		})
	}

	// Handle send to back
	const handleSendToBack = () => {
		if (selectedElementIds.length === 0) return
		const elementsToMove = currentSlide.elements.filter((el) => selectedElementIds.includes(el.id))
		const otherElements = currentSlide.elements.filter((el) => !selectedElementIds.includes(el.id))
		const newElements = [...elementsToMove, ...otherElements]
		const newSlideState = { ...currentSlide, elements: newElements }
		setSlideState(newSlideState)
		onUpdateSlide(newSlideState)
		toast({
			title: 'Sent to Back',
			description: `${elementsToMove.length} element${
				elementsToMove.length > 1 ? 's' : ''
			} moved to back`,
		})
	}

	// Handle starting inline editing
	const handleStartEditing = useCallback(
		(elementId: string, initialValue: string, clickPosition?: { x: number; y: number }) => {
			setEditingElement({ id: elementId, value: initialValue, cursorPosition: clickPosition })
		},
		[]
	)

	// Handle inline editing updates (real-time)
	const handleInlineEditUpdate = useCallback((elementId: string, newValue: string) => {
		setEditingElement((prev) => (prev ? { ...prev, value: newValue, cursorPosition: undefined } : null))
	}, [])

	// Save text edit
	const handleSaveTextEdit = useCallback(
		(newContent: string) => {
			if (!editingElement) return

			const updatedElements = currentSlide.elements.map((element) => {
				if (element.id === editingElement.id) {
					// Handle different content types
					let content: string | string[]
					if (element.type === 'bullet-list' || element.type === 'numbered-list') {
						content = newContent.split('\n').filter((line) => line.trim())
					} else {
						content = newContent
					}

					return { ...element, content }
				}
				return element
			})

			const newSlideState = { ...currentSlide, elements: updatedElements }
			setSlideState(newSlideState)
			onUpdateSlide(newSlideState)

			setEditingElement(null)
		},
		[editingElement, currentSlide, onUpdateSlide, setSlideState]
	)

	// Handle ending inline editing
	const handleCancelEdit = useCallback(() => {
		if (editingElement) {
			// Save the final value
			handleSaveTextEdit(editingElement.value)
		}
	}, [editingElement, handleSaveTextEdit])

	// Add handler for double click to initiate direct editing (legacy support)
	const handleDoubleClick = useCallback(
		(elementId: string) => {
			const element = currentSlide.elements.find((el) => el.id === elementId)
			if (element && ['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type)) {
				const content = Array.isArray(element.content)
					? element.content.join('\n')
					: element.content?.toString() || ''
				setEditingElement({ id: elementId, value: content })
			}
		},
		[currentSlide.elements]
	)

	// Handle edit properties (open text editor for text elements)
	const handleEditProperties = useCallback(() => {
		if (selectedElementIds.length === 0) return

		const elementId = selectedElementIds[0]
		const element = currentSlide.elements.find((el) => el.id === elementId)

		if (element && ['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type)) {
			// Open text editor
			handleDoubleClick(elementId)
		} else {
			toast({
				title: 'Edit Properties',
				description: 'Use the enhanced toolbar below to modify this element',
			})
		}
	}, [selectedElementIds, currentSlide.elements, toast, handleDoubleClick])

	// Fixed type signature to match expected parameter order in SlideCanvas
	const handleElementSelectionForCanvas = useCallback(
		// Renamed to avoid confusion with local handleElementClick
		(e: React.MouseEvent, elementId: string) => {
			handleElementClick(e, elementId) // Uses the modified handleElementClick which calls onSelectedElementIdsChange

			if (selectedElementIds.length === 0) {
				// Check based on prop after update
			}
		},
		[handleElementClick, selectedElementIds] // Depend on selectedElementIds prop
	)

	// Enhanced rotation algorithm with improved precision and performance
	const handleRotateStart = (e: React.MouseEvent, elementId: string) => {
		e.stopPropagation()
		if (lockedElements.includes(elementId)) {
			toast({
				title: 'Element Locked',
				description: 'This element is locked. Unlock it to rotate.',
			})
			return
		}

		const element = currentSlide.elements.find((el) => el.id === elementId)
		if (!element) return

		onSelectedElementIdsChange([elementId])

		// Cache initial state for better performance
		const initialState = {
			startAngle: element.rotation || 0,
			centerX: (element.x || 0) + (element.width || 100) / 2,
			centerY: (element.y || 0) + (element.height || 50) / 2,
		}

		// Get editor bounds for accurate calculations
		const rect = editorRef.current?.getBoundingClientRect()
		if (!rect) return

		// Optimized angle calculation function
		const getAngleFromMouse = (clientX: number, clientY: number) => {
			const mouseX = (clientX - rect.left) / zoom - initialState.centerX
			const mouseY = (clientY - rect.top) / zoom - initialState.centerY
			return Math.atan2(mouseY, mouseX) * (180 / Math.PI)
		}

		const startMouseAngle = getAngleFromMouse(e.clientX, e.clientY)

		// Enhanced angle snapping with multiple snap points
		const snapAngle = (angle: number, isShiftPressed: boolean) => {
			if (!isShiftPressed) return angle

			const snapIncrements = [15, 30, 45, 90] // Multiple snap options
			const primarySnap = 15 // Primary snap increment

			// Find closest snap point
			const normalizedAngle = ((angle % 360) + 360) % 360
			const snapPoint = Math.round(normalizedAngle / primarySnap) * primarySnap

			return snapPoint
		}

		// Throttled update for better performance
		let lastUpdateTime = 0
		const updateThreshold = 16 // ~60fps
		let isRotating = false

		const handleRotateMove = (moveEvent: MouseEvent) => {
			const now = Date.now()
			if (now - lastUpdateTime < updateThreshold) return
			lastUpdateTime = now

			if (!isRotating) {
				isRotating = true
				// Change cursor to indicate rotation in progress
				document.body.style.cursor = 'grabbing'
			}

			const currentMouseAngle = getAngleFromMouse(moveEvent.clientX, moveEvent.clientY)
			const deltaAngle = currentMouseAngle - startMouseAngle
			let newRotation = initialState.startAngle + deltaAngle

			// Apply angle snapping
			newRotation = snapAngle(newRotation, moveEvent.shiftKey)

			// Normalize to 0-360 range
			newRotation = ((newRotation % 360) + 360) % 360

			// Batch DOM updates
			requestAnimationFrame(() => {
				const updatedElements = currentSlide.elements.map((el) => {
					if (el.id === elementId) {
						return { ...el, rotation: newRotation }
					}
					return el
				})

				const newSlideState = { ...currentSlide, elements: updatedElements }
				setSlideState(newSlideState)
				onUpdateSlide(newSlideState)
			})
		}

		const handleRotateEnd = () => {
			isRotating = false
			document.body.style.cursor = ''

			// Get final rotation for feedback
			const finalElement = currentSlide.elements.find((el) => el.id === elementId)
			const finalRotation = finalElement?.rotation || 0

			document.removeEventListener('mousemove', handleRotateMove)
			document.removeEventListener('mouseup', handleRotateEnd)
		}

		// Add optimized event listeners
		document.addEventListener('mousemove', handleRotateMove, { passive: true })
		document.addEventListener('mouseup', handleRotateEnd, { passive: true })
	}

	return (
		<div className="flex flex-col h-full w-full relative">
			{/* Editor Canvas */}
			<div ref={editorRef} className="flex-1 overflow-hidden w-full h-full">
				<SlideCanvas
					slide={currentSlide}
					zoom={zoom}
					showGrid={showGrid}
					isDragging={isDragging}
					selectedElements={selectedElementIds}
					lockedElements={lockedElements}
					dragOffset={dragOffset}
					onSlideClick={handleSlideClick}
					onElementClick={handleElementSelectionForCanvas}
					onDragStart={handleDragStart}
					onUpdateSlide={onUpdateSlide}
					onSelectedElementIdsChange={onSelectedElementIdsChange}
					onResizeStart={handleResizeStart}
					onDoubleClick={handleDoubleClick}
					editingElement={editingElement}
					onStartEditing={handleStartEditing}
					onSaveEdit={handleInlineEditUpdate}
					onCancelEdit={handleCancelEdit}
					onRotateStart={handleRotateStart}
					onBringToFront={handleBringToFront}
					onSendToBack={handleSendToBack}
					onLockToggle={handleLockToggle}
					onAlignLeft={handleAlignLeft}
					onAlignCenter={handleAlignCenter}
					onAlignRight={handleAlignRight}
					onOpenThemeGallery={openThemeGallery}
				/>
			</div>

			{/* Alignment Guides */}
			{isDragging &&
				selectedElementIds.length > 0 && ( // Use selectedElementIds prop
					<div className="absolute inset-0 pointer-events-none" style={{ zIndex: 999 }}>
						<AlignmentGuides
							elements={currentSlide.elements}
							draggedElementId={selectedElementIds[0] || null} // Use selectedElementIds prop
							dragOffset={dragOffset}
							zoom={zoom}
							canvasWidth={currentSlide.width || 960}
							canvasHeight={currentSlide.height || 540}
						/>
					</div>
				)}
		</div>
	)
}
