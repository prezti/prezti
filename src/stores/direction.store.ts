import { create } from 'zustand'

interface DirectionState {
	direction: 'ltr' | 'rtl'
	toggleDirection: () => void
}

export const useDirectionStore = create<DirectionState>((set, get) => ({
	direction: 'ltr',
	toggleDirection: () => {
		const newDirection = get().direction === 'ltr' ? 'rtl' : 'ltr'
		set({ direction: newDirection })

		// Apply to document
		document.documentElement.dir = newDirection
		localStorage.setItem('direction', newDirection)
	},
}))
