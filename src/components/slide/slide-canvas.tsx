'use client'

import { generateBackgroundStyle, getSlideEffectiveTheme } from '@/lib/theme-utils'
import type { ElementType, SlideType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme-store'
import * as React from 'react'
import { useRef, useState } from 'react'
import { CanvasContextMenu, ElementContextMenu } from './context-menu'
import { ElementSelectionOverlay } from './element-selection-overlay'

interface SlideCanvasProps {
	slide: SlideType
	zoom: number
	showGrid: boolean
	isDragging: boolean
	selectedElements: string[]
	lockedElements?: string[]
	dragOffset: { x: number; y: number }
	onSlideClick: () => void
	onElementClick: (e: React.MouseEvent, elementId: string) => void
	onDragStart: (e: React.MouseEvent, elementId: string) => void
	onUpdateSlide: (slide: SlideType) => void
	onSelectedElementIdsChange: (ids: string[]) => void
	onResizeStart: (e: React.MouseEvent, elementId: string, direction: string) => void
	onRotateStart?: (e: React.MouseEvent, elementId: string) => void
	onDoubleClick?: (elementId: string, e: React.MouseEvent) => void
	editingElement?: { id: string; value: string; cursorPosition?: { x: number; y: number } } | null
	onStartEditing?: (
		elementId: string,
		initialValue: string,
		clickPosition?: { x: number; y: number }
	) => void
	onSaveEdit?: (elementId: string, newValue: string) => void
	onCancelEdit?: () => void
	onBringToFront?: () => void
	onSendToBack?: () => void
	onLockToggle?: () => void
	onAlignLeft?: () => void
	onAlignCenter?: () => void
	onAlignRight?: () => void
	onOpenThemeGallery?: () => void
}

// Helper function to parse fontSize from any unit to pixels
const parseFontSize = (fontSize: string | number | undefined): number => {
	if (!fontSize) return 24 // Default

	// If it's already a number, return it
	if (typeof fontSize === 'number') {
		return fontSize
	}

	// Handle rem units
	if (fontSize.endsWith('rem')) {
		const remValue = parseFloat(fontSize)
		return remValue * 16 // 1rem = 16px by default
	}

	// Handle px units or just numbers
	return parseInt(fontSize, 10) || 24
}

export function SlideCanvas({
	slide,
	zoom,
	showGrid,
	isDragging,
	selectedElements,
	lockedElements = [],
	dragOffset,
	onSlideClick,
	onElementClick,
	onDragStart,
	onUpdateSlide,
	onSelectedElementIdsChange,
	onResizeStart,
	onRotateStart,
	onDoubleClick,
	editingElement,
	onStartEditing,
	onSaveEdit,
	onCancelEdit,
	onBringToFront,
	onSendToBack,
	onLockToggle,
	onAlignLeft,
	onAlignCenter,
	onAlignRight,
	onOpenThemeGallery,
}: SlideCanvasProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isCanvasHovered, setIsCanvasHovered] = useState(false)
	const isDragInProgress = useRef(false)
	const cursorPositioned = useRef<string | null>(null)

	// Get theme from store
	const { globalTheme } = useThemeStore()

	// Calculate effective theme for this slide
	const effectiveTheme = getSlideEffectiveTheme(slide, globalTheme)

	// Generate theme background style
	const themeBackgroundStyle = effectiveTheme ? generateBackgroundStyle(effectiveTheme) : {}

	// Calculate container-based zoom - the slide should fill the available container
	// This works with the responsive sizing from the parent component
	const containerBasedZoom = zoom

	// Calculate the actual slide dimensions based on zoom
	const actualSlideWidth = (slide.width || 960) * containerBasedZoom
	const actualSlideHeight = (slide.height || 540) * containerBasedZoom

	// Render different element types with HTML/CSS
	const renderHtmlElement = (element: ElementType) => {
		const isSelected = selectedElements.includes(element.id)

		// Enhanced color handling - try multiple sources for color
		let elementColor = element.style?.color || '#000000'

		// Ensure text is never invisible - force dark color if too light
		if (elementColor === '#ffffff' || elementColor === 'white' || elementColor === '#f0f0f0') {
			elementColor = '#000000'
		}

		// Calculate position and size with zoom and drag offset
		let x = (element.x || 0) * containerBasedZoom
		let y = (element.y || 0) * containerBasedZoom
		const width = (element.width || 100) * containerBasedZoom
		const height = (element.height || 50) * containerBasedZoom

		// Apply drag offset if selected and dragging
		if (isDragging && isSelected) {
			x += dragOffset.x
			y += dragOffset.y
		}

		// Common styles for all elements
		const commonStyle: React.CSSProperties = {
			position: 'absolute',
			left: x,
			top: y,
			width: width,
			height: height,
			transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
			cursor: 'pointer',
			userSelect: 'none',
		}

		// Add visual hint for text elements when selected
		const isTextElement = ['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type)
		const textElementStyle = commonStyle // Removed dashed outline since we have the selection overlay

		const handleClick = (e: React.MouseEvent) => {
			e.stopPropagation()

			// Don't handle clicks immediately after dragging
			if (isDragInProgress.current) {
				isDragInProgress.current = false
				return
			}

			// Check if element is already selected and this is a text element
			const isAlreadySelected = selectedElements.includes(element.id)
			if (
				isAlreadySelected &&
				['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type) &&
				onStartEditing
			) {
				// Start inline editing immediately with cursor positioning
				const content = Array.isArray(element.content)
					? element.content.join('\n')
					: element.content?.toString() || ''

				// Calculate cursor position based on click location
				const elementRect = (e.target as HTMLElement).getBoundingClientRect()
				const clickX = e.clientX - elementRect.left
				const clickY = e.clientY - elementRect.top

				onStartEditing(element.id, content, { x: clickX, y: clickY })
				return
			}

			// Otherwise, handle normal click selection
			onElementClick(e, element.id)
		}

		const handleMouseDown = (e: React.MouseEvent) => {
			e.stopPropagation()

			// Add a small delay to differentiate between click and drag
			// This helps with mobile touch interactions
			const startX = e.clientX
			const startY = e.clientY
			let isDragStarted = false

			const handleMouseMove = (moveEvent: MouseEvent) => {
				const deltaX = Math.abs(moveEvent.clientX - startX)
				const deltaY = Math.abs(moveEvent.clientY - startY)

				// Only start drag if moved more than 5 pixels
				if ((deltaX > 5 || deltaY > 5) && !isDragStarted) {
					isDragStarted = true
					// Mark that a drag is in progress
					isDragInProgress.current = true
					// Clean up listeners before starting drag
					document.removeEventListener('mousemove', handleMouseMove)
					document.removeEventListener('mouseup', handleMouseUp)
					// Start the actual drag operation
					onDragStart(e, element.id)
				}
			}

			const handleMouseUp = () => {
				// Clean up listeners
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
			}

			// Add temporary listeners to detect drag intent
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		const handleDoubleClick = (e: React.MouseEvent) => {
			e.stopPropagation()

			// For text elements, start inline editing
			if (
				['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type) &&
				onStartEditing
			) {
				const content = Array.isArray(element.content)
					? element.content.join('\n')
					: element.content?.toString() || ''

				// Calculate cursor position for double-click
				const elementRect = (e.target as HTMLElement).getBoundingClientRect()
				const clickX = e.clientX - elementRect.left
				const clickY = e.clientY - elementRect.top

				onStartEditing(element.id, content, { x: clickX, y: clickY })
				return
			}

			// Fallback to original double click handler
			if (onDoubleClick) {
				onDoubleClick(element.id, e)
			}
		}

		// Check if this element is being edited
		const isBeingEdited = editingElement?.id === element.id

		// Reset cursor positioning when editing ends
		if (!isBeingEdited && cursorPositioned.current === element.id) {
			cursorPositioned.current = null
		}

		switch (element.type) {
			case 'heading':
				if (isBeingEdited) {
					return (
						<textarea
							key={element.id}
							ref={(textarea) => {
								if (
									textarea &&
									editingElement?.cursorPosition &&
									cursorPositioned.current !== element.id
								) {
									// Only position cursor once per element edit session
									cursorPositioned.current = element.id
									textarea.focus()

									// Use setTimeout to ensure focus is complete before positioning cursor
									setTimeout(() => {
										// Calculate approximate cursor position
										const text = editingElement.value || ''
										const lines = text.split('\n')
										const fontSize = parseFontSize(element.style?.fontSize) * containerBasedZoom
										const lineHeight = fontSize * 1.2
										const charWidth = fontSize * 0.6 // Approximate character width

										// Estimate which line was clicked
										const clickedLine = Math.floor(editingElement.cursorPosition!.y / lineHeight)
										const targetLine = Math.min(clickedLine, lines.length - 1)

										// Estimate character position within the line
										const lineText = lines[targetLine] || ''
										const clickedChar = Math.floor(editingElement.cursorPosition!.x / charWidth)
										const targetChar = Math.min(clickedChar, lineText.length)

										// Calculate absolute cursor position
										let cursorPosition = 0
										for (let i = 0; i < targetLine; i++) {
											cursorPosition += lines[i].length + 1 // +1 for newline
										}
										cursorPosition += targetChar

										// Set cursor position
										textarea.setSelectionRange(cursorPosition, cursorPosition)
									}, 0)
								} else if (textarea) {
									// Default behavior - focus only
									textarea.focus()
								}
							}}
							style={{
								...commonStyle,
								color: elementColor,
								fontSize: parseFontSize(element.style?.fontSize) * containerBasedZoom,
								fontWeight: 'bold',
								textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
								padding: 5 * containerBasedZoom,
								border: '2px solid #3b82f6',
								borderRadius: 4 * containerBasedZoom,
								resize: 'none',
								background: 'rgba(255, 255, 255, 0.95)',
								zIndex: 1000,
								cursor: 'text',
								userSelect: 'text',
							}}
							value={editingElement?.value || ''}
							onChange={(e) => {
								if (editingElement && onSaveEdit) {
									// Update the editing state immediately for responsiveness
									onSaveEdit(element.id, e.target.value)
								}
							}}
							onBlur={() => {
								onCancelEdit?.()
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									onCancelEdit?.()
								} else if (e.key === 'Escape') {
									e.preventDefault()
									onCancelEdit?.()
								}
							}}
						/>
					)
				}

				return (
					<ElementContextMenu
						key={element.id}
						element={element}
						slide={slide}
						selectedElements={selectedElements}
						lockedElements={lockedElements}
						onUpdateSlide={onUpdateSlide}
						onSelectedElementIdsChange={onSelectedElementIdsChange}
						onBringToFront={onBringToFront}
						onSendToBack={onSendToBack}
						onLockToggle={onLockToggle}
						onAlignLeft={onAlignLeft}
						onAlignCenter={onAlignCenter}
						onAlignRight={onAlignRight}
						onStartEditing={onStartEditing}>
						<div
							data-element-id={element.id}
							style={{
								...textElementStyle,
								color: elementColor,
								fontSize: parseFontSize(element.style?.fontSize) * containerBasedZoom,
								fontWeight: 'bold',
								textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
								padding: 5 * containerBasedZoom,
								overflow: 'hidden',
								wordWrap: 'break-word',
								whiteSpace: 'pre-wrap',
							}}
							onClick={handleClick}
							onMouseDown={handleMouseDown}
							onDoubleClick={handleDoubleClick}>
							{element.content?.toString() || ''}
						</div>
					</ElementContextMenu>
				)

			case 'paragraph':
				if (isBeingEdited) {
					return (
						<textarea
							key={element.id}
							ref={(textarea) => {
								if (
									textarea &&
									editingElement?.cursorPosition &&
									cursorPositioned.current !== element.id
								) {
									// Only position cursor once per element edit session
									cursorPositioned.current = element.id
									textarea.focus()

									// Use setTimeout to ensure focus is complete before positioning cursor
									setTimeout(() => {
										// Calculate approximate cursor position
										const text = editingElement.value || ''
										const lines = text.split('\n')
										const fontSize = parseFontSize(element.style?.fontSize) * containerBasedZoom
										const lineHeight = fontSize * 1.2
										const charWidth = fontSize * 0.6 // Approximate character width

										// Estimate which line was clicked
										const clickedLine = Math.floor(editingElement.cursorPosition!.y / lineHeight)
										const targetLine = Math.min(clickedLine, lines.length - 1)

										// Estimate character position within the line
										const lineText = lines[targetLine] || ''
										const clickedChar = Math.floor(editingElement.cursorPosition!.x / charWidth)
										const targetChar = Math.min(clickedChar, lineText.length)

										// Calculate absolute cursor position
										let cursorPosition = 0
										for (let i = 0; i < targetLine; i++) {
											cursorPosition += lines[i].length + 1 // +1 for newline
										}
										cursorPosition += targetChar

										// Set cursor position
										textarea.setSelectionRange(cursorPosition, cursorPosition)
									}, 0)
								} else if (textarea) {
									// Default behavior - focus only
									textarea.focus()
								}
							}}
							style={{
								...commonStyle,
								color: elementColor,
								fontSize: parseFontSize(element.style?.fontSize) * containerBasedZoom,
								textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
								padding: 5 * containerBasedZoom,
								border: '2px solid #3b82f6',
								borderRadius: 4 * containerBasedZoom,
								resize: 'none',
								background: 'rgba(255, 255, 255, 0.95)',
								zIndex: 1000,
								cursor: 'text',
								userSelect: 'text',
							}}
							value={editingElement?.value || ''}
							onChange={(e) => {
								if (editingElement && onSaveEdit) {
									onSaveEdit(element.id, e.target.value)
								}
							}}
							onBlur={() => {
								onCancelEdit?.()
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									onCancelEdit?.()
								} else if (e.key === 'Escape') {
									e.preventDefault()
									onCancelEdit?.()
								}
							}}
						/>
					)
				}

				return (
					<ElementContextMenu
						key={element.id}
						element={element}
						slide={slide}
						selectedElements={selectedElements}
						lockedElements={lockedElements}
						onUpdateSlide={onUpdateSlide}
						onSelectedElementIdsChange={onSelectedElementIdsChange}
						onBringToFront={onBringToFront}
						onSendToBack={onSendToBack}
						onLockToggle={onLockToggle}
						onAlignLeft={onAlignLeft}
						onAlignCenter={onAlignCenter}
						onAlignRight={onAlignRight}
						onStartEditing={onStartEditing}>
						<div
							data-element-id={element.id}
							style={{
								...textElementStyle,
								color: elementColor,
								fontSize: parseFontSize(element.style?.fontSize) * containerBasedZoom,
								textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
								padding: 5 * containerBasedZoom,
								overflow: 'hidden',
								wordWrap: 'break-word',
								whiteSpace: 'pre-wrap',
							}}
							onClick={handleClick}
							onMouseDown={handleMouseDown}
							onDoubleClick={handleDoubleClick}>
							{element.content?.toString() || ''}
						</div>
					</ElementContextMenu>
				)

			case 'bullet-list':
			case 'numbered-list':
				if (isBeingEdited) {
					return (
						<textarea
							key={element.id}
							ref={(textarea) => {
								if (
									textarea &&
									editingElement?.cursorPosition &&
									cursorPositioned.current !== element.id
								) {
									// Only position cursor once per element edit session
									cursorPositioned.current = element.id
									textarea.focus()

									// Use setTimeout to ensure focus is complete before positioning cursor
									setTimeout(() => {
										// Calculate approximate cursor position
										const text = editingElement.value || ''
										const lines = text.split('\n')
										const fontSize = parseFontSize(element.style?.fontSize) * containerBasedZoom
										const lineHeight = fontSize * 1.2
										const charWidth = fontSize * 0.6 // Approximate character width

										// Estimate which line was clicked
										const clickedLine = Math.floor(editingElement.cursorPosition!.y / lineHeight)
										const targetLine = Math.min(clickedLine, lines.length - 1)

										// Estimate character position within the line
										const lineText = lines[targetLine] || ''
										const clickedChar = Math.floor(editingElement.cursorPosition!.x / charWidth)
										const targetChar = Math.min(clickedChar, lineText.length)

										// Calculate absolute cursor position
										let cursorPosition = 0
										for (let i = 0; i < targetLine; i++) {
											cursorPosition += lines[i].length + 1 // +1 for newline
										}
										cursorPosition += targetChar

										// Set cursor position
										textarea.setSelectionRange(cursorPosition, cursorPosition)
									}, 0)
								} else if (textarea) {
									// Default behavior - focus only
									textarea.focus()
								}
							}}
							style={{
								...commonStyle,
								color: elementColor,
								fontSize: parseFontSize(element.style?.fontSize) * containerBasedZoom,
								textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
								padding: 5 * containerBasedZoom,
								border: '2px solid #3b82f6',
								borderRadius: 4 * containerBasedZoom,
								resize: 'none',
								background: 'rgba(255, 255, 255, 0.95)',
								zIndex: 1000,
								cursor: 'text',
								userSelect: 'text',
							}}
							value={editingElement?.value || ''}
							onChange={(e) => {
								if (editingElement && onSaveEdit) {
									onSaveEdit(element.id, e.target.value)
								}
							}}
							onBlur={() => {
								onCancelEdit?.()
							}}
							onKeyDown={(e) => {
								if (e.key === 'Escape') {
									e.preventDefault()
									onCancelEdit?.()
								}
								// Allow Enter for new lines in lists
							}}
							placeholder="Enter each item on a new line"
						/>
					)
				}

				const items = Array.isArray(element.content) ? element.content : []
				return (
					<ElementContextMenu
						key={element.id}
						element={element}
						slide={slide}
						selectedElements={selectedElements}
						lockedElements={lockedElements}
						onUpdateSlide={onUpdateSlide}
						onSelectedElementIdsChange={onSelectedElementIdsChange}
						onBringToFront={onBringToFront}
						onSendToBack={onSendToBack}
						onLockToggle={onLockToggle}
						onAlignLeft={onAlignLeft}
						onAlignCenter={onAlignCenter}
						onAlignRight={onAlignRight}
						onStartEditing={onStartEditing}>
						<div
							data-element-id={element.id}
							style={{
								...textElementStyle,
								color: elementColor,
								fontSize: parseFontSize(element.style?.fontSize) * containerBasedZoom,
								textAlign: (element.style?.textAlign as React.CSSProperties['textAlign']) || 'left',
								padding: 5 * containerBasedZoom,
								overflow: 'hidden',
								wordWrap: 'break-word',
								whiteSpace: 'pre-wrap',
							}}
							onClick={handleClick}
							onMouseDown={handleMouseDown}
							onDoubleClick={handleDoubleClick}>
							{items.map((item, index) => (
								<div key={index} style={{ marginBottom: 4 * containerBasedZoom }}>
									{element.type === 'bullet-list' ? '• ' : `${index + 1}. `}
									{item}
								</div>
							))}
						</div>
					</ElementContextMenu>
				)

			case 'image':
				const src = element.content?.toString() || '/placeholder.svg'
				return (
					<ElementContextMenu
						key={element.id}
						element={element}
						slide={slide}
						selectedElements={selectedElements}
						lockedElements={lockedElements}
						onUpdateSlide={onUpdateSlide}
						onSelectedElementIdsChange={onSelectedElementIdsChange}
						onBringToFront={onBringToFront}
						onSendToBack={onSendToBack}
						onLockToggle={onLockToggle}
						onAlignLeft={onAlignLeft}
						onAlignCenter={onAlignCenter}
						onAlignRight={onAlignRight}
						onStartEditing={onStartEditing}>
						<div
							data-element-id={element.id}
							style={commonStyle}
							onClick={handleClick}
							onMouseDown={handleMouseDown}
							onDoubleClick={handleDoubleClick}>
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
					</ElementContextMenu>
				)

			case 'rectangle':
				return (
					<ElementContextMenu
						key={element.id}
						element={element}
						slide={slide}
						selectedElements={selectedElements}
						lockedElements={lockedElements}
						onUpdateSlide={onUpdateSlide}
						onSelectedElementIdsChange={onSelectedElementIdsChange}
						onBringToFront={onBringToFront}
						onSendToBack={onSendToBack}
						onLockToggle={onLockToggle}
						onAlignLeft={onAlignLeft}
						onAlignCenter={onAlignCenter}
						onAlignRight={onAlignRight}
						onStartEditing={onStartEditing}>
						<div
							data-element-id={element.id}
							style={{
								...commonStyle,
								backgroundColor: element.style?.backgroundColor || 'transparent',
								border: element.borderColor
									? `${element.borderWidth || 1}px solid ${element.borderColor}`
									: 'none',
								borderRadius: 4,
							}}
							onClick={handleClick}
							onMouseDown={handleMouseDown}
							onDoubleClick={handleDoubleClick}></div>
					</ElementContextMenu>
				)

			case 'circle':
				return (
					<ElementContextMenu
						key={element.id}
						element={element}
						slide={slide}
						selectedElements={selectedElements}
						lockedElements={lockedElements}
						onUpdateSlide={onUpdateSlide}
						onSelectedElementIdsChange={onSelectedElementIdsChange}
						onBringToFront={onBringToFront}
						onSendToBack={onSendToBack}
						onLockToggle={onLockToggle}
						onAlignLeft={onAlignLeft}
						onAlignCenter={onAlignCenter}
						onAlignRight={onAlignRight}
						onStartEditing={onStartEditing}>
						<div
							data-element-id={element.id}
							style={{
								...commonStyle,
								backgroundColor: element.style?.backgroundColor || 'transparent',
								border: element.borderColor
									? `${element.borderWidth || 1}px solid ${element.borderColor}`
									: 'none',
								borderRadius: '50%',
							}}
							onClick={handleClick}
							onMouseDown={handleMouseDown}
							onDoubleClick={handleDoubleClick}></div>
					</ElementContextMenu>
				)

			default:
				return (
					<ElementContextMenu
						key={element.id}
						element={element}
						slide={slide}
						selectedElements={selectedElements}
						lockedElements={lockedElements}
						onUpdateSlide={onUpdateSlide}
						onSelectedElementIdsChange={onSelectedElementIdsChange}
						onBringToFront={onBringToFront}
						onSendToBack={onSendToBack}
						onLockToggle={onLockToggle}
						onAlignLeft={onAlignLeft}
						onAlignCenter={onAlignCenter}
						onAlignRight={onAlignRight}
						onStartEditing={onStartEditing}>
						<div
							data-element-id={element.id}
							style={{
								...commonStyle,
								backgroundColor: 'rgba(200, 0, 0, 0.2)',
								border: '1px solid red',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 12 * containerBasedZoom,
							}}
							onClick={handleClick}
							onMouseDown={handleMouseDown}
							onDoubleClick={handleDoubleClick}>
							Unknown: {element.type}
						</div>
					</ElementContextMenu>
				)
		}
	}

	// Create grid pattern if needed
	const gridStyle: React.CSSProperties = showGrid
		? {
				backgroundImage: `
			linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
		`,
				backgroundSize: `${20 * containerBasedZoom}px ${20 * containerBasedZoom}px`,
		  }
		: {}

	return (
		<div
			className="w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center"
			onMouseEnter={() => setIsCanvasHovered(true)}
			onMouseLeave={() => setIsCanvasHovered(false)}
			ref={containerRef}>
			{/* Canvas wrapper - sized to fill container while maintaining aspect ratio */}
			<CanvasContextMenu
				slide={slide}
				onUpdateSlide={onUpdateSlide}
				onSelectedElementIdsChange={onSelectedElementIdsChange}
				onOpenThemeGallery={onOpenThemeGallery}>
				<div
					className={cn(
						'relative overflow-hidden bg-white',
						'shadow-lg transition-shadow duration-150',
						isCanvasHovered && 'shadow-xl'
					)}
					id="slide-canvas"
					style={{
						width: actualSlideWidth,
						height: actualSlideHeight,
						maxWidth: '100%',
						maxHeight: '100%',
						backgroundColor: slide.backgroundColor || '#ffffff',
						...themeBackgroundStyle,
						...gridStyle,
					}}
					onClick={onSlideClick}>
					{/* Render all elements */}
					{slide.elements.map((element) => renderHtmlElement(element))}

					{/* Selection overlay with resize handles */}
					<ElementSelectionOverlay
						selectedElements={selectedElements}
						elements={slide.elements}
						zoom={containerBasedZoom}
						onResizeStart={onResizeStart}
						onRotateStart={onRotateStart}
					/>
				</div>
			</CanvasContextMenu>
		</div>
	)
}
