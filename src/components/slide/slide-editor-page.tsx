'use client'
import { AutoSaveIndicator } from '@/components/slide/auto-save-indicator'
import { EnhancedElementToolbar } from '@/components/slide/enhanced-element-toolbar'
import ImportDialog from '@/components/slide/import-dialog'
import PresentationRenderer from '@/components/slide/presentation-renderer'
import TemplateGallery from '@/components/slide/template-gallery'
import { ThemeGallery } from '@/components/slide/theme-gallery'
import { UnifiedSidebar } from '@/components/slide/unified-sidebar'
import { VirtualizedSlidesOverview } from '@/components/slide/virtualized-slides-overview'
import { ThemeSwitcher } from '@/components/ui/advanced/theme-switcher'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { defaultPresentation } from '@/lib/default-presentation'
import { createCenteredElement, createElementWithDefaults } from '@/lib/element-factory'
import { exportToJson, exportToPptx } from '@/lib/export-utils'
import { importFromJson, importFromPptx } from '@/lib/import-utils'
import { applyThemeToSlide } from '@/lib/theme-utils'
import type { ElementType, PresentationType, SlideThemeType, SlideType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme-store'
import {
	DndContext,
	type DragEndEvent,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import {
	ChevronDown,
	Download,
	FileJson,
	FileIcon as FilePresentation,
	Heading1,
	ImageIcon,
	Info,
	Layers,
	List,
	ListOrdered,
	Palette,
	PanelLeft,
	Play,
	Settings,
	Type,
	Upload,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function SlideEditorPage() {
	const { toast } = useToast()
	const [presentation, setPresentation] = useState<PresentationType>(defaultPresentation)
	const [presentationTitle, setPresentationTitle] = useState('Untitled Presentation')
	const [activeSlideIndex, setActiveSlideIndex] = useState(0)
	const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null)
	const [presentationHasUnsavedChanges, setPresentationHasUnsavedChanges] = useState(false)
	const [selectedElementIds, setSelectedElementIds] = useState<string[]>([])
	const [view, setView] = useState<'edit' | 'json' | 'preview'>('edit')
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
	const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
	const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false)
	const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false)
	const [showGrid, setShowGrid] = useState(false)
	const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3'>('16:9')
	const [lastSelectionSource, setLastSelectionSource] = useState<'click' | 'scroll' | undefined>(
		undefined
	)
	const [history, setHistory] = useState<PresentationType[]>([])
	const [historyIndex, setHistoryIndex] = useState(-1)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [isDraggingElement, setIsDraggingElement] = useState(false)
	const [draggedElementType, setDraggedElementType] = useState<ElementType['type'] | null>(null)
	const [userPreferences, setUserPreferences] = useState({
		showTooltips: true,
		enableAnimations: true,
		highContrastMode: false,
		largeText: false,
		autoSave: true,
	})
	const titleInputRef = useRef<HTMLInputElement>(null)
	const slideAreaRef = useRef<HTMLDivElement>(null)
	const [toolbarPosition, setToolbarPosition] = useState<{
		top: number
		left: number
		width: number
		height: number
	} | null>(null)

	// Theme store integration
	const { openThemeGallery, setGlobalTheme } = useThemeStore()

	// Configure DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	)

	// Load presentation and user preferences from localStorage on initial render
	useEffect(() => {
		// Clear localStorage completely to ensure we use the updated presentation structure
		localStorage.clear()
		console.log('Cleared localStorage, using default presentation data')

		// Load saved presentation
		const savedPresentation = localStorage.getItem('presentation')
		if (savedPresentation) {
			try {
				const parsed = JSON.parse(savedPresentation)
				setPresentation(parsed)
				// Set title from saved presentation if available
				if (parsed.title) {
					setPresentationTitle(parsed.title)
				}
			} catch (error) {
				console.error('Failed to parse saved presentation:', error)
			}
		}

		// Load aspect ratio preference
		const savedAspectRatio = localStorage.getItem('aspectRatio')
		if (savedAspectRatio === '16:9' || savedAspectRatio === '4:3') {
			setAspectRatio(savedAspectRatio as '16:9' | '4:3')
		}

		// Load user preferences
		const savedPreferences = localStorage.getItem('userPreferences')
		if (savedPreferences) {
			try {
				setUserPreferences(JSON.parse(savedPreferences))
			} catch (error) {
				console.error('Failed to parse user preferences:', error)
			}
		}

		// Load theme preference
		// This is now handled by next-themes
		// const savedTheme = localStorage.getItem('theme')
		// if (savedTheme === 'dark') {
		// 	setIsDarkMode(true)
		// 	document.documentElement.classList.add('dark')
		// }
	}, [])

	// Save presentation to localStorage when it changes
	useEffect(() => {
		if (userPreferences.autoSave) {
			localStorage.setItem(
				'presentation',
				JSON.stringify({
					...presentation,
					title: presentationTitle,
				})
			)
		}
	}, [presentation, presentationTitle, userPreferences.autoSave])

	// Save user preferences when they change
	useEffect(() => {
		localStorage.setItem('userPreferences', JSON.stringify(userPreferences))
	}, [userPreferences])

	// Save aspect ratio preference when it changes
	useEffect(() => {
		localStorage.setItem('aspectRatio', aspectRatio)
	}, [aspectRatio])

	// Handle keyboard shortcuts
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't trigger shortcuts when typing in input fields
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return
			}

			// Undo/Redo
			if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
				e.preventDefault()
				if (e.shiftKey) {
					handleRedo()
				} else {
					handleUndo()
				}
			}

			// Save
			if ((e.metaKey || e.ctrlKey) && e.key === 's') {
				e.preventDefault()
				handleSave()
			}

			// Navigation
			if (e.key === 'ArrowRight' && e.altKey) {
				e.preventDefault()
				if (activeSlideIndex < presentation.slides.length - 1) {
					setActiveSlideIndex(activeSlideIndex + 1)
				}
			}
			if (e.key === 'ArrowLeft' && e.altKey) {
				e.preventDefault()
				if (activeSlideIndex > 0) {
					setActiveSlideIndex(activeSlideIndex - 1)
				}
			}

			// New slide
			if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
				e.preventDefault()
				handleAddSlide()
			}

			// Present mode
			if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
				e.preventDefault()
				handlePresentMode()
			}

			// Toggle keyboard shortcuts help
			if (e.key === '?') {
				e.preventDefault()
				setIsKeyboardShortcutsOpen(true)
			}

			// Toggle sidebar
			if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
				e.preventDefault()
				setIsLeftSidebarOpen(!isLeftSidebarOpen)
			}

			// Delete selected elements
			if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
				e.preventDefault()
				handleDeleteSelectedElementsFromPage()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [
		activeSlideIndex,
		presentation.slides.length,
		historyIndex,
		history,
		isLeftSidebarOpen,
		selectedElementIds,
	])

	const handleSlideChange = (index: number, source?: 'click' | 'scroll') => {
		setActiveSlideIndex(index)
		setLastSelectionSource(source)
		if (source !== 'scroll') {
			setSelectedElementIds([])
		}
	}

	const handlePresentationUpdate = (updatedPresentation: PresentationType) => {
		setPresentation(updatedPresentation)
		setPresentationHasUnsavedChanges(true)

		// Add to history
		const newHistory = history.slice(0, historyIndex + 1)
		newHistory.push(updatedPresentation)
		if (newHistory.length > 50) newHistory.shift() // Limit history size
		setHistory(newHistory)
		setHistoryIndex(newHistory.length - 1)
	}

	const handleUpdateSlide = (updatedSlide: SlideType) => {
		const updatedSlides = [...presentation.slides]
		updatedSlides[activeSlideIndex] = updatedSlide
		handlePresentationUpdate({ ...presentation, slides: updatedSlides })
	}

	const handleUndo = () => {
		if (historyIndex > 0) {
			setHistoryIndex(historyIndex - 1)
			setPresentation(history[historyIndex - 1])

			toast({
				title: 'Undo',
				description: 'Previous action undone',
			})
		}
	}

	const handleRedo = () => {
		if (historyIndex < history.length - 1) {
			setHistoryIndex(historyIndex + 1)
			setPresentation(history[historyIndex + 1])

			toast({
				title: 'Redo',
				description: 'Action redone',
			})
		}
	}

	const handlePresentMode = () => {
		setIsFullscreen(true)
	}

	const handleExitPresentMode = () => {
		// Store the current slide index before exiting fullscreen
		const currentSlideIndex = activeSlideIndex

		// Update state in a single batch to avoid timing issues
		setIsFullscreen(false)
		setActiveSlideIndex(currentSlideIndex)
	}

	const handleSave = () => {
		// In a real app, this would save to a server
		localStorage.setItem(
			'presentation',
			JSON.stringify({
				...presentation,
				title: presentationTitle,
			})
		)
		setLastSavedTime(new Date())
		setPresentationHasUnsavedChanges(false)

		toast({
			title: 'Presentation Saved',
			description: 'Your presentation has been saved successfully',
		})
	}

	const handleExportJson = () => {
		exportToJson({ ...presentation, title: presentationTitle })
		toast({
			title: 'JSON Exported',
			description: 'Your presentation has been exported as a JSON file.',
		})
	}

	const handleExportPptx = async () => {
		try {
			await exportToPptx({ ...presentation, title: presentationTitle })
			toast({
				title: 'PPTX Exported',
				description: 'Your presentation has been exported as a PowerPoint file.',
			})
		} catch (error) {
			console.log(error)
			toast({
				title: 'Export Failed',
				description: 'There was an error exporting your presentation.',
			})
		}
	}

	const handleImportJson = async (file: File) => {
		try {
			const importedPresentation = await importFromJson(file)
			setPresentation(importedPresentation)
			if (importedPresentation.title) {
				setPresentationTitle(importedPresentation.title)
			}
			setIsImportDialogOpen(false)
			toast({
				title: 'JSON Imported',
				description: 'Your presentation has been imported successfully.',
			})
		} catch (error) {
			console.log(error)
			toast({
				title: 'Import Failed',
				description: 'The JSON file could not be imported. Please check the file format.',
			})
		}
	}

	const handleImportPptx = async (file: File) => {
		try {
			const importedPresentation = await importFromPptx(file)
			setPresentation(importedPresentation)
			if (importedPresentation.title) {
				setPresentationTitle(importedPresentation.title)
			}
			setIsImportDialogOpen(false)
			toast({
				title: 'PowerPoint Imported',
				description: 'Your presentation has been imported. Some formatting may have been simplified.',
			})
		} catch (error) {
			console.log(error)
			toast({
				title: 'Import Failed',
				description:
					'The PowerPoint file could not be imported. This feature has limited compatibility.',
			})
		}
	}

	const handleAddSlide = () => {
		setIsTemplateGalleryOpen(true)
	}

	const handleAddSlideFromTemplate = (template: string) => {
		// Map template string to a valid SlideType.layout value
		const getLayoutFromTemplate = (tmpl: string): SlideType['layout'] => {
			if (tmpl.includes('two-columns')) return 'two-columns'
			if (tmpl.includes('three-columns')) return 'three-columns'
			if (tmpl === 'blank-card') return 'blank'
			if (tmpl === 'image-and-text' || tmpl === 'text-and-image') return 'image-caption'
			// Default to a valid layout value
			return 'title-content'
		}

		// Use current aspect ratio dimensions
		const slideDimensions =
			aspectRatio === '16:9' ? { width: 960, height: 540 } : { width: 960, height: 720 }

		const newSlide: SlideType = {
			id: `slide-${Date.now()}`,
			layout: getLayoutFromTemplate(template),
			width: slideDimensions.width,
			height: slideDimensions.height,
			backgroundColor: '#ffffff', // Ensure white background is explicitly set
			transition: { type: 'fade' },
			elements: getElementsForTemplate(template),
		}

		const updatedSlides = [...presentation.slides, newSlide]
		handlePresentationUpdate({ ...presentation, slides: updatedSlides })
		setActiveSlideIndex(updatedSlides.length - 1)
		setIsTemplateGalleryOpen(false)

		toast({
			title: 'Slide Added',
			description: `New slide with ${template} template added`,
		})
	}

	const handleTitleChange = (newTitle: string) => {
		setPresentationTitle(newTitle)
		handlePresentationUpdate({
			...presentation,
			title: newTitle,
		})
	}

	const handleElementSelect = (elementIds: string[]) => {
		setSelectedElementIds(elementIds)
	}

	// Renamed from handleDeleteSelectedElements to avoid conflict and clarify global scope
	const handleDeleteSelectedElementsFromPage = () => {
		if (selectedElementIds.length === 0 || !presentation.slides[activeSlideIndex]) return

		const currentSlide = presentation.slides[activeSlideIndex]
		const updatedElements = currentSlide.elements.filter(
			(element) => !selectedElementIds.includes(element.id)
		)

		const updatedSlide = {
			...currentSlide,
			elements: updatedElements,
		}

		handleUpdateSlide(updatedSlide) // This will trigger history update
		setSelectedElementIds([]) // Clear global selection
	}

	const handleUpdateSelectedElementsOnPage = (updates: Partial<ElementType>[]) => {
		if (selectedElementIds.length === 0 || !presentation.slides[activeSlideIndex]) return

		const currentSlide = presentation.slides[activeSlideIndex]
		const updatedElements = currentSlide.elements.map((element) => {
			const updateForThisElement = updates.find(
				(u) => u.id === element.id && selectedElementIds.includes(element.id)
			)
			return updateForThisElement ? { ...element, ...updateForThisElement } : element
		})

		const updatedSlide = { ...currentSlide, elements: updatedElements }
		handleUpdateSlide(updatedSlide)
		// No toast here, as this is a general update, specific actions might add their own toasts
	}

	const handleDuplicateSelectedElementsOnPage = () => {
		if (selectedElementIds.length === 0 || !presentation.slides[activeSlideIndex]) return

		const currentSlide = presentation.slides[activeSlideIndex]
		const elementsToDuplicate = currentSlide.elements.filter((el) => selectedElementIds.includes(el.id))

		const newElements = elementsToDuplicate.map((el) => ({
			...el,
			id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // More robust ID
			x: (el.x || 0) + 20, // Offset duplicated elements
			y: (el.y || 0) + 20,
		}))

		const updatedSlide = {
			...currentSlide,
			elements: [...currentSlide.elements, ...newElements],
		}
		handleUpdateSlide(updatedSlide)
		setSelectedElementIds(newElements.map((el) => el.id)) // Select new elements

		toast({
			title: 'Elements Duplicated',
			description: `${newElements.length} element(s) duplicated and selected.`,
		})
	}

	const handleAddElementToPage = (type: ElementType['type']) => {
		if (!presentation.slides[activeSlideIndex]) return
		const currentSlide = presentation.slides[activeSlideIndex]

		// Calculate center based on the current slide dimensions or default
		const slideWidth = currentSlide.width || 960
		const slideHeight = currentSlide.height || 540
		const centerX = slideWidth / 2
		const centerY = slideHeight / 2

		const newElement = createCenteredElement(type, centerX, centerY) // Uses the existing factory

		const updatedSlide = {
			...currentSlide,
			elements: [...currentSlide.elements, newElement],
		}
		handleUpdateSlide(updatedSlide)
		setSelectedElementIds([newElement.id]) // Select the new element

		toast({
			title: 'Element Added',
			description: `New ${type} element added to the center of the slide and selected.`,
		})
	}

	// Theme application handler
	const handleApplyTheme = (theme: SlideThemeType, scope: 'global' | 'current-slide') => {
		if (scope === 'global') {
			// Update the theme store with the new global theme
			setGlobalTheme(theme)

			// Apply theme to all slides
			const updatedSlides = presentation.slides.map((slide) => {
				const themedSlide = applyThemeToSlide(slide, theme)
				return {
					...themedSlide,
					useGlobalTheme: true,
					themeOverride: undefined, // Clear any slide-specific overrides
				}
			})

			const updatedPresentation = {
				...presentation,
				slides: updatedSlides,
				globalTheme: theme,
			}

			handlePresentationUpdate(updatedPresentation)

			toast({
				title: 'Theme Applied',
				description: `"${theme.name}" theme has been applied to all slides.`,
			})
		} else {
			// Apply theme to current slide only
			const currentSlide = presentation.slides[activeSlideIndex]
			if (!currentSlide) return

			const themedSlide = applyThemeToSlide(currentSlide, theme)
			const updatedSlide = {
				...themedSlide,
				useGlobalTheme: false,
				themeOverride: theme,
			}

			handleUpdateSlide(updatedSlide)

			toast({
				title: 'Theme Applied',
				description: `"${theme.name}" theme has been applied to the current slide.`,
			})
		}
	}

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event
		const elementType = active.id as ElementType['type']
		setIsDraggingElement(true)
		setDraggedElementType(elementType)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { over } = event
		setIsDraggingElement(false)
		setDraggedElementType(null)

		// If dropped over the slide canvas
		if (over && over.id === 'slide-canvas' && draggedElementType) {
			const currentSlide = presentation.slides[activeSlideIndex]

			// Get the drop coordinates relative to the slide canvas
			// First, get a reference to the slide canvas element
			const slideCanvas = document.getElementById('slide-canvas')
			if (!slideCanvas) return

			const slideRect = slideCanvas.getBoundingClientRect()

			// Access pointer coordinates from event.activatorEvent if it's a PointerEvent
			const pointerEvent = event.activatorEvent as PointerEvent
			if (!pointerEvent) return

			// Calculate the exact drop position
			const dropX = Math.max(0, Math.min(pointerEvent.clientX - slideRect.left, slideRect.width - 100))
			const dropY = Math.max(0, Math.min(pointerEvent.clientY - slideRect.top, slideRect.height - 100))

			// Create a new element based on the dragged type with the exact drop position
			const newElement = createNewElement(draggedElementType, dropX, dropY)

			// Add the new element to the current slide
			const updatedSlide = {
				...currentSlide,
				elements: [...currentSlide.elements, newElement],
			}

			handleUpdateSlide(updatedSlide)

			// Select the newly added element
			setSelectedElementIds([newElement.id])

			toast({
				title: 'Element Added',
				description: `New ${draggedElementType} added to slide`,
			})
		}
	}

	// Use the element factory to create new elements with consistent properties
	const createNewElement = (type: ElementType['type'], x: number, y: number): ElementType => {
		return createCenteredElement(type, x, y)
	}

	// Handle aspect ratio changes - update all slides to maintain proper dimensions
	useEffect(() => {
		const newDimensions =
			aspectRatio === '16:9' ? { width: 960, height: 540 } : { width: 960, height: 720 }

		// Update all slides to use the new aspect ratio
		const updatedSlides = presentation.slides.map((slide) => ({
			...slide,
			width: newDimensions.width,
			height: newDimensions.height,
		}))

		// Only update if dimensions actually changed
		if (
			presentation.slides.some(
				(slide) => slide.width !== newDimensions.width || slide.height !== newDimensions.height
			)
		) {
			handlePresentationUpdate({
				...presentation,
				slides: updatedSlides,
			})
		}
	}, [aspectRatio, presentation, handlePresentationUpdate]) // Removed toast from dependencies as it's stable

	// Effect to calculate and update toolbar position
	const updateToolbarPosition = useCallback(() => {
		if (slideAreaRef.current) {
			const rect = slideAreaRef.current.getBoundingClientRect()
			setToolbarPosition({
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
				height: rect.height,
			})
		}
	}, [])

	useEffect(() => {
		updateToolbarPosition() // Initial call

		window.addEventListener('resize', updateToolbarPosition)
		window.addEventListener('scroll', updateToolbarPosition, true)

		// Use ResizeObserver for more precise updates to slideAreaRef changes
		let resizeObserver: ResizeObserver | null = null
		if (slideAreaRef.current) {
			resizeObserver = new ResizeObserver(updateToolbarPosition)
			resizeObserver.observe(slideAreaRef.current)
		}

		return () => {
			window.removeEventListener('resize', updateToolbarPosition)
			window.removeEventListener('scroll', updateToolbarPosition, true)
			if (resizeObserver && slideAreaRef.current) {
				resizeObserver.unobserve(slideAreaRef.current) // Check slideAreaRef.current still exists
			}
			if (resizeObserver) {
				resizeObserver.disconnect()
			}
		}
	}, [updateToolbarPosition, isLeftSidebarOpen]) // isLeftSidebarOpen is still relevant if it directly causes layout shifts before observer picks up

	if (isFullscreen) {
		return (
			<div className={cn('fixed inset-0 bg-black z-50')}>
				<PresentationRenderer
					presentation={{ ...presentation, title: presentationTitle }}
					isFullscreen={true}
					activeSlideIndex={activeSlideIndex}
					onSlideChange={handleSlideChange}
					onExit={handleExitPresentMode}
				/>
			</div>
		)
	}

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			modifiers={[restrictToWindowEdges]}>
			<div className={cn('min-h-screen flex flex-col')}>
				<div className="flex flex-1 h-screen overflow-hidden">
					{/* Main Application */}
					<div className="flex flex-col h-screen flex-1 overflow-hidden bg-background">
						{/* Top Navigation Bar */}
						<header className="border-b border-border bg-card py-2 px-4 shadow-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
										className="text-muted-foreground hover:text-foreground"
										aria-label={isLeftSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
										<PanelLeft className="h-5 w-5" />
									</Button>

									<div className="flex items-center">
										<Layers className="h-5 w-5 text-primary mr-2" />
										<input
											ref={titleInputRef}
											type="text"
											value={presentationTitle}
											onChange={(e) => handleTitleChange(e.target.value)}
											className="text-lg font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 rounded px-2 py-1 w-64"
											placeholder="Untitled Presentation"
											aria-label="Presentation title"
										/>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									{/* Main Action Buttons */}
									<div className="flex items-center space-x-1 mr-2">
										{/* AutoSaveIndicator remains */}
										<AutoSaveIndicator
											hasUnsavedChanges={presentationHasUnsavedChanges}
											lastSaved={lastSavedTime}
											onSave={handleSave}
											onUndo={handleUndo}
											onRedo={handleRedo}
											canUndo={historyIndex > 0}
											canRedo={historyIndex < history.length - 1}
											undoCount={historyIndex + 1}
											redoCount={history.length - 1 - historyIndex}
										/>

										<DropdownMenu>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="sm" aria-label="Export options">
																<Download size={16} className="mr-2" />
																Export
																<ChevronDown className="ml-2 h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
													</TooltipTrigger>
													<TooltipContent>Export presentation</TooltipContent>
												</Tooltip>
											</TooltipProvider>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={handleExportJson}>
													<FileJson size={16} className="mr-2" />
													Export as JSON
												</DropdownMenuItem>
												<DropdownMenuItem onClick={handleExportPptx}>
													<FilePresentation size={16} className="mr-2" />
													Export as PowerPoint
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>

										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setIsImportDialogOpen(true)}
														aria-label="Import">
														<Upload size={16} className="mr-2" />
														Import
													</Button>
												</TooltipTrigger>
												<TooltipContent>Import presentation</TooltipContent>
											</Tooltip>
										</TooltipProvider>

										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														onClick={openThemeGallery}
														aria-label="Themes">
														<Palette size={16} className="mr-2" />
														Themes
													</Button>
												</TooltipTrigger>
												<TooltipContent>Browse and apply themes</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>

									<ThemeSwitcher />

									<DropdownMenu>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-9 w-9"
															aria-label="More options">
															<Settings className="h-5 w-5" />
														</Button>
													</DropdownMenuTrigger>
												</TooltipTrigger>
												<TooltipContent>Settings and help</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Options</DropdownMenuLabel>
											<DropdownMenuGroup>
												<DropdownMenuItem onClick={() => setIsKeyboardShortcutsOpen(true)}>
													<Info size={16} className="mr-2" />
													Keyboard Shortcuts
												</DropdownMenuItem>
											</DropdownMenuGroup>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
												<Settings size={16} className="mr-2" />
												Settings
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>

									<Separator orientation="vertical" className="h-6 mx-1" />

									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													onClick={handlePresentMode}
													variant="default"
													size="sm"
													className="bg-primary hover:bg-primary/90"
													aria-label="Present">
													<Play size={16} className="mr-2" />
													Present
												</Button>
											</TooltipTrigger>
											<TooltipContent>Start presentation (Ctrl+P)</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</div>
						</header>

						<main className="flex flex-1 overflow-hidden">
							{/* Unified Sidebar */}
							{isLeftSidebarOpen && (
								<UnifiedSidebar
									presentation={presentation}
									activeSlideIndex={activeSlideIndex}
									onSlideChange={(index) => handleSlideChange(index, 'click')}
									onAddSlide={handleAddSlide}
									onUpdateSlide={handleUpdateSlide}
									onUpdatePresentation={handlePresentationUpdate}
									onElementSelect={handleElementSelect}
									onDeleteElements={handleDeleteSelectedElementsFromPage}
								/>
							)}

							{/* Main Content Area - Fixed layout structure */}
							<div className="flex-1 flex flex-col overflow-hidden min-w-0">
								{/* VirtualizedSlidesOverview - Wrapper becomes relative parent */}
								<div ref={slideAreaRef} className="flex-1 min-h-0 overflow-hidden relative">
									<VirtualizedSlidesOverview
										presentation={presentation}
										activeSlideIndex={activeSlideIndex}
										config={{
											thumbnailSize: 'large',
											slidesPerRow: 0, // Auto-calculate
											showSlideNumbers: true,
											showSlideTitles: true,
											enableAnimations: true,
											showEmptySlides: true,
											gridGap: 24,
										}}
										onSlideSelect={handleSlideChange}
										onPresentationUpdate={setPresentation}
										showGrid={showGrid}
										aspectRatio={aspectRatio}
										selectedElementIds={selectedElementIds}
										onSelectedElementIdsChange={handleElementSelect}
										lastSelectionSource={lastSelectionSource}
									/>
									{/* Global Element Toolbar is now portaled from within EnhancedElementToolbar itself */}
									{view === 'edit' && (
										<EnhancedElementToolbar
											selectedElements={selectedElementIds}
											elements={presentation.slides[activeSlideIndex]?.elements || []}
											slideWidth={presentation.slides[activeSlideIndex]?.width}
											slideHeight={presentation.slides[activeSlideIndex]?.height}
											toolbarPosition={toolbarPosition}
											onUpdateElements={handleUpdateSelectedElementsOnPage}
											onDuplicateElements={handleDuplicateSelectedElementsOnPage}
											onDeleteElements={handleDeleteSelectedElementsFromPage}
											onAddElement={(type) => handleAddElementToPage(type as ElementType['type'])}
										/>
									)}
								</div>
							</div>
						</main>
					</div>

					{/* Draggable Element Preview */}
					{isDraggingElement && draggedElementType && (
						<div className="fixed pointer-events-none z-50 opacity-70 bg-white p-2 rounded shadow-lg border border-primary">
							{draggedElementType === 'heading' && (
								<div className="flex items-center">
									<Heading1 size={16} className="mr-2 text-primary" />
									<span className="font-medium">Heading</span>
								</div>
							)}
							{draggedElementType === 'paragraph' && (
								<div className="flex items-center">
									<Type size={16} className="mr-2 text-primary" />
									<span className="font-medium">Paragraph</span>
								</div>
							)}
							{draggedElementType === 'bullet-list' && (
								<div className="flex items-center">
									<List size={16} className="mr-2 text-primary" />
									<span className="font-medium">Bullet List</span>
								</div>
							)}
							{draggedElementType === 'numbered-list' && (
								<div className="flex items-center">
									<ListOrdered size={16} className="mr-2 text-primary" />
									<span className="font-medium">Numbered List</span>
								</div>
							)}
							{draggedElementType === 'image' && (
								<div className="flex items-center">
									<ImageIcon size={16} className="mr-2 text-primary" />
									<span className="font-medium">Image</span>
								</div>
							)}
						</div>
					)}

					{/* Dialogs and Modals */}
					<ImportDialog
						isOpen={isImportDialogOpen}
						onClose={() => setIsImportDialogOpen(false)}
						onImportJson={handleImportJson}
						onImportPptx={handleImportPptx}
					/>

					<TemplateGallery
						isOpen={isTemplateGalleryOpen}
						onClose={() => setIsTemplateGalleryOpen(false)}
						onSelectTemplate={handleAddSlideFromTemplate}
					/>

					<ThemeGallery onApplyTheme={handleApplyTheme} />

					{/* Keyboard Shortcuts Dialog */}
					<Dialog open={isKeyboardShortcutsOpen} onOpenChange={setIsKeyboardShortcutsOpen}>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle className="flex items-center">
									<Info className="mr-2" size={18} />
									Keyboard Shortcuts
								</DialogTitle>
								<DialogDescription>
									Use these keyboard shortcuts to work more efficiently.
								</DialogDescription>
							</DialogHeader>
							<div className="grid grid-cols-2 gap-4 py-4">
								<div className="space-y-1">
									<h3 className="font-medium text-primary">Navigation</h3>
									<div className="flex justify-between text-sm">
										<span>Next slide</span>
										<kbd className="px-2 py-1 bg-muted rounded">Alt + →</kbd>
									</div>
									<div className="flex justify-between text-sm">
										<span>Previous slide</span>
										<kbd className="px-2 py-1 bg-muted rounded">Alt + ←</kbd>
									</div>
								</div>
								<div className="space-y-1">
									<h3 className="font-medium text-primary">Editing</h3>
									<div className="flex justify-between text-sm">
										<span>Undo</span>
										<kbd className="px-2 py-1 bg-muted rounded">Ctrl + Z</kbd>
									</div>
									<div className="flex justify-between text-sm">
										<span>Redo</span>
										<kbd className="px-2 py-1 bg-muted rounded">Ctrl + Shift + Z</kbd>
									</div>
									<div className="flex justify-between text-sm">
										<span>New slide</span>
										<kbd className="px-2 py-1 bg-muted rounded">Ctrl + N</kbd>
									</div>
									<div className="flex justify-between text-sm">
										<span>Save</span>
										<kbd className="px-2 py-1 bg-muted rounded">Ctrl + S</kbd>
									</div>
									<div className="flex justify-between text-sm">
										<span>Delete element</span>
										<kbd className="px-2 py-1 bg-muted rounded">Delete</kbd>
									</div>
								</div>
								<div className="space-y-1">
									<h3 className="font-medium text-primary">View</h3>
									<div className="flex justify-between text-sm">
										<span>Present mode</span>
										<kbd className="px-2 py-1 bg-muted rounded">Ctrl + P</kbd>
									</div>
									<div className="flex justify-between text-sm">
										<span>Toggle sidebar</span>
										<kbd className="px-2 py-1 bg-muted rounded">Ctrl + B</kbd>
									</div>
									<div className="flex justify-between text-sm">
										<span>Command palette</span>
										<kbd className="px-2 py-1 bg-muted rounded">Ctrl + K</kbd>
									</div>
								</div>
								<div className="space-y-1">
									<h3 className="font-medium text-primary">Help</h3>
									<div className="flex justify-between text-sm">
										<span>Show shortcuts</span>
										<kbd className="px-2 py-1 bg-muted rounded">?</kbd>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={() => setIsKeyboardShortcutsOpen(false)}>Close</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Settings Dialog */}
					<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle className="flex items-center">
									<Settings className="mr-2" size={18} />
									Settings
								</DialogTitle>
								<DialogDescription>Customize your presentation editor experience.</DialogDescription>
							</DialogHeader>
							<div className="py-4 space-y-4">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="show-tooltips">Show Tooltips</Label>
											<p className="text-sm text-muted-foreground">Display helpful tooltips on hover</p>
										</div>
										<Switch
											id="show-tooltips"
											checked={userPreferences.showTooltips}
											onCheckedChange={(checked) =>
												setUserPreferences({ ...userPreferences, showTooltips: checked })
											}
										/>
									</div>

									<Separator />

									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="enable-animations">Enable Animations</Label>
											<p className="text-sm text-muted-foreground">Use animations for transitions</p>
										</div>
										<Switch
											id="enable-animations"
											checked={userPreferences.enableAnimations}
											onCheckedChange={(checked) =>
												setUserPreferences({ ...userPreferences, enableAnimations: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="high-contrast">High Contrast Mode</Label>
											<p className="text-sm text-muted-foreground">
												Increase contrast for better visibility
											</p>
										</div>
										<Switch
											id="high-contrast"
											checked={userPreferences.highContrastMode}
											onCheckedChange={(checked) =>
												setUserPreferences({ ...userPreferences, highContrastMode: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="large-text">Large Text</Label>
											<p className="text-sm text-muted-foreground">
												Increase text size throughout the app
											</p>
										</div>
										<Switch
											id="large-text"
											checked={userPreferences.largeText}
											onCheckedChange={(checked) =>
												setUserPreferences({ ...userPreferences, largeText: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="auto-save">Auto Save</Label>
											<p className="text-sm text-muted-foreground">Automatically save your work</p>
										</div>
										<Switch
											id="auto-save"
											checked={userPreferences.autoSave}
											onCheckedChange={(checked) =>
												setUserPreferences({ ...userPreferences, autoSave: checked })
											}
										/>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={() => setIsSettingsOpen(false)}>Save Changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Help Center */}
				</div>
			</div>
		</DndContext>
	)
}

function getElementsForTemplate(template: string): ElementType[] {
	// Use the imported createElementWithDefaults from element-factory

	switch (template) {
		case 'blank-card':
			return []
		case 'image-and-text':
			return [
				createElementWithDefaults('image', 0, 0, {
					src: '/placeholder.svg?height=300&width=400',
					alt: 'Image',
					width: 400,
					height: 300,
				}),
				createElementWithDefaults('heading', 450, 0, {
					content: 'Slide Title',
					width: 500,
					height: 60,
					style: {
						fontSize: 32,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 450, 80, {
					content: 'Add your content here',
					width: 500,
					height: 200,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'text-and-image':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Slide Title',
					width: 500,
					height: 60,
					style: {
						fontSize: 32,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 0, 80, {
					content: 'Add your content here',
					width: 500,
					height: 200,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('image', 550, 0, {
					src: '/placeholder.svg?height=300&width=400',
					alt: 'Image',
					width: 400,
					height: 300,
				}),
			]
		case 'two-columns':
			return [
				createElementWithDefaults('paragraph', 0, 0, {
					content: 'Column 1 content',
					width: 450,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 500, 0, {
					content: 'Column 2 content',
					width: 450,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'two-columns-with-headings':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Column 1 Heading',
					width: 450,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 0, 60, {
					content: 'Column 1 content',
					width: 450,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('heading', 500, 0, {
					content: 'Column 2 Heading',
					width: 450,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 500, 60, {
					content: 'Column 2 content',
					width: 450,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'three-columns':
			return [
				createElementWithDefaults('paragraph', 0, 0, {
					content: 'Column 1 content',
					width: 300,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 320, 0, {
					content: 'Column 2 content',
					width: 300,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 640, 0, {
					content: 'Column 3 content',
					width: 300,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'three-columns-with-headings':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Column 1 Heading',
					width: 300,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 0, 60, {
					content: 'Column 1 content',
					width: 300,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('heading', 320, 0, {
					content: 'Column 2 Heading',
					width: 300,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 320, 60, {
					content: 'Column 2 content',
					width: 300,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('heading', 640, 0, {
					content: 'Column 3 Heading',
					width: 300,
					height: 60,
					style: {
						fontSize: 24,
						color: '#000000',
					},
				}),
				createElementWithDefaults('paragraph', 640, 60, {
					content: 'Column 3 content',
					width: 300,
					height: 240,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'four-columns':
			return [
				createElementWithDefaults('paragraph', 0, 0, {
					content: 'Column 1',
					width: 220,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 240, 0, {
					content: 'Column 2',
					width: 220,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 480, 0, {
					content: 'Column 3',
					width: 220,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
				createElementWithDefaults('paragraph', 720, 0, {
					content: 'Column 4',
					width: 220,
					height: 300,
					style: {
						fontSize: 18,
						color: '#333333',
					},
				}),
			]
		case 'title-with-bullets':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Slide Title',
					width: 960,
					height: 60,
					style: {
						fontSize: 40,
						color: '#000000',
					},
				}),
				createElementWithDefaults('bullet-list', 0, 80, {
					content: ['Bullet point 1', 'Bullet point 2', 'Bullet point 3', 'Bullet point 4'],
					width: 960,
					height: 300,
					style: {
						fontSize: 24,
						color: '#333333',
					},
				}),
			]
		case 'title-with-bullets-and-image':
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'Slide Title',
					width: 960,
					height: 60,
					style: {
						fontSize: 40,
						color: '#000000',
					},
				}),
				createElementWithDefaults('bullet-list', 0, 80, {
					content: ['Bullet point 1', 'Bullet point 2', 'Bullet point 3', 'Bullet point 4'],
					width: 576, // 60% of standard slide width
					height: 300,
					style: {
						fontSize: 24,
						color: '#333333',
					},
				}),
				createElementWithDefaults('image', 625, 80, {
					src: '/placeholder.svg?height=300&width=300',
					alt: 'Image',
					width: 336, // 35% of standard slide width
					height: 300,
				}),
			]
		default:
			return [
				createElementWithDefaults('heading', 0, 0, {
					content: 'New Slide',
					width: 960,
					height: 60,
					style: {
						fontSize: 40,
						color: '#000000',
					},
				}),
			]
	}
}
