'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetHeader, SheetOverlay, SheetPortal, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateBackgroundStyle } from '@/lib/theme-utils'
import type { SlideThemeType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme-store'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Check, Palette, Plus, Search, Wand2 } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { ThemeEditor } from './theme-editor'

interface ThemeGalleryProps {
	onApplyTheme: (theme: SlideThemeType, scope: 'global' | 'current-slide') => void
}

// ThemeCard component
const ThemeCardComponent = ({
	theme,
	isCurrentTheme,
	onApplyTheme,
}: {
	theme: SlideThemeType
	isCurrentTheme: boolean
	onApplyTheme: (theme: SlideThemeType, scope: 'global' | 'current-slide') => void
}) => {
	const backgroundStyle = generateBackgroundStyle(theme)
	const hasIllustrations = theme.illustrations.length > 0
	const isGradient = theme.background.type === 'gradient'

	const handleApplyToCurrentSlide = useCallback(() => {
		onApplyTheme(theme, 'current-slide')
	}, [theme, onApplyTheme])

	const handleApplyToAllSlides = useCallback(() => {
		onApplyTheme(theme, 'global')
	}, [theme, onApplyTheme])

	return (
		<div className="group relative">
			<div
				className={cn(
					'relative overflow-hidden rounded-lg border-2 transition-all duration-200 cursor-pointer',
					'hover:border-primary hover:shadow-md hover:scale-[1.02]',
					isCurrentTheme ? 'border-primary ring-2 ring-primary/20 shadow-lg' : 'border-border'
				)}>
				{/* Theme Preview */}
				<div
					className="aspect-[16/9] relative"
					style={{
						...backgroundStyle,
						minHeight: '80px',
					}}>
					{/* Illustration overlay if present */}
					{hasIllustrations && theme.illustrations[0] && (
						<div
							className="absolute opacity-20"
							style={{
								top: `${theme.illustrations[0].position.y}%`,
								left: `${theme.illustrations[0].position.x}%`,
								width: `${theme.illustrations[0].size.width}%`,
								height: `${theme.illustrations[0].size.height}%`,
								transform: 'translate(-50%, -50%)',
							}}>
							<img
								src={theme.illustrations[0].src}
								alt={theme.illustrations[0].name}
								className="w-full h-full object-contain"
								onError={(e) => {
									// Hide if image fails to load
									e.currentTarget.style.display = 'none'
								}}
							/>
						</div>
					)}

					{/* Sample content preview */}
					<div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center">
						<div className="p-1 rounded w-full max-w-[85%]">
							<div
								className="text-sm font-semibold mb-1 truncate"
								style={{
									color: theme.typography.headingColor,
									fontFamily: theme.typography.headingFont,
									textShadow: theme.accessibility.textShadowEnabled
										? '0px 1px 2px rgba(0,0,0,0.5)'
										: 'none',
								}}>
								Title
							</div>
							<div
								className="text-xs opacity-90 truncate"
								style={{
									color: theme.typography.bodyColor,
									fontFamily: theme.typography.bodyFont,
									textShadow: theme.accessibility.textShadowEnabled
										? '0px 1px 2px rgba(0,0,0,0.4)'
										: 'none',
								}}>
								Body text preview
							</div>
						</div>
					</div>

					{/* Compact theme type indicators */}
					<div className="absolute top-1 right-1 flex gap-1">
						{isGradient && (
							<div
								className="w-2 h-2 rounded-full bg-white/80 border border-gray-400"
								title="Gradient"
							/>
						)}
						{hasIllustrations && (
							<div
								className="w-2 h-2 rounded-full bg-yellow-400/80 border border-yellow-600"
								title="Illustrated"
							/>
						)}
					</div>

					{/* Current theme indicator */}
					{isCurrentTheme && (
						<div className="absolute top-1 left-1">
							<div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md">
								<Check className="w-3 h-3 text-primary-foreground" />
							</div>
						</div>
					)}

					{/* Active theme overlay */}
					{isCurrentTheme && <div className="absolute inset-0 bg-primary/10 pointer-events-none" />}
				</div>

				{/* Compact Theme Info */}
				<div
					className={cn(
						'p-2 border-t transition-colors',
						isCurrentTheme ? 'bg-primary/5' : 'bg-background'
					)}>
					<div className="flex items-center justify-between mb-1">
						<div className="flex items-center gap-1 flex-1 pr-1">
							<h3 className="font-medium text-xs truncate">{theme.name}</h3>
							{isCurrentTheme && (
								<Badge variant="default" className="text-xs px-1.5 py-0">
									Active
								</Badge>
							)}
						</div>
						<Badge variant="outline" className="text-xs capitalize shrink-0">
							{theme.category}
						</Badge>
					</div>

					{/* Compact Apply buttons */}
					<div className="flex gap-1">
						<Button
							size="sm"
							variant="outline"
							className="flex-1 text-xs h-7 px-2"
							onClick={handleApplyToCurrentSlide}>
							Current
						</Button>
						<Button
							size="sm"
							variant={isCurrentTheme ? 'secondary' : 'default'}
							className="flex-1 text-xs h-7 px-2"
							onClick={handleApplyToAllSlides}>
							All Slides
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

// Memoized version with custom comparison
const ThemeCard = memo(ThemeCardComponent, (prevProps, nextProps) => {
	return (
		prevProps.theme.id === nextProps.theme.id &&
		prevProps.isCurrentTheme === nextProps.isCurrentTheme &&
		prevProps.onApplyTheme === nextProps.onApplyTheme
	)
})

export function ThemeGallery({ onApplyTheme }: ThemeGalleryProps) {
	// Only subscribe to the parts of the store we actually need for rendering
	const themeGalleryOpen = useThemeStore((state) => state.themeGalleryOpen)
	const closeThemeGallery = useThemeStore((state) => state.closeThemeGallery)
	const availableThemes = useThemeStore((state) => state.availableThemes)
	const customThemes = useThemeStore((state) => state.customThemes)
	// Get globalTheme separately to minimize re-renders
	const globalTheme = useThemeStore((state) => state.globalTheme)

	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [themeEditorOpen, setThemeEditorOpen] = useState(false)

	// Get all available themes - memoized to prevent unnecessary recalculations
	const allThemes = useMemo(() => [...availableThemes, ...customThemes], [availableThemes, customThemes])

	// Filter themes based on search and category
	const filteredThemes = useMemo(() => {
		let filtered = allThemes

		// Filter by category
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((theme) => theme.category === selectedCategory)
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(
				(theme) =>
					theme.name.toLowerCase().includes(query) ||
					theme.metadata.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
					theme.category.toLowerCase().includes(query)
			)
		}

		return filtered
	}, [allThemes, selectedCategory, searchQuery])

	// Get available categories
	const categories = useMemo(() => {
		const cats = ['all', ...new Set(allThemes.map((theme) => theme.category))]
		return cats
	}, [allThemes])

	// Separate themes by type for different tabs
	const gradientThemes = useMemo(
		() => filteredThemes.filter((theme) => theme.background.type === 'gradient'),
		[filteredThemes]
	)

	const handleApplyTheme = useCallback(
		(theme: SlideThemeType, scope: 'global' | 'current-slide') => {
			onApplyTheme(theme, scope)
			// Don't close the gallery so users can see the effects and try other themes
		},
		[onApplyTheme]
	)

	const handleThemeCreated = useCallback((theme: SlideThemeType) => {
		setThemeEditorOpen(false)
		// Theme is automatically added to the store by the editor
	}, [])

	return (
		<>
			<Sheet open={themeGalleryOpen} onOpenChange={closeThemeGallery}>
				<SheetPortal>
					{/* Completely transparent overlay - no background, no blur */}
					<SheetOverlay className="bg-transparent backdrop-blur-none" />
					<SheetPrimitive.Content
						className={cn(
							'fixed z-50 gap-4 bg-background p-0 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
							'inset-y-0 right-0 h-full w-[500px] sm:w-[600px] max-w-[90vw] border-s data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right'
						)}>
						<SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary z-10">
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<span className="sr-only">Close</span>
						</SheetPrimitive.Close>

						<SheetHeader className="p-6 pb-0">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Palette className="w-5 h-5" />
									<SheetTitle>Theme Gallery</SheetTitle>
									<Badge variant="secondary">{filteredThemes.length} themes</Badge>
								</div>
								<Button
									onClick={() => setThemeEditorOpen(true)}
									size="sm"
									className="flex items-center gap-2">
									<Plus className="w-4 h-4" />
									Create Custom Theme
								</Button>
							</div>
						</SheetHeader>

						<div className="px-6">
							{/* Search and Filter */}
							<div className="flex flex-col gap-3 mb-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
									<Input
										placeholder="Search themes..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="px-3 py-2 border border-input rounded-md bg-background text-sm">
									{categories.map((category) => (
										<option key={category} value={category}>
											{category === 'all'
												? 'All Categories'
												: category.charAt(0).toUpperCase() + category.slice(1)}
										</option>
									))}
								</select>
							</div>
						</div>

						<Tabs defaultValue="all" className="flex-1 flex flex-col">
							<div className="px-6">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="all" className="text-xs">
										All ({filteredThemes.length})
									</TabsTrigger>
									<TabsTrigger value="gradients" className="text-xs">
										Gradients ({gradientThemes.length})
									</TabsTrigger>
								</TabsList>
							</div>

							<div className="px-6 pb-6 flex-1">
								<TabsContent value="all" className="h-full">
									<ScrollArea className="h-[calc(100vh-300px)]">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
											{filteredThemes.map((theme) => (
												<ThemeCard
													key={theme.id}
													theme={theme}
													isCurrentTheme={globalTheme?.id === theme.id}
													onApplyTheme={handleApplyTheme}
												/>
											))}
										</div>
										{filteredThemes.length === 0 && (
											<div className="text-center py-12 text-muted-foreground">
												<Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
												<p>No themes found matching your criteria.</p>
											</div>
										)}
									</ScrollArea>
								</TabsContent>

								<TabsContent value="gradients" className="h-full">
									<ScrollArea className="h-[calc(100vh-300px)]">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
											{gradientThemes.map((theme) => (
												<ThemeCard
													key={theme.id}
													theme={theme}
													isCurrentTheme={globalTheme?.id === theme.id}
													onApplyTheme={handleApplyTheme}
												/>
											))}
										</div>
										{gradientThemes.length === 0 && (
											<div className="text-center py-12 text-muted-foreground">
												<Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
												<p>No gradient themes found.</p>
											</div>
										)}
									</ScrollArea>
								</TabsContent>

								{/* Removed solid and illustrated tabs to simplify the compact view */}
							</div>
						</Tabs>
					</SheetPrimitive.Content>
				</SheetPortal>
			</Sheet>

			{/* Theme Editor */}
			<ThemeEditor
				isOpen={themeEditorOpen}
				onClose={() => setThemeEditorOpen(false)}
				onThemeCreated={handleThemeCreated}
			/>
		</>
	)
}
