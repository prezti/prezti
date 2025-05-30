import { defaultPresentation } from './default-presentation'
import type { PresentationType } from './types'

export async function importFromJson(file: File): Promise<PresentationType> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = (event) => {
			try {
				const jsonData = JSON.parse(event.target?.result as string)
				resolve(jsonData)
			} catch {
				reject(new Error('Failed to parse JSON file'))
			}
		}

		reader.onerror = () => {
			reject(new Error('Failed to read file'))
		}

		reader.readAsText(file)
	})
}

export async function importFromPptx(file: File): Promise<PresentationType> {
	// This is a simplified mock implementation
	// In a real application, you would use a library like pptx-parser or a backend service

	// For now, we'll return a modified version of the default presentation
	// with a note that this is a mock import

	const mockImport: PresentationType = {
		...defaultPresentation,
		title: file.name.replace(/\.(ppt|pptx)$/, ''),
		author: 'Imported Presentation',
		date: new Date().toISOString().split('T')[0],
		slides: [
			{
				id: 'imported-slide-1',
				layout: 'title-only',
				backgroundColor: '#ffffff',
				transition: { type: 'fade' },
				elements: [
					{
						id: 'imported-element-1',
						type: 'heading',
						content: `Imported from ${file.name}`,
						x: 0,
						y: 0,
						width: 960,
						height: 120,
						style: { fontSize: '2.5rem', color: '#000000', textAlign: 'center' },
					},
					{
						id: 'imported-element-2',
						type: 'paragraph',
						content:
							'This is a mock import. In a real application, the PowerPoint content would be parsed and converted to the JSON format.',
						x: 0,
						y: 120,
						width: 960,
						height: 80,
						style: { fontSize: '1.2rem', color: '#666666', textAlign: 'center' },
					},
				],
			},
			...defaultPresentation.slides.slice(1),
		],
	}

	// Simulate async processing
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockImport)
		}, 1000)
	})
}
