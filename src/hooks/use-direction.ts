import { useEffect, useState } from 'react'

export function useDirection() {
	const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')

	useEffect(() => {
		// Check document direction or local storage
		const savedDirection = localStorage.getItem('direction') as 'ltr' | 'rtl' | null
		const documentDirection = (document.documentElement.dir as 'ltr' | 'rtl') || 'ltr'

		const currentDirection = savedDirection || documentDirection
		setDirection(currentDirection)

		// Apply to document
		document.documentElement.dir = currentDirection
	}, [])

	const toggleDirection = () => {
		const newDirection = direction === 'ltr' ? 'rtl' : 'ltr'
		setDirection(newDirection)
		document.documentElement.dir = newDirection
		localStorage.setItem('direction', newDirection)
	}

	return {
		direction,
		isRTL: direction === 'rtl',
		isLTR: direction === 'ltr',
		toggleDirection,
	}
}
