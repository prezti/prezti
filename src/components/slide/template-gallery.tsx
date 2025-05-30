'use client'

import type React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TemplateGalleryProps {
	isOpen: boolean
	onClose: () => void
	onSelectTemplate: (template: string) => void
}

export default function TemplateGallery({ isOpen, onClose, onSelectTemplate }: TemplateGalleryProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [filteredTemplates, setFilteredTemplates] = useState<TemplateItem[]>([])

	// Define all templates with metadata for better searching
	const allTemplates: TemplateItem[] = [
		{
			id: 'blank-card',
			title: 'Blank slide',
			description: 'Start with a clean slate',
			category: 'basic',
			tags: ['empty', 'blank', 'new'],
		},
		{
			id: 'image-and-text',
			title: 'Image and text',
			description: 'Image on left, text on right',
			category: 'basic',
			tags: ['image', 'text', 'side by side'],
		},
		{
			id: 'text-and-image',
			title: 'Text and image',
			description: 'Text on left, image on right',
			category: 'basic',
			tags: ['text', 'image', 'side by side'],
		},
		{
			id: 'two-columns',
			title: 'Two columns',
			description: 'Equal width text columns',
			category: 'basic',
			tags: ['columns', 'text', 'layout'],
		},
		{
			id: 'two-columns-with-headings',
			title: 'Two column with headings',
			description: 'Two columns with header text',
			category: 'basic',
			tags: ['columns', 'text', 'headers', 'layout'],
		},
		{
			id: 'three-columns',
			title: 'Three columns',
			description: 'Equal width text columns',
			category: 'basic',
			tags: ['columns', 'text', 'layout'],
		},
		{
			id: 'three-columns-with-headings',
			title: 'Three column with headings',
			description: 'Three columns with header text',
			category: 'basic',
			tags: ['columns', 'text', 'headers', 'layout'],
		},
		{
			id: 'four-columns',
			title: 'Four columns',
			description: 'Equal width text columns',
			category: 'basic',
			tags: ['columns', 'text', 'layout'],
		},
		{
			id: 'title-with-bullets',
			title: 'Title with bullets',
			description: 'Title and bullet points',
			category: 'basic',
			tags: ['title', 'bullets', 'list'],
		},
		{
			id: 'title-with-bullets-and-image',
			title: 'Title with bullets and image',
			description: 'Title, bullet points and image',
			category: 'basic',
			tags: ['title', 'bullets', 'image', 'list'],
		},
		{
			id: 'section-header',
			title: 'Section Header',
			description: 'Large title for section breaks',
			category: 'layouts',
			tags: ['title', 'header', 'section'],
		},
		{
			id: 'title-content',
			title: 'Title and Content',
			description: 'Standard slide with title and content',
			category: 'layouts',
			tags: ['title', 'content', 'standard'],
		},
		{
			id: 'quote',
			title: 'Quote',
			description: 'For testimonials or quotations',
			category: 'layouts',
			tags: ['quote', 'testimonial', 'text'],
		},
		{
			id: 'comparison',
			title: 'Comparison',
			description: 'Side-by-side comparison',
			category: 'layouts',
			tags: ['compare', 'versus', 'columns'],
		},
		{
			id: 'timeline',
			title: 'Timeline',
			description: 'Sequential events or milestones',
			category: 'layouts',
			tags: ['time', 'sequence', 'events', 'history'],
		},
		{
			id: 'dashboard-overview',
			title: 'Dashboard Overview',
			description: 'Data dashboard layout',
			category: 'suggested',
			tags: ['data', 'metrics', 'dashboard', 'charts'],
		},
		{
			id: 'business-model',
			title: 'Business Model',
			description: 'Business model explanation',
			category: 'suggested',
			tags: ['business', 'model', 'strategy'],
		},
		{
			id: 'next-milestones',
			title: 'Next Milestones',
			description: 'Future goals and objectives',
			category: 'suggested',
			tags: ['goals', 'milestones', 'future', 'roadmap'],
		},
	]

	// Filter templates based on search query
	useEffect(() => {
		if (!searchQuery) {
			setFilteredTemplates(allTemplates)
			return
		}

		const query = searchQuery.toLowerCase()
		const filtered = allTemplates.filter(
			(template) =>
				template.title.toLowerCase().includes(query) ||
				template.description.toLowerCase().includes(query) ||
				template.tags.some((tag) => tag.includes(query))
		)

		setFilteredTemplates(filtered)
	}, [searchQuery])

	// Reset search when dialog opens
	useEffect(() => {
		if (isOpen) {
			setSearchQuery('')
			setFilteredTemplates(allTemplates)
		}
	}, [isOpen])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden">
				{/* Header */}
				<div className="px-6 py-4 border-b bg-white">
					<DialogHeader className="space-y-3">
						<DialogTitle className="text-2xl font-semibold text-gray-900">Choose a Template</DialogTitle>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search templates..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
							/>
							{searchQuery && (
								<button
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									onClick={() => setSearchQuery('')}>
									<X size={16} />
								</button>
							)}
						</div>
					</DialogHeader>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-hidden">
					<Tabs defaultValue="basic" className="h-full flex flex-col">
						{/* Tab Navigation */}
						<div className="px-6 py-3 bg-gray-50 border-b">
							<TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
								<TabsTrigger
									value="basic"
									className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200">
									Basic
								</TabsTrigger>
								<TabsTrigger
									value="layouts"
									className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200">
									Layouts
								</TabsTrigger>
								<TabsTrigger
									value="suggested"
									className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200">
									Suggested
								</TabsTrigger>
							</TabsList>
						</div>

						{/* Template Grid */}
						<div className="flex-1 overflow-hidden">
							<ScrollArea className="h-full">
								<div className="p-6">
									{searchQuery ? (
										// Search results view
										<div>
											{filteredTemplates.length === 0 ? (
												<div className="flex flex-col items-center justify-center py-16 text-center">
													<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
														<Search className="h-8 w-8 text-gray-400" />
													</div>
													<h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
													<p className="text-gray-500 max-w-sm">
														Try different keywords or browse the categories above
													</p>
												</div>
											) : (
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
													{filteredTemplates.map((template) => (
														<TemplateCard
															key={template.id}
															title={template.title}
															description={template.description}
															onClick={() => onSelectTemplate(template.id)}>
															{renderTemplatePreview(template.id)}
														</TemplateCard>
													))}
												</div>
											)}
										</div>
									) : (
										// Category tabs view
										<>
											<TabsContent value="basic" className="m-0">
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
													<TemplateCard
														title="Blank slide"
														description="Start with a clean slate"
														onClick={() => onSelectTemplate('blank-card')}
														featured>
														<div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
															<div className="text-center">
																<div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded mx-auto mb-2"></div>
																<span className="text-xs text-gray-500 font-medium">Empty</span>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Image and text"
														description="Image on left, text on right"
														onClick={() => onSelectTemplate('image-and-text')}>
														<div className="flex w-full h-full rounded-lg overflow-hidden">
															<div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="20"
																	height="20"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	className="text-gray-500">
																	<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
																	<circle cx="9" cy="9" r="2" />
																	<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
																</svg>
															</div>
															<div className="w-1/2 p-3 bg-white">
																<div className="h-3 bg-gray-800 rounded mb-2 w-full"></div>
																<div className="h-2 bg-gray-300 rounded mb-1 w-full"></div>
																<div className="h-2 bg-gray-300 rounded mb-1 w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-3/5"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Text and image"
														description="Text on left, image on right"
														onClick={() => onSelectTemplate('text-and-image')}>
														<div className="flex w-full h-full rounded-lg overflow-hidden">
															<div className="w-1/2 p-3 bg-white">
																<div className="h-3 bg-gray-800 rounded mb-2 w-full"></div>
																<div className="h-2 bg-gray-300 rounded mb-1 w-full"></div>
																<div className="h-2 bg-gray-300 rounded mb-1 w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-3/5"></div>
															</div>
															<div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="20"
																	height="20"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	className="text-gray-500">
																	<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
																	<circle cx="9" cy="9" r="2" />
																	<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
																</svg>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Two columns"
														description="Equal width text columns"
														onClick={() => onSelectTemplate('two-columns')}>
														<div className="flex w-full h-full space-x-2 p-3 bg-white rounded-lg">
															<div className="w-1/2 space-y-2">
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-3/5"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
															</div>
															<div className="w-1/2 space-y-2">
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-3/5"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-full"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Two column with headings"
														description="Two columns with header text"
														onClick={() => onSelectTemplate('two-columns-with-headings')}>
														<div className="flex w-full h-full space-x-2 p-3 bg-white rounded-lg">
															<div className="w-1/2 space-y-2">
																<div className="h-3 bg-gray-800 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-3/5"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
															</div>
															<div className="w-1/2 space-y-2">
																<div className="h-3 bg-gray-800 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-3/5"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Three columns"
														description="Equal width text columns"
														onClick={() => onSelectTemplate('three-columns')}>
														<div className="flex w-full h-full space-x-1 p-3 bg-white rounded-lg">
															<div className="w-1/3 space-y-1">
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-3/4"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
															</div>
															<div className="w-1/3 space-y-1">
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-3/4"></div>
															</div>
															<div className="w-1/3 space-y-1">
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-3/4"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Three column with headings"
														description="Three columns with header text"
														onClick={() => onSelectTemplate('three-columns-with-headings')}>
														<div className="flex w-full h-full space-x-1 p-3 bg-white rounded-lg">
															<div className="w-1/3 space-y-1">
																<div className="h-2.5 bg-gray-800 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-3/4"></div>
															</div>
															<div className="w-1/3 space-y-1">
																<div className="h-2.5 bg-gray-800 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5"></div>
															</div>
															<div className="w-1/3 space-y-1">
																<div className="h-2.5 bg-gray-800 rounded w-4/5"></div>
																<div className="h-2 bg-gray-300 rounded w-full"></div>
																<div className="h-2 bg-gray-300 rounded w-3/4"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Four columns"
														description="Equal width text columns"
														onClick={() => onSelectTemplate('four-columns')}>
														<div className="flex w-full h-full space-x-1 p-2 bg-white rounded-lg">
															<div className="w-1/4 space-y-1">
																<div className="h-1.5 bg-gray-300 rounded w-full"></div>
																<div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
															</div>
															<div className="w-1/4 space-y-1">
																<div className="h-1.5 bg-gray-300 rounded w-full"></div>
																<div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
															</div>
															<div className="w-1/4 space-y-1">
																<div className="h-1.5 bg-gray-300 rounded w-full"></div>
																<div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
															</div>
															<div className="w-1/4 space-y-1">
																<div className="h-1.5 bg-gray-300 rounded w-full"></div>
																<div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Title with bullets"
														description="Title and bullet points"
														onClick={() => onSelectTemplate('title-with-bullets')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
															<div className="h-3 bg-gray-800 rounded mb-3 w-3/4"></div>
															<div className="space-y-2">
																<div className="flex items-center">
																	<div className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-full"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-3/5"></div>
																</div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Title with bullets and image"
														description="Title, bullet points and image"
														onClick={() => onSelectTemplate('title-with-bullets-and-image')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
															<div className="h-3 bg-gray-800 rounded mb-3 w-3/4"></div>
															<div className="flex space-x-2">
																<div className="w-3/5 space-y-2">
																	<div className="flex items-center">
																		<div className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2 flex-shrink-0"></div>
																		<div className="h-2 bg-gray-300 rounded w-full"></div>
																	</div>
																	<div className="flex items-center">
																		<div className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2 flex-shrink-0"></div>
																		<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																	</div>
																</div>
																<div className="w-2/5 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
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
																		className="text-gray-500">
																		<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
																		<circle cx="9" cy="9" r="2" />
																		<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
																	</svg>
																</div>
															</div>
														</div>
													</TemplateCard>
												</div>
											</TabsContent>

											<TabsContent value="layouts" className="m-0">
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
													<TemplateCard
														title="Comparison"
														description="Side-by-side comparison layout"
														onClick={() => onSelectTemplate('comparison')}>
														<div className="flex w-full h-full p-3 bg-white rounded-lg">
															<div className="w-1/2 space-y-2 pr-2">
																<div className="h-3 bg-gray-800 rounded w-3/4"></div>
																<div className="h-2 bg-green-300 rounded w-full"></div>
																<div className="h-2 bg-green-300 rounded w-4/5"></div>
																<div className="h-2 bg-green-300 rounded w-3/5"></div>
															</div>
															<div className="w-1/2 space-y-2 pl-2">
																<div className="h-3 bg-gray-800 rounded w-3/4"></div>
																<div className="h-2 bg-red-300 rounded w-full"></div>
																<div className="h-2 bg-red-300 rounded w-3/5"></div>
																<div className="h-2 bg-red-300 rounded w-4/5"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Process flow"
														description="Step-by-step process visualization"
														onClick={() => onSelectTemplate('process-flow')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
															<div className="h-3 bg-gray-800 rounded mb-3 w-3/4"></div>
															<div className="flex items-center space-x-2">
																<div className="w-1/4 h-8 bg-blue-200 rounded flex items-center justify-center">
																	<span className="text-xs font-bold text-blue-800">1</span>
																</div>
																<div className="h-0.5 bg-gray-400 flex-1"></div>
																<div className="w-1/4 h-8 bg-blue-200 rounded flex items-center justify-center">
																	<span className="text-xs font-bold text-blue-800">2</span>
																</div>
																<div className="h-0.5 bg-gray-400 flex-1"></div>
																<div className="w-1/4 h-8 bg-blue-200 rounded flex items-center justify-center">
																	<span className="text-xs font-bold text-blue-800">3</span>
																</div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Quote"
														description="Large quote or testimonial"
														onClick={() => onSelectTemplate('quote')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg justify-center">
															<div className="text-center">
																<div className="text-2xl text-gray-400 mb-2">&ldquo;</div>
																<div className="h-2 bg-gray-300 rounded w-full mb-1"></div>
																<div className="h-2 bg-gray-300 rounded w-4/5 mx-auto mb-3"></div>
																<div className="h-2 bg-gray-500 rounded w-1/3 mx-auto"></div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Timeline"
														description="Chronological timeline layout"
														onClick={() => onSelectTemplate('timeline')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
															<div className="h-3 bg-gray-800 rounded mb-3 w-1/2"></div>
															<div className="space-y-2">
																<div className="flex items-center">
																	<div className="h-3 w-3 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-full"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-3 w-3 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-3 w-3 rounded-full bg-blue-300 mr-3 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-3/5"></div>
																</div>
															</div>
														</div>
													</TemplateCard>
												</div>
											</TabsContent>

											<TabsContent value="suggested" className="m-0">
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
													<TemplateCard
														title="Dashboard Overview"
														description="Data dashboard layout"
														onClick={() => onSelectTemplate('dashboard-overview')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
															<div className="h-3 bg-gray-800 rounded mb-3 w-3/4"></div>
															<div className="grid grid-cols-2 gap-2">
																<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded border border-blue-200">
																	<div className="h-6 bg-blue-300 rounded mb-1 w-full"></div>
																	<div className="h-1 bg-blue-200 rounded w-2/3"></div>
																</div>
																<div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded border border-green-200">
																	<div className="h-6 bg-green-300 rounded mb-1 w-full"></div>
																	<div className="h-1 bg-green-200 rounded w-3/4"></div>
																</div>
																<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded border border-purple-200">
																	<div className="h-6 bg-purple-300 rounded mb-1 w-full"></div>
																	<div className="h-1 bg-purple-200 rounded w-1/2"></div>
																</div>
																<div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 rounded border border-orange-200">
																	<div className="h-6 bg-orange-300 rounded mb-1 w-full"></div>
																	<div className="h-1 bg-orange-200 rounded w-4/5"></div>
																</div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Business Model"
														description="Business model explanation"
														onClick={() => onSelectTemplate('business-model')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
															<div className="h-3 bg-gray-800 rounded mb-3 w-3/4"></div>
															<div className="space-y-2">
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-full"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-3/5"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																</div>
															</div>
														</div>
													</TemplateCard>

													<TemplateCard
														title="Next Milestones"
														description="Future goals and objectives"
														onClick={() => onSelectTemplate('next-milestones')}>
														<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
															<div className="h-3 bg-gray-800 rounded mb-3 w-3/4"></div>
															<div className="space-y-2">
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-full"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-yellow-500 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-red-500 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-3/5"></div>
																</div>
																<div className="flex items-center">
																	<div className="h-2 w-2 rounded-full bg-gray-400 mr-2 flex-shrink-0"></div>
																	<div className="h-2 bg-gray-300 rounded w-4/5"></div>
																</div>
															</div>
														</div>
													</TemplateCard>
												</div>
											</TabsContent>
										</>
									)}
								</div>
							</ScrollArea>
						</div>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// Helper function to render template preview based on template ID
function renderTemplatePreview(templateId: string) {
	switch (templateId) {
		case 'blank-card':
			return (
				<div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
					<div className="text-center">
						<div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded mx-auto mb-2"></div>
						<span className="text-xs text-gray-500 font-medium">Empty</span>
					</div>
				</div>
			)
		case 'image-and-text':
			return (
				<div className="flex w-full h-full rounded-lg overflow-hidden">
					<div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-gray-500">
							<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
							<circle cx="9" cy="9" r="2" />
							<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
						</svg>
					</div>
					<div className="w-1/2 p-3 bg-white">
						<div className="h-3 bg-gray-800 rounded mb-2 w-full"></div>
						<div className="h-2 bg-gray-300 rounded mb-1 w-full"></div>
						<div className="h-2 bg-gray-300 rounded mb-1 w-4/5"></div>
						<div className="h-2 bg-gray-300 rounded w-3/5"></div>
					</div>
				</div>
			)
		// Add more cases for other templates as needed
		default:
			return (
				<div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
					<div className="h-3 bg-gray-800 rounded mb-3 w-3/4"></div>
					<div className="h-2 bg-gray-300 rounded mb-1 w-full"></div>
					<div className="h-2 bg-gray-300 rounded mb-1 w-5/6"></div>
				</div>
			)
	}
}

interface TemplateCardProps {
	title: string
	description?: string
	onClick: () => void
	children: React.ReactNode
	className?: string
	featured?: boolean
}

function TemplateCard({
	title,
	description,
	onClick,
	children,
	className,
	featured,
}: TemplateCardProps) {
	return (
		<Card
			className={cn(
				'group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg',
				'border-2 hover:border-blue-500 hover:scale-[1.02]',
				featured ? 'border-blue-500 shadow-md' : 'border-gray-200',
				className
			)}
			onClick={onClick}>
			<div className="aspect-[4/3] bg-gray-50 border-b border-gray-200 overflow-hidden relative">
				<div className="w-full h-full p-4 flex items-center justify-center">{children}</div>
				{featured && (
					<div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
						Popular
					</div>
				)}
			</div>
			<CardContent className="p-4">
				<div className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
					{title}
				</div>
				{description && <div className="text-xs text-gray-500 leading-relaxed">{description}</div>}
			</CardContent>
		</Card>
	)
}

interface TemplateItem {
	id: string
	title: string
	description: string
	category: string
	tags: string[]
}
