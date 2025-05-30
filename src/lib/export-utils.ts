import type { PresentationType } from './types'

export function exportToJson(presentation: PresentationType) {
	const jsonString = JSON.stringify(presentation, null, 2)
	const blob = new Blob([jsonString], { type: 'application/json' })
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = `${presentation.title.replace(/\s+/g, '_')}.json`
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

export async function exportToPptx(presentation: PresentationType) {
	// Dynamic import to avoid build-time issues
	const pptxgen = (await import('pptxgenjs')).default

	// Create a new presentation
	const pptx = new pptxgen()

	// Set presentation properties
	pptx.author = presentation.author || 'Presentation Creator'
	pptx.title = presentation.title

	// Set default slide size (16:9)
	pptx.layout = 'LAYOUT_16x9'

	// Process each slide
	presentation.slides.forEach((slide) => {
		// Create a new slide
		const pptxSlide = pptx.addSlide()

		// Set background color
		if (slide.backgroundColor) {
			pptxSlide.background = { color: slide.backgroundColor }
		}

		// Process each element
		slide.elements.forEach((element) => {
			const x = (element.position?.x || 0) / 720 // Convert pixels to inches (approximate)
			const y = (element.position?.y || 0) / 720 // Convert pixels to inches (approximate)

			// Calculate width and height as numbers
			let width: number = 6.5 // Default width in inches
			let height: number = 1 // Default height in inches

			if (element.size) {
				if (typeof element.size.width === 'number') {
					width = element.size.width / 720 // Convert pixels to inches
				} else if (typeof element.size.width === 'string' && element.size.width.endsWith('%')) {
					width = (Number.parseInt(element.size.width) / 100) * 10 // Convert percentage to inches (10 inches is slide width)
				}

				if (typeof element.size.height === 'number') {
					height = element.size.height / 720 // Convert pixels to inches
				} else if (typeof element.size.height === 'string' && element.size.height.endsWith('%')) {
					height = (Number.parseInt(element.size.height) / 100) * 5.625 // Convert percentage to inches (5.625 inches is slide height)
				}
			}

			// Get text alignment
			const align = element.style?.textAlign || 'left'

			// Get font size with proper type checking
			let fontSize = 18 // Default
			if (element.style?.fontSize) {
				if (typeof element.style.fontSize === 'string') {
					if (element.style.fontSize.endsWith('rem')) {
						fontSize = Number.parseFloat(element.style.fontSize) * 16
					} else if (element.style.fontSize.endsWith('px')) {
						fontSize = Number.parseFloat(element.style.fontSize)
					}
				} else if (typeof element.style.fontSize === 'number') {
					fontSize = element.style.fontSize
				}
			}

			// Add element based on type
			switch (element.type) {
				case 'heading':
					pptxSlide.addText(element.content?.toString() || '', {
						x,
						y,
						w: width,
						h: height,
						fontSize: fontSize / 2, // Convert to points
						color: element.style?.color || presentation.theme.textColor || '#000000',
						align: align as 'left' | 'center' | 'right' | 'justify',
						bold: true,
					})
					break

				case 'paragraph':
					pptxSlide.addText(element.content?.toString() || '', {
						x,
						y,
						w: width,
						h: height,
						fontSize: fontSize / 2, // Convert to points
						color: element.style?.color || presentation.theme.textColor || '#000000',
						align: align as 'left' | 'center' | 'right' | 'justify',
					})
					break

				case 'bullet-list':
					if (Array.isArray(element.content)) {
						const bulletText = element.content.map((item) => ({ text: item, options: {} }))
						pptxSlide.addText(bulletText, {
							x,
							y,
							w: width,
							h: Math.max(height, 3),
							fontSize: fontSize / 2, // Convert to points
							color: element.style?.color || presentation.theme.textColor || '#000000',
							bullet: { type: 'bullet' },
							align: align as 'left' | 'center' | 'right' | 'justify',
						})
					}
					break

				case 'numbered-list':
					if (Array.isArray(element.content)) {
						const numberedText = element.content.map((item) => ({ text: item, options: {} }))
						pptxSlide.addText(numberedText, {
							x,
							y,
							w: width,
							h: Math.max(height, 3),
							fontSize: fontSize / 2, // Convert to points
							color: element.style?.color || presentation.theme.textColor || '#000000',
							bullet: { type: 'number' },
							align: align as 'left' | 'center' | 'right' | 'justify',
						})
					}
					break

				case 'image':
					try {
						const imageUrl = element.content?.toString() || ''

						// Skip placeholder images
						if (imageUrl.includes('placeholder.svg')) {
							pptxSlide.addText('[Image Placeholder]', {
								x,
								y,
								w: width,
								h: Math.max(height, 3),
								fontSize: 14,
								color: '#666666',
								align: 'center',
							})
						} else {
							pptxSlide.addImage({
								path: imageUrl,
								x,
								y,
								w: width,
								h: Math.max(height, 3),
							})
						}
					} catch (error) {
						console.error('Error adding image:', error)
					}
					break
			}
		})
	})

	// Save the presentation
	await pptx.writeFile({ fileName: `${presentation.title.replace(/\s+/g, '_')}.pptx` })
}
