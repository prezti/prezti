import { create } from 'zustand'

interface ContextMenuState {
	// State
	isOpen: boolean
	position: { x: number; y: number } | null
	targetElement: string | null
	menuType: 'element' | 'canvas' | null
	selectedElements: string[]

	// Actions
	openElementMenu: (
		elementId: string,
		position: { x: number; y: number },
		selectedElements: string[]
	) => void
	openCanvasMenu: (position: { x: number; y: number }) => void
	closeMenu: () => void
	setSelectedElements: (elements: string[]) => void
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
	// Initial state
	isOpen: false,
	position: null,
	targetElement: null,
	menuType: null,
	selectedElements: [],

	// Actions
	openElementMenu: (elementId, position, selectedElements) =>
		set({
			isOpen: true,
			position,
			targetElement: elementId,
			menuType: 'element',
			selectedElements,
		}),

	openCanvasMenu: (position) =>
		set({
			isOpen: true,
			position,
			targetElement: null,
			menuType: 'canvas',
			selectedElements: [],
		}),

	closeMenu: () =>
		set({
			isOpen: false,
			position: null,
			targetElement: null,
			menuType: null,
		}),

	setSelectedElements: (elements) => set({ selectedElements: elements }),
}))
