'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ElementType } from '@/lib/types'
import { Heading1, ImageIcon, List, ListOrdered, PlusCircle, Trash2, Type } from 'lucide-react'
import { Fragment } from 'react'

interface ElementEditorProps {
	elements: ElementType[]
	onUpdate: (elementId: string, updates: Partial<ElementType>) => void
	onBulkUpdate?: (updates: Partial<ElementType>) => void
}

export default function ElementEditor({ elements, onUpdate, onBulkUpdate }: ElementEditorProps) {
	const isSingleElement = elements.length === 1
	const element = isSingleElement ? elements[0] : null

	// Function to apply updates to all selected elements
	const applyToAll = (updates: Partial<ElementType>) => {
		if (onBulkUpdate) {
			onBulkUpdate(updates)
		} else if (elements.length > 1) {
			elements.forEach((el) => {
				onUpdate(el.id, updates)
			})
		}
	}

	const handleUpdateListItem = (index: number, value: string) => {
		if (!element || !Array.isArray(element.content)) return

		const updatedContent = [...element.content]
		updatedContent[index] = value
		onUpdate(element.id, { content: updatedContent })
	}

	const handleAddListItem = () => {
		if (!element || !Array.isArray(element.content)) return

		onUpdate(element.id, { content: [...element.content, 'New item'] })
	}

	const handleRemoveListItem = (index: number) => {
		if (!element || !Array.isArray(element.content)) return

		const updatedContent = [...element.content]
		updatedContent.splice(index, 1)
		onUpdate(element.id, { content: updatedContent })
	}

	// Render multi-element editor if multiple elements are selected
	if (!isSingleElement) {
		return (
			<div className="space-y-4 p-4 rounded-lg border border-gray-200 shadow-sm">
				<div className="text-sm font-medium pb-2 border-b border-gray-200 flex items-center">
					<div className="mr-2 p-1 rounded bg-blue-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-blue-600">
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<line x1="9" y1="3" x2="9" y2="21"></line>
							<line x1="15" y1="3" x2="15" y2="21"></line>
							<line x1="3" y1="9" x2="21" y2="9"></line>
							<line x1="3" y1="15" x2="21" y2="15"></line>
						</svg>
					</div>
					<span>Edit Multiple Elements ({elements.length})</span>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="multiColor">Text Color</Label>
						<div className="flex items-center space-x-2">
							<Input
								id="multiColor"
								type="text"
								placeholder="Apply to all elements"
								onChange={(e) => applyToAll({ style: { color: e.target.value } })}
								className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
							/>
							<input
								type="color"
								onChange={(e) => applyToAll({ style: { color: e.target.value } })}
								className="h-10 w-10 border border-gray-200 rounded cursor-pointer"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="multiFontSize">Font Size</Label>
						<Input
							id="multiFontSize"
							type="text"
							placeholder="e.g., 1rem, 16px"
							onChange={(e) => applyToAll({ style: { fontSize: e.target.value } })}
							className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="multiTextAlign">Text Alignment</Label>
						<Select
							onValueChange={(value: 'left' | 'center' | 'right') =>
								applyToAll({ style: { textAlign: value } })
							}>
							<SelectTrigger
								id="multiTextAlign"
								className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
								<SelectValue placeholder="Select alignment" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="left">Left</SelectItem>
								<SelectItem value="center">Center</SelectItem>
								<SelectItem value="right">Right</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		)
	}

	// Render single element editor if only one element is selected
	if (isSingleElement && element) {
		return (
			<div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
				<div className="text-sm font-medium pb-2 border-b border-gray-200 flex items-center">
					<div className="mr-2 p-1 rounded bg-blue-100">
						{element.type === 'heading' && <Heading1 size={16} className="text-blue-600" />}
						{element.type === 'paragraph' && <Type size={16} className="text-blue-600" />}
						{element.type === 'bullet-list' && <List size={16} className="text-blue-600" />}
						{element.type === 'numbered-list' && <ListOrdered size={16} className="text-blue-600" />}
						{element.type === 'image' && <ImageIcon size={16} className="text-blue-600" />}
					</div>
					<span>Edit {element.type.charAt(0).toUpperCase() + element.type.slice(1)}</span>
				</div>

				{(element.type === 'heading' || element.type === 'paragraph') && (
					<div className="space-y-2">
						<Label htmlFor="content" className="flex items-center">
							<span className="mr-1">Content</span>
							<span className="text-xs text-gray-500">(click to edit)</span>
						</Label>
						{element.type === 'heading' ? (
							<Input
								id="content"
								value={element.content?.toString() || ''}
								onChange={(e) => onUpdate(element.id, { content: e.target.value })}
								className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
							/>
						) : (
							<Textarea
								id="content"
								value={element.content?.toString() || ''}
								onChange={(e) => onUpdate(element.id, { content: e.target.value })}
								rows={4}
								className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
							/>
						)}
					</div>
				)}

				{(element.type === 'bullet-list' || element.type === 'numbered-list') && (
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>List Items</Label>
							<Button
								variant="outline"
								size="sm"
								onClick={handleAddListItem}
								className="border-blue-200 hover:bg-blue-50 hover:text-blue-600">
								<PlusCircle size={16} className="mr-1 text-blue-500" /> Add
							</Button>
						</div>
						<div className="space-y-2 max-h-60 overflow-y-auto pr-2">
							{Array.isArray(element.content) &&
								element.content.map((item, index) => (
									<div key={index} className="flex items-center space-x-2 group">
										<div className="w-6 flex-shrink-0 flex items-center justify-center">
											{element.type === 'bullet-list' ? (
												<div className="w-2 h-2 rounded-full bg-blue-500"></div>
											) : (
												<span className="text-sm font-medium text-blue-600">{index + 1}.</span>
											)}
										</div>
										<Input
											value={item}
											onChange={(e) => handleUpdateListItem(index, e.target.value)}
											placeholder={`Item ${index + 1}`}
											className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-200"
										/>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
											onClick={() => handleRemoveListItem(index)}>
											<Trash2 size={16} />
										</Button>
									</div>
								))}
						</div>
					</div>
				)}

				{element.type === 'image' && (
					<>
						<div className="space-y-2">
							<Label htmlFor="imageUrl">Image URL</Label>
							<Input
								id="imageUrl"
								value={element.content?.toString() || ''}
								onChange={(e) => onUpdate(element.id, { content: e.target.value })}
								placeholder="https://example.com/image.jpg"
								className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
							/>
							{element.content && (
								<div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
									<p className="text-xs text-gray-500 mb-2">Preview:</p>
									<div className="flex justify-center">
										<img
											src={element.content.toString() || '/placeholder.svg'}
											alt="Preview"
											className="max-h-32 object-contain border border-gray-300 rounded"
											onError={(e) => {
												;(e.target as HTMLImageElement).src = '/placeholder.svg?height=100&width=100'
												;(e.target as HTMLImageElement).alt = 'Image not found'
											}}
										/>
									</div>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="imageAlt">Alt Text</Label>
							<Input
								id="imageAlt"
								value={element.alt || ''}
								onChange={(e) => onUpdate(element.id, { alt: e.target.value })}
								placeholder="Description of the image"
								className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</>
				)}

				<div className="space-y-2">
					<Label htmlFor="fontSize">Font Size</Label>
					<Input
						id="fontSize"
						value={element.style?.fontSize || '1rem'}
						onChange={(e) =>
							onUpdate(element.id, { style: { ...element.style, fontSize: e.target.value } })
						}
						placeholder="1rem"
						className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="textColor">Text Color</Label>
					<div className="flex items-center space-x-2">
						<Input
							id="textColor"
							value={element.style?.color || '#000000'}
							onChange={(e) =>
								onUpdate(element.id, { style: { ...element.style, color: e.target.value } })
							}
							className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
						/>
						<input
							type="color"
							value={element.style?.color || '#000000'}
							onChange={(e) =>
								onUpdate(element.id, { style: { ...element.style, color: e.target.value } })
							}
							className="h-10 w-10 border border-gray-200 rounded cursor-pointer"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="textAlign">Text Alignment</Label>
					<Select
						value={element.style?.textAlign || 'left'}
						onValueChange={(value: 'left' | 'center' | 'right') =>
							onUpdate(element.id, { style: { ...element.style, textAlign: value } })
						}>
						<SelectTrigger
							id="textAlign"
							className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
							<SelectValue placeholder="Select alignment" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="left">Left</SelectItem>
							<SelectItem value="center">Center</SelectItem>
							<SelectItem value="right">Right</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="positionX">Position X (px)</Label>
					<Input
						id="positionX"
						type="number"
						value={element.position?.x || 0}
						onChange={(e) => {
							const x = Number(e.target.value)
							const y = element.position?.y || 0
							onUpdate(element.id, { position: { x, y } })
						}}
						className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="positionY">Position Y (px)</Label>
					<Input
						id="positionY"
						type="number"
						value={element.position?.y || 0}
						onChange={(e) => {
							const x = element.position?.x || 0
							const y = Number(e.target.value)
							onUpdate(element.id, { position: { x, y } })
						}}
						className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="width">Width</Label>
					<Input
						id="width"
						value={element.size?.width || '100%'}
						onChange={(e) => {
							const width = e.target.value
							const height = element.size?.height || 'auto'
							onUpdate(element.id, { size: { width, height } })
						}}
						placeholder="100%, 300px, etc."
						className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				{element.type === 'image' && (
					<div className="space-y-2">
						<Label htmlFor="height">Height</Label>
						<Input
							id="height"
							value={element.size?.height || 'auto'}
							onChange={(e) => {
								const width = element.size?.width || '100%'
								const height = e.target.value
								onUpdate(element.id, { size: { width, height } })
							}}
							placeholder="auto, 200px, etc."
							className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
				)}
			</div>
		)
	}

	// Return empty fragment if no element is selected
	return <Fragment />
}
