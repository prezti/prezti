import type { ElementType } from './types'

/**
 * Determines if a point (x, y) is inside an element
 */
export const isPointInElement = (
	point: { x: number; y: number },
	element: ElementType,
	zoom: number = 1
): boolean => {
	// Adjust element position based on the current zoom level
	const adjustedX = element.x * zoom
	const adjustedY = element.y * zoom
	const adjustedWidth = element.width * zoom
	const adjustedHeight = element.height * zoom

	// Apply rotation if needed
	if (element.rotation && element.rotation !== 0) {
		// For rotated elements, we need to transform the point to element's coordinate system
		const centerX = adjustedX + adjustedWidth / 2
		const centerY = adjustedY + adjustedHeight / 2

		// Translate point so that element center is at origin
		const translatedX = point.x - centerX
		const translatedY = point.y - centerY

		// Rotate point in the opposite direction of element rotation
		const angle = -element.rotation * (Math.PI / 180) // Convert degrees to radians
		const rotatedX = translatedX * Math.cos(angle) - translatedY * Math.sin(angle)
		const rotatedY = translatedX * Math.sin(angle) + translatedY * Math.cos(angle)

		// Check if rotated point is inside unrotated rectangle
		return (
			rotatedX >= -adjustedWidth / 2 &&
			rotatedX <= adjustedWidth / 2 &&
			rotatedY >= -adjustedHeight / 2 &&
			rotatedY <= adjustedHeight / 2
		)
	}

	// For unrotated elements, simple rectangle check
	return (
		point.x >= adjustedX &&
		point.x <= adjustedX + adjustedWidth &&
		point.y >= adjustedY &&
		point.y <= adjustedY + adjustedHeight
	)
}

/**
 * Determines if a selection rectangle intersects with an element
 */
export const doesRectIntersectElement = (
	selection: { startX: number; startY: number; endX: number; endY: number },
	element: ElementType,
	zoom: number = 1
): boolean => {
	// Normalize selection rectangle (ensure startX < endX and startY < endY)
	const selRect = {
		left: Math.min(selection.startX, selection.endX),
		right: Math.max(selection.startX, selection.endX),
		top: Math.min(selection.startY, selection.endY),
		bottom: Math.max(selection.startY, selection.endY),
	}

	// Adjust element position based on zoom
	const adjustedX = element.x * zoom
	const adjustedY = element.y * zoom
	const adjustedWidth = element.width * zoom
	const adjustedHeight = element.height * zoom

	const eleRect = {
		left: adjustedX,
		right: adjustedX + adjustedWidth,
		top: adjustedY,
		bottom: adjustedY + adjustedHeight,
	}

	// Simple rectangle intersection check
	// For simplicity, we don't handle rotation here - more complex case
	return !(
		selRect.right < eleRect.left ||
		selRect.left > eleRect.right ||
		selRect.bottom < eleRect.top ||
		selRect.top > eleRect.bottom
	)
}

/**
 * Gets elements that are inside or intersect with a selection rectangle
 */
export const getElementsInSelection = (
	selectionRect: { startX: number; startY: number; endX: number; endY: number },
	elements: ElementType[],
	zoom: number = 1
): string[] => {
	return elements
		.filter((element) => doesRectIntersectElement(selectionRect, element, zoom))
		.map((element) => element.id)
}

/**
 * Gets the topmost element at a point
 */
export const getTopmostElementAtPoint = (
	point: { x: number; y: number },
	elements: ElementType[],
	zoom: number = 1
): string | null => {
	// Sort elements by zIndex (higher = on top)
	const sortedElements = [...elements].sort((a, b) => {
		const aZIndex = a.zIndex || 0
		const bZIndex = b.zIndex || 0
		return bZIndex - aZIndex
	})

	// Find the first (topmost) element that contains the point
	const element = sortedElements.find((el) => isPointInElement(point, el, zoom))
	return element ? element.id : null
}

/**
 * Calculate the bounding box for multiple elements
 */
export const getSelectionBounds = (
	elementIds: string[],
	elements: ElementType[]
): { x: number; y: number; width: number; height: number } | null => {
	const selectedElements = elements.filter((el) => elementIds.includes(el.id))

	if (selectedElements.length === 0) return null

	let minX = Infinity
	let minY = Infinity
	let maxX = -Infinity
	let maxY = -Infinity

	selectedElements.forEach((el) => {
		minX = Math.min(minX, el.x)
		minY = Math.min(minY, el.y)
		maxX = Math.max(maxX, el.x + el.width)
		maxY = Math.max(maxY, el.y + el.height)
	})

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	}
}
