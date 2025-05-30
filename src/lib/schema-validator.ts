// Define proper TypeScript interfaces for the presentation schema
export type ElementType = 'heading' | 'paragraph' | 'bullet-list' | 'numbered-list' | 'image'

export interface PresentationElement {
	id: string | number
	type: ElementType
	content: string | string[]
}

export interface PresentationSlide {
	id: string | number
	elements: PresentationElement[]
}

export interface PresentationData {
	title: string
	slides: PresentationSlide[]
}

export function validatePresentationSchema(data: unknown): { valid: boolean; error?: string } {
	// Check if data is an object
	if (typeof data !== 'object' || data === null) {
		return { valid: false, error: 'Data must be an object' }
	}

	// Type assertion after basic type check
	const obj = data as Record<string, unknown>

	// Check required fields
	if (!obj.title) {
		return { valid: false, error: 'Presentation must have a title' }
	}

	if (!Array.isArray(obj.slides)) {
		return { valid: false, error: 'Presentation must have a slides array' }
	}

	// Check slides
	for (let i = 0; i < obj.slides.length; i++) {
		const slide = obj.slides[i] as Record<string, unknown>

		if (!slide.id) {
			return { valid: false, error: `Slide at index ${i} must have an id` }
		}

		if (!Array.isArray(slide.elements)) {
			return { valid: false, error: `Slide at index ${i} must have an elements array` }
		}

		// Check elements
		for (let j = 0; j < slide.elements.length; j++) {
			const element = slide.elements[j] as Record<string, unknown>

			if (!element.id) {
				return { valid: false, error: `Element at index ${j} in slide ${i} must have an id` }
			}

			if (!element.type) {
				return { valid: false, error: `Element at index ${j} in slide ${i} must have a type` }
			}

			const validTypes: ElementType[] = ['heading', 'paragraph', 'bullet-list', 'numbered-list', 'image']
			if (!validTypes.includes(element.type as ElementType)) {
				return {
					valid: false,
					error: `Element at index ${j} in slide ${i} has invalid type. Must be one of: ${validTypes.join(
						', '
					)}`,
				}
			}

			if (element.content === undefined) {
				return { valid: false, error: `Element at index ${j} in slide ${i} must have content` }
			}

			// Type-specific validations
			if (
				(element.type === 'bullet-list' || element.type === 'numbered-list') &&
				!Array.isArray(element.content)
			) {
				return {
					valid: false,
					error: `Element at index ${j} in slide ${i} of type ${element.type} must have an array content`,
				}
			}

			if (
				(element.type === 'heading' || element.type === 'paragraph' || element.type === 'image') &&
				typeof element.content !== 'string'
			) {
				return {
					valid: false,
					error: `Element at index ${j} in slide ${i} of type ${element.type} must have a string content`,
				}
			}
		}
	}

	return { valid: true }
}
