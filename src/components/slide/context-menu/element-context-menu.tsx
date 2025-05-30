'use client'

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useToast } from '@/hooks/use-toast'
import type { ElementType, SlideType } from '@/lib/types'
import { useContextMenuStore } from '@/stores/slide-context-menu-store'
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Copy,
	Edit,
	Lock,
	LockOpen,
	MoveDown,
	MoveUp,
	Trash2,
} from 'lucide-react'
import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { MenuGroup, MenuItem, MenuSeparator } from './context-menu-items'

interface ElementContextMenuProps {
	children: React.ReactNode
	element: ElementType
	slide: SlideType
	selectedElements: string[]
	lockedElements: string[]
	onUpdateSlide: (slide: SlideType) => void
	onSelectedElementIdsChange: (ids: string[]) => void
	onBringToFront?: () => void
	onSendToBack?: () => void
	onLockToggle?: () => void
	onAlignLeft?: () => void
	onAlignCenter?: () => void
	onAlignRight?: () => void
	onStartEditing?: (elementId: string, initialValue: string) => void
}

export function ElementContextMenu({
	children,
	element,
	slide,
	selectedElements,
	lockedElements,
	onUpdateSlide,
	onSelectedElementIdsChange,
	onBringToFront,
	onSendToBack,
	onLockToggle,
	onAlignLeft,
	onAlignCenter,
	onAlignRight,
	onStartEditing,
}: ElementContextMenuProps) {
	const { toast } = useToast()
	const { closeMenu } = useContextMenuStore()

	const isLocked = lockedElements.includes(element.id)
	const isMultipleSelection = selectedElements.length > 1
	const isTextElement = ['heading', 'paragraph', 'bullet-list', 'numbered-list'].includes(element.type)

	// Handle copy element
	const handleCopy = React.useCallback(() => {
		const elementsToCopy = slide.elements.filter((el) => selectedElements.includes(el.id))
		localStorage.setItem('copiedElements', JSON.stringify(elementsToCopy))
		toast({
			title: 'Copied',
			description: `${elementsToCopy.length} element${
				elementsToCopy.length > 1 ? 's' : ''
			} copied to clipboard`,
		})
		closeMenu()
	}, [slide.elements, selectedElements, toast, closeMenu])

	// Handle duplicate element
	const handleDuplicate = React.useCallback(() => {
		const elementsToDuplicate = slide.elements.filter((el) => selectedElements.includes(el.id))
		const newElements = elementsToDuplicate.map((el) => ({
			...el,
			id: uuidv4(),
			x: (el.x || 0) + 20,
			y: (el.y || 0) + 20,
		}))

		const newSlide = {
			...slide,
			elements: [...slide.elements, ...newElements],
		}

		onUpdateSlide(newSlide)
		onSelectedElementIdsChange(newElements.map((el) => el.id))
		toast({
			title: 'Duplicated',
			description: `${newElements.length} element${newElements.length > 1 ? 's' : ''} duplicated`,
		})
		closeMenu()
	}, [slide, selectedElements, onUpdateSlide, onSelectedElementIdsChange, toast, closeMenu])

	// Handle delete element
	const handleDelete = React.useCallback(() => {
		const elementsToDelete = selectedElements.filter((id) => !lockedElements.includes(id))
		if (elementsToDelete.length === 0) {
			toast({
				title: 'Cannot Delete',
				description: 'Selected elements are locked',
			})
			closeMenu()
			return
		}

		const newElements = slide.elements.filter((el) => !elementsToDelete.includes(el.id))
		const newSlide = { ...slide, elements: newElements }

		onUpdateSlide(newSlide)
		onSelectedElementIdsChange([])
		toast({
			title: 'Deleted',
			description: `${elementsToDelete.length} element${elementsToDelete.length > 1 ? 's' : ''} deleted`,
		})
		closeMenu()
	}, [
		slide,
		selectedElements,
		lockedElements,
		onUpdateSlide,
		onSelectedElementIdsChange,
		toast,
		closeMenu,
	])

	// Handle bring to front
	const handleBringToFront = React.useCallback(() => {
		if (onBringToFront) {
			onBringToFront()
		} else {
			toast({
				title: 'Not Available',
				description: 'Bring to front is not available',
			})
		}
		closeMenu()
	}, [onBringToFront, toast, closeMenu])

	// Handle send to back
	const handleSendToBack = React.useCallback(() => {
		if (onSendToBack) {
			onSendToBack()
		} else {
			toast({
				title: 'Not Available',
				description: 'Send to back is not available',
			})
		}
		closeMenu()
	}, [onSendToBack, toast, closeMenu])

	// Handle lock/unlock
	const handleLockToggle = React.useCallback(() => {
		if (onLockToggle) {
			onLockToggle()
		} else {
			toast({
				title: 'Not Available',
				description: 'Lock toggle is not available',
			})
		}
		closeMenu()
	}, [onLockToggle, toast, closeMenu])

	// Handle alignment functions
	const handleAlign = React.useCallback(
		(alignment: 'left' | 'center' | 'right') => {
			let alignHandler: (() => void) | undefined
			switch (alignment) {
				case 'left':
					alignHandler = onAlignLeft
					break
				case 'center':
					alignHandler = onAlignCenter
					break
				case 'right':
					alignHandler = onAlignRight
					break
			}

			if (alignHandler) {
				alignHandler()
			} else {
				toast({
					title: 'Not Available',
					description: `Align ${alignment} is not available`,
				})
			}
			closeMenu()
		},
		[onAlignLeft, onAlignCenter, onAlignRight, toast, closeMenu]
	)

	// Handle edit properties
	const handleEditProperties = React.useCallback(() => {
		if (isTextElement && onStartEditing) {
			// Start inline editing for text elements
			const content = Array.isArray(element.content)
				? element.content.join('\n')
				: element.content?.toString() || ''
			onStartEditing(element.id, content)
			closeMenu()
		} else if (isTextElement) {
			// Fallback if onStartEditing is not available
			toast({
				title: 'Edit Text',
				description: 'Double-click the element to edit its text',
			})
			closeMenu()
		} else {
			// For non-text elements, suggest using the toolbar
			toast({
				title: 'Edit Properties',
				description: 'Use the toolbar to modify colors, borders, and other properties',
			})
			closeMenu()
		}
	}, [isTextElement, element, onStartEditing, toast, closeMenu])

	return (
		<ContextMenu>
			<ContextMenuTrigger
				asChild
				onContextMenu={(e) => {
					// Prevent canvas context menu from triggering
					e.stopPropagation()

					// Only show menu if this element is part of the selection
					if (!selectedElements.includes(element.id)) {
						onSelectedElementIdsChange([element.id])
					}
				}}>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				<MenuGroup>
					<MenuItem
						icon={Copy}
						label="Copy"
						shortcut="Ctrl+C"
						onClick={handleCopy}
						disabled={isLocked}
					/>
					<MenuItem
						icon={Copy}
						label="Duplicate"
						shortcut="Ctrl+D"
						onClick={handleDuplicate}
						disabled={isLocked}
					/>
					<MenuItem
						icon={Trash2}
						label="Delete"
						shortcut="Del"
						onClick={handleDelete}
						disabled={isLocked}
						variant="destructive"
					/>
				</MenuGroup>

				<MenuSeparator />

				<MenuGroup label="Layer">
					<MenuItem
						icon={MoveUp}
						label="Bring to Front"
						onClick={handleBringToFront}
						disabled={isLocked}
					/>
					<MenuItem
						icon={MoveDown}
						label="Send to Back"
						onClick={handleSendToBack}
						disabled={isLocked}
					/>
				</MenuGroup>

				{!isMultipleSelection && (
					<>
						<MenuSeparator />
						<MenuGroup label="Align">
							<MenuItem
								icon={AlignLeft}
								label="Align Left"
								shortcut="Ctrl+Shift+L"
								onClick={() => handleAlign('left')}
								disabled={isLocked}
							/>
							<MenuItem
								icon={AlignCenter}
								label="Align Center"
								shortcut="Ctrl+Shift+E"
								onClick={() => handleAlign('center')}
								disabled={isLocked}
							/>
							<MenuItem
								icon={AlignRight}
								label="Align Right"
								shortcut="Ctrl+Shift+R"
								onClick={() => handleAlign('right')}
								disabled={isLocked}
							/>
						</MenuGroup>
					</>
				)}

				<MenuSeparator />

				<MenuGroup>
					<MenuItem
						icon={isLocked ? LockOpen : Lock}
						label={isLocked ? 'Unlock' : 'Lock'}
						onClick={handleLockToggle}
					/>
					<MenuItem
						icon={Edit}
						label={isTextElement ? 'Edit Text' : 'Edit Properties'}
						onClick={handleEditProperties}
					/>
				</MenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}
