'use client'

import { Separator } from '@/components/ui/separator'
import type { ElementType } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ColorPicker, FontSizePicker, ToolbarButtonGroup } from './toolbar'
import {
	ELEMENT_ALIGNMENT_OPTIONS,
	ELEMENT_CREATION_OPTIONS,
	ELEMENT_OPERATIONS,
	TEXT_ALIGNMENT_OPTIONS,
	TEXT_ELEMENT_TYPES,
	type ElementAlignmentOption,
	type ElementCreationOption,
	type TextAlignmentOption,
	type ToolbarOption,
} from './toolbar-options'

interface EnhancedElementToolbarProps {
	selectedElements: string[]
	elements: ElementType[]
	onUpdateElements: (updates: Partial<ElementType>[]) => void
	onDuplicateElements: () => void
	onDeleteElements: () => void
	onAddElement: (type: ElementType['type']) => void
	slideWidth?: number
	slideHeight?: number
	toolbarPosition?: { top: number; left: number; width: number; height: number } | null
}

export function EnhancedElementToolbar({
	selectedElements,
	elements,
	onUpdateElements,
	onDuplicateElements,
	onDeleteElements,
	onAddElement,
	slideWidth,
	slideHeight,
	toolbarPosition,
}: EnhancedElementToolbarProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const selectedElement =
		selectedElements.length === 1 ? elements.find((el) => el.id === selectedElements[0]) : null

	const handleToolbarAction = useCallback(
		(action: string, option: ToolbarOption) => {
			switch (action) {
				case 'createElement':
					const createOption = option as ElementCreationOption
					onAddElement(createOption.elementType)
					break

				case 'duplicate':
					onDuplicateElements()
					break

				case 'delete':
					onDeleteElements()
					break

				case 'alignElement':
					const alignOption = option as ElementAlignmentOption
					handleElementAlign(alignOption.alignType)
					break

				case 'alignText':
					const textAlignOption = option as TextAlignmentOption
					handleTextAlign(textAlignOption.alignType)
					break

				default:
					console.warn(`Unknown toolbar action: ${action}`)
			}
		},
		[onAddElement, onDuplicateElements, onDeleteElements]
	)

	const handleTextAlign = useCallback(
		(align: 'left' | 'center' | 'right') => {
			if (selectedElements.length === 0) return

			const updates = selectedElements.map((id) => {
				const element = elements.find((el) => el.id === id)
				return {
					id,
					style: {
						...element?.style,
						textAlign: align,
					},
				}
			})

			onUpdateElements(updates)
		},
		[selectedElements, elements, onUpdateElements]
	)

	const handleElementAlign = useCallback(
		(
			alignType:
				| 'slideLeft'
				| 'slideCenterHorizontal'
				| 'slideRight'
				| 'slideTop'
				| 'slideCenterVertical'
				| 'slideBottom'
		) => {
			if (selectedElements.length === 0 || !slideWidth || !slideHeight) return

			const updates = selectedElements
				.map((id) => {
					const element = elements.find((el) => el.id === id)
					if (!element) return null

					let newX = element.x
					let newY = element.y

					const elementWidth = typeof element.width === 'number' ? element.width : 100
					const elementHeight = typeof element.height === 'number' ? element.height : 50

					switch (alignType) {
						case 'slideLeft':
							newX = 0
							break
						case 'slideCenterHorizontal':
							newX = (slideWidth - elementWidth) / 2
							break
						case 'slideRight':
							newX = slideWidth - elementWidth
							break
						case 'slideTop':
							newY = 0
							break
						case 'slideCenterVertical':
							newY = (slideHeight - elementHeight) / 2
							break
						case 'slideBottom':
							newY = slideHeight - elementHeight
							break
						default:
							return null
					}
					return {
						id,
						x: Math.round(newX),
						y: Math.round(newY),
					}
				})
				.filter(Boolean) as Partial<ElementType>[]

			if (updates.length > 0) {
				onUpdateElements(updates)
			}
		},
		[selectedElements, elements, onUpdateElements, slideWidth, slideHeight]
	)

	const handleFontSize = useCallback(
		(size: string) => {
			if (selectedElements.length === 0) return

			const updates = selectedElements.map((id) => {
				const element = elements.find((el) => el.id === id)
				return {
					id,
					fontSize: parseInt(size, 10),
					style: {
						...element?.style,
						fontSize: size,
					},
				}
			})

			onUpdateElements(updates)
		},
		[selectedElements, elements, onUpdateElements]
	)

	const handleColorChange = useCallback(
		(color: string) => {
			if (selectedElements.length === 0) return

			const updates = selectedElements.map((id) => {
				const element = elements.find((el) => el.id === id)
				return {
					id,
					color,
					style: {
						...element?.style,
						color,
					},
				}
			})

			onUpdateElements(updates)
		},
		[selectedElements, elements, onUpdateElements]
	)

	// Generate active states for text alignment
	const getTextAlignmentActiveStates = useCallback(() => {
		if (!selectedElement) return {}

		const activeStates: Record<string, boolean> = {}
		const currentAlign = selectedElement.style?.textAlign

		TEXT_ALIGNMENT_OPTIONS.forEach((option) => {
			activeStates[option.id] = currentAlign === option.alignType
		})

		return activeStates
	}, [selectedElement])

	const toolbarStyle: React.CSSProperties = toolbarPosition
		? {
				position: 'absolute',
				top: `${toolbarPosition.top + toolbarPosition.height - 56}px`,
				left: `${toolbarPosition.left + toolbarPosition.width / 2}px`,
				transform: 'translateX(-50%)',
				zIndex: 500,
				transition: 'top 0.05s, left 0.05s',
		  }
		: {
				position: 'fixed',
				bottom: '1rem',
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 500,
				opacity: 0,
				pointerEvents: 'none',
		  }

	if (toolbarPosition && toolbarStyle.position === 'absolute') {
		toolbarStyle.opacity = 1
		toolbarStyle.pointerEvents = 'auto'
	}

	const toolbarContent = (
		<div style={toolbarStyle}>
			<div className="bg-background border rounded-full shadow-lg p-1 flex items-center gap-1">
				{/* Element Creation Tools */}
				<ToolbarButtonGroup options={ELEMENT_CREATION_OPTIONS} onAction={handleToolbarAction} />

				{selectedElements.length > 0 && (
					<>
						<Separator orientation="vertical" className="h-6" />

						{/* Element Operations */}
						<ToolbarButtonGroup options={ELEMENT_OPERATIONS} onAction={handleToolbarAction} />

						{/* Element Alignment - Only show if slide dimensions are available */}
						{slideWidth && slideHeight && (
							<>
								<Separator orientation="vertical" className="h-6" />
								<ToolbarButtonGroup options={ELEMENT_ALIGNMENT_OPTIONS} onAction={handleToolbarAction} />
							</>
						)}

						{/* Text Formatting - Only show for text elements */}
						{selectedElement && TEXT_ELEMENT_TYPES.includes(selectedElement.type) && (
							<>
								<Separator orientation="vertical" className="h-6" />

								<div className="flex items-center gap-1 px-2">
									{/* Text Alignment */}
									<ToolbarButtonGroup
										options={TEXT_ALIGNMENT_OPTIONS}
										onAction={handleToolbarAction}
										activeStates={getTextAlignmentActiveStates()}
									/>

									{/* Font Size Picker */}
									<FontSizePicker
										currentSize={(() => {
											if (typeof selectedElement.fontSize === 'number') {
												return `${selectedElement.fontSize}px`
											}
											if (typeof selectedElement.style?.fontSize === 'number') {
												return `${selectedElement.style.fontSize}px`
											}
											return selectedElement.style?.fontSize || '24px'
										})()}
										onSizeChange={handleFontSize}
									/>

									{/* Color Picker */}
									<ColorPicker
										currentColor={selectedElement.style?.color || '#000000'}
										onColorChange={handleColorChange}
									/>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	)

	if (!mounted) {
		return null
	}

	const portalTarget = document.getElementById('toolbar-portal-target')
	if (!portalTarget) {
		console.warn('Toolbar portal target not found. Rendering toolbar inline.')
		return toolbarContent
	}

	return createPortal(toolbarContent, portalTarget)
}
