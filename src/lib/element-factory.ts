import { v4 as uuid } from 'uuid'
import type { ElementType } from './types'

/**
 * Creates a unique element ID
 */
export function createElementId(): string {
	return `element-${uuid()}`
}

/**
 * Creates a new element with standard properties based on type
 *
 * @param type The type of element to create
 * @param x The x coordinate (can be absolute or percentage)
 * @param y The y coordinate (can be absolute or percentage)
 * @param options Optional overrides for default properties
 * @returns A new element with consistent properties
 */
export function createElementWithDefaults(
	type: ElementType['type'],
	x: number,
	y: number,
	options: Partial<ElementType> = {}
): ElementType {
	// Base properties common to all elements
	const baseElement: Partial<ElementType> = {
		id: createElementId(),
		x,
		y,
		rotation: 0,
		opacity: 1,
		isLocked: false,
		lockAspectRatio: false,
	}

	// Type-specific default properties
	let defaultProps: Partial<ElementType> = {}

	switch (type) {
		case 'heading':
			defaultProps = {
				type: 'heading',
				content: 'New Heading',
				width: 400,
				height: 60,
				style: {
					fontSize: 32,
					fontWeight: 'bold',
					color: '#000000',
					textAlign: 'center',
				},
			}
			break
		case 'paragraph':
			defaultProps = {
				type: 'paragraph',
				content: 'New paragraph text. Click to edit.',
				width: 400,
				height: 80,
				style: {
					fontSize: 16,
					fontWeight: 'normal',
					color: '#333333',
					textAlign: 'left',
				},
			}
			break
		case 'bullet-list':
			defaultProps = {
				type: 'bullet-list',
				content: ['First item', 'Second item', 'Third item'],
				width: 400,
				height: 120,
				style: {
					fontSize: 16,
					fontWeight: 'normal',
					color: '#333333',
					textAlign: 'left',
				},
			}
			break
		case 'numbered-list':
			defaultProps = {
				type: 'numbered-list',
				content: ['First item', 'Second item', 'Third item'],
				width: 400,
				height: 120,
				style: {
					fontSize: 16,
					fontWeight: 'normal',
					color: '#333333',
					textAlign: 'left',
				},
			}
			break
		case 'image':
			defaultProps = {
				type: 'image',
				src: '/placeholder.svg?height=300&width=400',
				alt: 'Image',
				width: 400,
				height: 300,
				borderWidth: 0,
				borderColor: 'transparent',
			}
			break
		case 'rectangle':
			defaultProps = {
				type: 'rectangle',
				width: 200,
				height: 150,
				style: {
					backgroundColor: '#f0f0f0',
				},
				borderWidth: 1,
				borderColor: '#cccccc',
			}
			break
		case 'circle':
			defaultProps = {
				type: 'circle',
				width: 150,
				height: 150,
				style: {
					backgroundColor: '#e1e1e1',
				},
				borderWidth: 1,
				borderColor: '#cccccc',
			}
			break
		case 'triangle':
			defaultProps = {
				type: 'triangle',
				width: 150,
				height: 150,
				style: {
					backgroundColor: '#fbbf24',
				},
				borderWidth: 1,
				borderColor: '#f59e0b',
			}
			break
		case 'line':
			defaultProps = {
				type: 'line',
				width: 200,
				height: 2,
				style: {
					backgroundColor: '#374151',
				},
				borderWidth: 0,
			}
			break
		case 'arrow':
			defaultProps = {
				type: 'arrow',
				width: 150,
				height: 30,
				style: {
					backgroundColor: '#3b82f6',
				},
				borderWidth: 1,
				borderColor: '#2563eb',
			}
			break
		case 'star':
			defaultProps = {
				type: 'star',
				width: 100,
				height: 100,
				style: {
					backgroundColor: '#eab308',
				},
				borderWidth: 1,
				borderColor: '#ca8a04',
			}
			break
		default:
			defaultProps = {
				type: 'paragraph',
				content: 'New element',
				width: 200,
				height: 80,
				style: {
					fontSize: 16,
					color: '#333333',
				},
			}
	}

	// Merge base properties with type-specific defaults and user-provided options
	return { ...baseElement, ...defaultProps, ...options } as ElementType
}

/**
 * Creates a standard element with center positioning
 * (centers the element at the provided coordinates)
 */
export function createCenteredElement(
	type: ElementType['type'],
	x: number,
	y: number,
	options: Partial<ElementType> = {}
): ElementType {
	// Determine element dimensions based on type
	let width = 200
	let height = 80

	switch (type) {
		case 'heading':
			width = 400
			height = 60
			break
		case 'paragraph':
			width = 400
			height = 80
			break
		case 'bullet-list':
		case 'numbered-list':
			width = 400
			height = 120
			break
		case 'image':
			width = 400
			height = 300
			break
		case 'rectangle':
			width = 200
			height = 150
			break
		case 'circle':
			width = 150
			height = 150
			break
		case 'triangle':
			width = 150
			height = 150
			break
		case 'line':
			width = 200
			height = 2
			break
		case 'arrow':
			width = 150
			height = 30
			break
		case 'star':
			width = 100
			height = 100
			break
	}

	// Override with any custom dimensions
	if (options.width) width = options.width
	if (options.height) height = options.height

	// Calculate centered position
	const centeredX = Math.max(0, x - width / 2)
	const centeredY = Math.max(0, y - height / 2)

	// Create element with calculated position
	return createElementWithDefaults(type, centeredX, centeredY, options)
}
