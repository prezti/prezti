'use client'

import type { ElementType } from '@/lib/types'
import { useMemo } from 'react'

interface AlignmentGuidesProps {
	elements: ElementType[]
	draggedElementId: string | null
	dragOffset: { x: number; y: number }
	zoom: number
	canvasWidth: number
	canvasHeight: number
}

interface Guide {
	x?: number
	y?: number
	type: 'element' | 'center' | 'edge'
	elementId?: string
}

export function AlignmentGuides({
	elements,
	draggedElementId,
	dragOffset,
	zoom,
	canvasWidth,
	canvasHeight,
}: AlignmentGuidesProps) {
	const guides = useMemo(() => {
		if (!draggedElementId) return []

		const draggedElement = elements.find((el) => el.id === draggedElementId)
		if (!draggedElement) return []

		const otherElements = elements.filter((el) => el.id !== draggedElementId)
		const guides: Guide[] = []

		// Current dragged element position with offset
		const currentX = draggedElement.x + dragOffset.x
		const currentY = draggedElement.y + dragOffset.y
		const currentRight = currentX + draggedElement.width
		const currentBottom = currentY + draggedElement.height
		const currentCenterX = currentX + draggedElement.width / 2
		const currentCenterY = currentY + draggedElement.height / 2

		// Snap tolerance in pixels (scaled for zoom)
		const snapTolerance = 8 / zoom

		// Check alignment with other elements
		otherElements.forEach((element) => {
			const elementRight = element.x + element.width
			const elementBottom = element.y + element.height
			const elementCenterX = element.x + element.width / 2
			const elementCenterY = element.y + element.height / 2

			// Vertical alignment guides
			// Left edges
			if (Math.abs(currentX - element.x) < snapTolerance) {
				guides.push({ x: element.x, type: 'element', elementId: element.id })
			}
			// Right edges
			if (Math.abs(currentRight - elementRight) < snapTolerance) {
				guides.push({ x: elementRight, type: 'element', elementId: element.id })
			}
			// Centers
			if (Math.abs(currentCenterX - elementCenterX) < snapTolerance) {
				guides.push({ x: elementCenterX, type: 'center', elementId: element.id })
			}
			// Left to right edge
			if (Math.abs(currentX - elementRight) < snapTolerance) {
				guides.push({ x: elementRight, type: 'element', elementId: element.id })
			}
			// Right to left edge
			if (Math.abs(currentRight - element.x) < snapTolerance) {
				guides.push({ x: element.x, type: 'element', elementId: element.id })
			}

			// Horizontal alignment guides
			// Top edges
			if (Math.abs(currentY - element.y) < snapTolerance) {
				guides.push({ y: element.y, type: 'element', elementId: element.id })
			}
			// Bottom edges
			if (Math.abs(currentBottom - elementBottom) < snapTolerance) {
				guides.push({ y: elementBottom, type: 'element', elementId: element.id })
			}
			// Centers
			if (Math.abs(currentCenterY - elementCenterY) < snapTolerance) {
				guides.push({ y: elementCenterY, type: 'center', elementId: element.id })
			}
			// Top to bottom edge
			if (Math.abs(currentY - elementBottom) < snapTolerance) {
				guides.push({ y: elementBottom, type: 'element', elementId: element.id })
			}
			// Bottom to top edge
			if (Math.abs(currentBottom - element.y) < snapTolerance) {
				guides.push({ y: element.y, type: 'element', elementId: element.id })
			}
		})

		// Canvas center guides
		const canvasCenterX = canvasWidth / 2
		const canvasCenterY = canvasHeight / 2

		if (Math.abs(currentCenterX - canvasCenterX) < snapTolerance) {
			guides.push({ x: canvasCenterX, type: 'center' })
		}
		if (Math.abs(currentCenterY - canvasCenterY) < snapTolerance) {
			guides.push({ y: canvasCenterY, type: 'center' })
		}

		// Canvas edge guides
		if (Math.abs(currentX) < snapTolerance) {
			guides.push({ x: 0, type: 'edge' })
		}
		if (Math.abs(currentY) < snapTolerance) {
			guides.push({ y: 0, type: 'edge' })
		}
		if (Math.abs(currentRight - canvasWidth) < snapTolerance) {
			guides.push({ x: canvasWidth, type: 'edge' })
		}
		if (Math.abs(currentBottom - canvasHeight) < snapTolerance) {
			guides.push({ y: canvasHeight, type: 'edge' })
		}

		return guides
	}, [elements, draggedElementId, dragOffset, zoom, canvasWidth, canvasHeight])

	if (!draggedElementId || guides.length === 0) return null

	return (
		<div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
			{guides.map((guide, index) => {
				const isCenter = guide.type === 'center'
				const isEdge = guide.type === 'edge'

				if (guide.x !== undefined) {
					// Vertical guide
					return (
						<div
							key={`v-${index}`}
							className={`absolute h-full border-l ${
								isCenter
									? 'border-blue-500 border-dashed'
									: isEdge
									? 'border-purple-500'
									: 'border-pink-500'
							}`}
							style={{
								left: guide.x * zoom,
								top: 0,
								borderWidth: 1,
								opacity: 0.8,
							}}
						/>
					)
				}

				if (guide.y !== undefined) {
					// Horizontal guide
					return (
						<div
							key={`h-${index}`}
							className={`absolute w-full border-t ${
								isCenter
									? 'border-blue-500 border-dashed'
									: isEdge
									? 'border-purple-500'
									: 'border-pink-500'
							}`}
							style={{
								top: guide.y * zoom,
								left: 0,
								borderWidth: 1,
								opacity: 0.8,
							}}
						/>
					)
				}

				return null
			})}
		</div>
	)
}
