'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { validatePresentationSchema } from '@/lib/schema-validator'
import type { PresentationType } from '@/lib/types'
import { useEffect, useState } from 'react'

interface JsonEditorProps {
	presentation: PresentationType
	onUpdate: (value: PresentationType) => void
}

export default function JsonEditor({ presentation, onUpdate }: JsonEditorProps) {
	const [jsonInput, setJsonInput] = useState('')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setJsonInput(JSON.stringify(presentation, null, 2))
	}, [presentation])

	const handleSubmit = () => {
		try {
			const parsedData = JSON.parse(jsonInput)
			const validationResult = validatePresentationSchema(parsedData)

			if (!validationResult.valid) {
				setError(`Invalid JSON schema: ${validationResult.error}`)
				return
			}

			setError(null)
			onUpdate(parsedData)
		} catch (err) {
			setError(
				`Invalid JSON format: ${err instanceof Error ? err.message : 'Please check your syntax.'}`
			)
		}
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>JSON Schema</CardTitle>
					<CardDescription>Edit the JSON directly to customize your presentation</CardDescription>
				</CardHeader>
				<CardContent>
					<pre className="text-xs bg-slate-50 p-4 rounded-md overflow-auto">
						{`{
  "title": "Presentation Title",
  "author": "Author Name",
  "theme": {
    "primaryColor": "#0070f3",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "headerFont": "\"Inter\", sans-serif",
    "bodyFont": "\"Inter\", sans-serif"
  },
  "slides": [
    {
      "id": "slide-1",
      "layout": "title-content",
      "backgroundColor": "#ffffff",
      "transition": { "type": "fade", "duration": 500 },
      "elements": [
        {
          "id": "element-1",
          "type": "heading",
          "content": "Slide Title",
          "position": { "x": 0, "y": 0 },
          "size": { "width": "100%", "height": "auto" },
          "style": { "fontSize": "2.5rem", "color": "#000000", "textAlign": "center" }
        },
        {
          "id": "element-2",
          "type": "bullet-list",
          "content": ["Item 1", "Item 2", "Item 3"],
          "position": { "x": 0, "y": 100 },
          "size": { "width": "100%", "height": "auto" },
          "style": { "fontSize": "1.5rem", "color": "#333333", "textAlign": "left" }
        }
      ]
    }
  ]
}`}
					</pre>
				</CardContent>
			</Card>

			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Textarea
				value={jsonInput}
				onChange={(e) => setJsonInput(e.target.value)}
				className="font-mono h-[500px] resize-none"
				placeholder="Paste your presentation JSON here..."
			/>

			<div className="flex justify-end">
				<Button onClick={handleSubmit}>Update Presentation</Button>
			</div>
		</div>
	)
}
