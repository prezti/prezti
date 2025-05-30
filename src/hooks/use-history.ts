import { useCallback, useRef, useState } from 'react'

interface HistoryState<T> {
	past: T[]
	present: T
	future: T[]
}

interface UseHistoryReturn<T> {
	state: T
	canUndo: boolean
	canRedo: boolean
	undoCount: number
	redoCount: number
	undo: () => void
	redo: () => void
	set: (newState: T) => void
	reset: (newState: T) => void
}

export function useHistory<T>(initialState: T): UseHistoryReturn<T> {
	const [history, setHistory] = useState<HistoryState<T>>({
		past: [],
		present: initialState,
		future: [],
	})

	// Keep track of whether the last action was programmatic (to avoid infinite loops)
	const isUpdatingRef = useRef(false)

	const canUndo = history.past.length > 0
	const canRedo = history.future.length > 0
	const undoCount = history.past.length
	const redoCount = history.future.length

	const undo = useCallback(() => {
		if (!canUndo) return

		setHistory((currentHistory) => {
			const previous = currentHistory.past[currentHistory.past.length - 1]
			const newPast = currentHistory.past.slice(0, -1)

			return {
				past: newPast,
				present: previous,
				future: [currentHistory.present, ...currentHistory.future],
			}
		})
	}, [canUndo])

	const redo = useCallback(() => {
		if (!canRedo) return

		setHistory((currentHistory) => {
			const next = currentHistory.future[0]
			const newFuture = currentHistory.future.slice(1)

			return {
				past: [...currentHistory.past, currentHistory.present],
				present: next,
				future: newFuture,
			}
		})
	}, [canRedo])

	const set = useCallback((newState: T) => {
		// Don't add to history if we're in an update cycle
		if (isUpdatingRef.current) return

		setHistory((currentHistory) => {
			// Don't add to history if the state hasn't actually changed
			if (JSON.stringify(currentHistory.present) === JSON.stringify(newState)) {
				return currentHistory
			}

			return {
				past: [...currentHistory.past, currentHistory.present],
				present: newState,
				future: [], // Clear future when making a new change
			}
		})
	}, [])

	const reset = useCallback((newState: T) => {
		setHistory({
			past: [],
			present: newState,
			future: [],
		})
	}, [])

	return {
		state: history.present,
		canUndo,
		canRedo,
		undoCount,
		redoCount,
		undo,
		redo,
		set,
		reset,
	}
}
