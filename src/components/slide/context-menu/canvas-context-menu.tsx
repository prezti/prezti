'use client'

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useToast } from '@/hooks/use-toast'
import { createCenteredElement } from '@/lib/element-factory'
import type { ElementType, SlideType } from '@/lib/types'
import { useContextMenuStore } from '@/stores/slide-context-menu-store'
import { FileText, Heading1, ImageIcon, List, ListOrdered, Palette, Plus, Type } from 'lucide-react'
import * as React from 'react'
import { MenuGroup, MenuItem, MenuSeparator } from './context-menu-items'

interface CanvasContextMenuProps {
	children: React.ReactNode
	slide: SlideType
	clickPosition?: { x: number; y: number }
	onUpdateSlide: (slide: SlideType) => void
	onSelectedElementIdsChange: (ids: string[]) => void
	onOpenThemeGallery?: () => void
}

export function CanvasContextMenu({
	children,
	slide,
	clickPosition,
	onUpdateSlide,
	onSelectedElementIdsChange,
	onOpenThemeGallery,
}: CanvasContextMenuProps) {
	const { toast } = useToast()
	const { closeMenu } = useContextMenuStore()

	// Handle paste elements
	const handlePaste = React.useCallback(() => {
		if (typeof window === 'undefined') return

		const copiedElementsJSON = localStorage.getItem('copiedElements')
		if (!copiedElementsJSON) {
			toast({
				title: 'Nothing to Paste',
				description: 'Clipboard is empty',
			})
			closeMenu()
			return
		}

		try {
			const copiedElements = JSON.parse(copiedElementsJSON) as ElementType[]
			const newElements = copiedElements.map((el) => ({
				...el,
				id: crypto.randomUUID(),
				x: clickPosition ? clickPosition.x : (el.x || 0) + 20,
				y: clickPosition ? clickPosition.y : (el.y || 0) + 20,
			}))

			const newSlide = {
				...slide,
				elements: [...slide.elements, ...newElements],
			}

			onUpdateSlide(newSlide)
			onSelectedElementIdsChange(newElements.map((el) => el.id))
			toast({
				title: 'Pasted',
				description: `${newElements.length} element${newElements.length > 1 ? 's' : ''} pasted`,
			})
		} catch (error) {
			toast({
				title: 'Paste Failed',
				description: 'Invalid clipboard data',
			})
		}
		closeMenu()
	}, [slide, clickPosition, onUpdateSlide, onSelectedElementIdsChange, toast, closeMenu])

	// Handle add element functions
	const handleAddElement = React.useCallback(
		(elementType: ElementType['type']) => {
			const position = clickPosition || { x: 100, y: 100 }
			const newElement = createCenteredElement(elementType, position.x, position.y)

			const newSlide = {
				...slide,
				elements: [...slide.elements, newElement],
			}

			onUpdateSlide(newSlide)
			onSelectedElementIdsChange([newElement.id])
			toast({
				title: 'Element Added',
				description: `${elementType.charAt(0).toUpperCase() + elementType.slice(1)} element created`,
			})
			closeMenu()
		},
		[slide, clickPosition, onUpdateSlide, onSelectedElementIdsChange, toast, closeMenu]
	)

	// Handle background settings - open theme gallery
	const handleBackgroundSettings = React.useCallback(() => {
		if (onOpenThemeGallery) {
			onOpenThemeGallery()
		} else {
			toast({
				title: 'Background Settings',
				description: 'Use the theme gallery to change backgrounds',
			})
		}
		closeMenu()
	}, [onOpenThemeGallery, toast, closeMenu])

	// Check if clipboard has content (client-side only)
	const hasClipboardContent = React.useMemo(() => {
		if (typeof window === 'undefined') return false
		return localStorage.getItem('copiedElements') !== null
	}, [])

	return (
		<ContextMenu>
			<ContextMenuTrigger
				asChild
				onContextMenu={(e) => {
					// Only clear selection if the right-click target is empty canvas space
					const target = e.target as HTMLElement

					// Check if the click is on an element by looking for data-element-id
					const clickedElement = target.closest('[data-element-id]')

					if (!clickedElement) {
						// This is a right-click on empty canvas space
						onSelectedElementIdsChange([])
					}
					// If clicking on an element, don't clear selection - let the element context menu handle it
				}}>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				{hasClipboardContent && (
					<>
						<MenuGroup>
							<MenuItem icon={FileText} label="Paste" shortcut="Ctrl+V" onClick={handlePaste} />
						</MenuGroup>
						<MenuSeparator />
					</>
				)}

				<MenuGroup label="Add Element">
					<MenuItem icon={Heading1} label="Add Heading" onClick={() => handleAddElement('heading')} />
					<MenuItem icon={Type} label="Add Text" onClick={() => handleAddElement('paragraph')} />
					<MenuItem
						icon={List}
						label="Add Bullet List"
						onClick={() => handleAddElement('bullet-list')}
					/>
					<MenuItem
						icon={ListOrdered}
						label="Add Numbered List"
						onClick={() => handleAddElement('numbered-list')}
					/>
					<MenuItem icon={ImageIcon} label="Add Image" onClick={() => handleAddElement('image')} />
					<MenuItem icon={Plus} label="Add Shape" onClick={() => handleAddElement('rectangle')} />
				</MenuGroup>

				<MenuSeparator />

				<MenuGroup label="Slide">
					<MenuItem icon={Palette} label="Theme Gallery" onClick={handleBackgroundSettings} />
				</MenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}
