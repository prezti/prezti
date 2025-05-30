import type { Virtualizer } from '@tanstack/react-virtual'

/**
 * Configuration options for the virtualized slides overview
 */
export interface SlideOverviewConfig {
	/** Size of slide thumbnails */
	thumbnailSize: 'small' | 'medium' | 'large'
	/** Number of slides per row in the grid */
	slidesPerRow: number
	/** Whether to show slide numbers */
	showSlideNumbers: boolean
	/** Whether to show slide titles */
	showSlideTitles: boolean
	/** Whether to enable animations */
	enableAnimations: boolean
	/** Whether to show empty slide indicators */
	showEmptySlides: boolean
	/** Grid gap between slides in pixels */
	gridGap: number
}

/**
 * Individual slide item for virtualization
 */
export interface VirtualizedSlideItem {
	/** Unique slide identifier */
	id: string
	/** Index in the slides array */
	index: number
	/** Generated thumbnail data URL or null if not generated */
	thumbnail: string | null
	/** Whether thumbnail is currently being generated */
	isLoading: boolean
	/** Timestamp of last update */
	lastUpdated: number
	/** Whether the slide is currently selected */
	isSelected: boolean
	/** Whether the slide is the currently active slide */
	isActive: boolean
	/** Slide title extracted from content */
	title?: string
	/** Number of elements in the slide */
	elementCount: number
	/** Whether the slide is empty */
	isEmpty: boolean
}

/**
 * Thumbnail generation options
 */
export interface ThumbnailGenerationOptions {
	/** Width of the generated thumbnail */
	width: number
	/** Height of the generated thumbnail */
	height: number
	/** Quality of the thumbnail (0-1) */
	quality: number
	/** Background color for transparent slides */
	backgroundColor: string
	/** Whether to include a border */
	includeBorder: boolean
	/** Scale factor for high DPI displays */
	scaleFactor: number
}

/**
 * Cache entry for slide thumbnails
 */
export interface ThumbnailCacheEntry {
	/** The thumbnail data URL */
	thumbnail: string
	/** Timestamp when cached */
	timestamp: number
	/** Size of the thumbnail in bytes */
	size: number
	/** Hash of the slide content for invalidation */
	contentHash: string
	/** Generation options used */
	options: ThumbnailGenerationOptions
}

/**
 * LRU Cache configuration
 */
export interface CacheConfig {
	/** Maximum number of entries */
	maxEntries: number
	/** Maximum cache size in bytes */
	maxSize: number
	/** TTL for cache entries in milliseconds */
	ttl: number
	/** Whether to enable cache persistence */
	enablePersistence: boolean
}

/**
 * Slide selection state
 */
export interface SlideSelectionState {
	/** Currently selected slide IDs */
	selectedIds: Set<string>
	/** Currently active slide ID */
	activeId: string | null
	/** Last selected slide ID for range selection */
	lastSelectedId: string | null
	/** Whether multi-selection mode is active */
	isMultiSelectMode: boolean
}

/**
 * Grid layout configuration
 */
export interface GridLayoutConfig {
	/** Number of columns in the grid */
	columns: number
	/** Number of rows visible in viewport */
	visibleRows: number
	/** Height of each grid item */
	itemHeight: number
	/** Width of each grid item */
	itemWidth: number
	/** Gap between grid items */
	gap: number
	/** Total grid width */
	totalWidth: number
	/** Total grid height */
	totalHeight: number
}

/**
 * Virtualization state
 */
export interface VirtualizationState {
	/** Currently visible slide indices */
	visibleRange: {
		start: number
		end: number
	}
	/** Buffer size for pre-rendering */
	bufferSize: number
	/** Current scroll position */
	scrollTop: number
	/** Viewport height */
	viewportHeight: number
	/** Total content height */
	totalHeight: number
	/** Whether virtualization is enabled */
	isEnabled: boolean
}

/**
 * Search and filter state
 */
export interface SearchFilterState {
	/** Current search query */
	query: string
	/** Search results (slide indices) */
	results: number[]
	/** Whether search is active */
	isSearching: boolean
	/** Filter criteria */
	filters: {
		/** Show only empty slides */
		emptyOnly: boolean
		/** Show only slides with images */
		imagesOnly: boolean
		/** Show only slides with text */
		textOnly: boolean
		/** Minimum number of elements */
		minElements: number
		/** Maximum number of elements */
		maxElements: number
	}
	/** Filtered slide indices */
	filteredIndices: number[]
}

/**
 * Drag and drop state
 */
export interface DragDropState {
	/** Whether dragging is active */
	isDragging: boolean
	/** ID of the slide being dragged */
	draggedSlideId: string | null
	/** Current drop target index */
	dropTargetIndex: number | null
	/** Drag preview element */
	dragPreview: HTMLElement | null
	/** Original position of dragged slide */
	originalIndex: number | null
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
	/** Thumbnail generation time in ms */
	thumbnailGenerationTime: number
	/** Render time in ms */
	renderTime: number
	/** Memory usage in MB */
	memoryUsage: number
	/** Number of DOM nodes */
	domNodeCount: number
	/** Scroll performance (FPS) */
	scrollFPS: number
	/** Cache hit rate */
	cacheHitRate: number
}

/**
 * Overview component props
 */
export interface VirtualizedSlidesOverviewProps {
	/** Presentation data */
	presentation: import('../types').PresentationType
	/** Currently active slide index */
	activeSlideIndex: number
	/** Configuration options */
	config?: SlideOverviewConfig
	/** Callback when slide is selected */
	onSlideSelect: (index: number) => void
	/** Callback when presentation is updated */
	onPresentationUpdate?: (presentation: import('../types').PresentationType) => void
	/** Whether the overview is in fullscreen mode */
	isFullscreen?: boolean
	/** Custom CSS class name */
	className?: string
	/** Whether to show the grid overlay */
	showGrid?: boolean
	/** Aspect ratio for slides: 16:9 (default) or 4:3 */
	aspectRatio?: '16:9' | '4:3'
	/** Currently selected element IDs */
	selectedElementIds?: string[]
	/** Callback when selected element IDs change */
	onSelectedElementIdsChange?: (ids: string[]) => void
}

/**
 * Grid item component props
 */
export interface SlideGridItemProps {
	/** Slide data */
	slide: import('../types').SlideType
	/** Virtualized slide item data */
	item: VirtualizedSlideItem
	/** Configuration options */
	config: SlideOverviewConfig
	/** Whether the slide is selected */
	isSelected: boolean
	/** Whether the slide is active */
	isActive: boolean
	/** Callback when slide is clicked */
	onClick: (index: number, event: React.MouseEvent) => void
	/** Callback when slide is double-clicked */
	onDoubleClick: (index: number) => void
	/** Callback when context menu is requested */
	onContextMenu: (index: number, event: React.MouseEvent) => void
	/** Whether drag and drop is enabled */
	isDragEnabled: boolean
	/** Custom CSS class name */
	className?: string
}

/**
 * Grid controls component props
 */
export interface SlideGridControlsProps {
	/** Current configuration */
	config: SlideOverviewConfig
	/** Callback when configuration changes */
	onConfigChange: (config: Partial<SlideOverviewConfig>) => void
	/** Search and filter state */
	searchState: SearchFilterState
	/** Callback when search changes */
	onSearchChange: (query: string) => void
	/** Callback when filters change */
	onFiltersChange: (filters: Partial<SearchFilterState['filters']>) => void
	/** Total number of slides */
	totalSlides: number
	/** Number of visible slides after filtering */
	visibleSlides: number
	/** Whether controls are collapsed */
	isCollapsed?: boolean
}

/**
 * Hook return types
 */
export interface UseVirtualizedSlidesReturn {
	/** Virtualized slide items */
	virtualizedItems: VirtualizedSlideItem[]
	/** Grid layout configuration */
	gridLayout: GridLayoutConfig
	/** Virtualization state */
	virtualizationState: VirtualizationState
	/** Container ref for virtualization */
	containerRef: React.RefObject<HTMLDivElement | null>
	/** Scroll to specific slide */
	scrollToSlide: (index: number) => void
	/** Update grid layout */
	updateLayout: () => void
	/** Row virtualizer instance */
	rowVirtualizer?: Virtualizer<HTMLDivElement, Element>
	/** Currently visible slide indices */
	visibleSlideIndices?: number[]
}

export interface UseSlideThumbnailsReturn {
	/** Generate thumbnail for a slide */
	generateThumbnail: (slideId: string, options?: Partial<ThumbnailGenerationOptions>) => Promise<string>
	/** Get cached thumbnail */
	getCachedThumbnail: (slideId: string) => string | null
	/** Clear thumbnail cache */
	clearCache: () => void
	/** Cache statistics */
	cacheStats: {
		size: number
		hitRate: number
		entries: number
	}
}

export interface UseSlideSelectionReturn {
	/** Current selection state */
	selectionState: SlideSelectionState
	/** Select a slide */
	selectSlide: (index: number, multiSelect?: boolean) => void
	/** Select multiple slides */
	selectMultiple: (indices: number[]) => void
	/** Clear selection */
	clearSelection: () => void
	/** Select all slides */
	selectAll: () => void
	/** Toggle slide selection */
	toggleSelection: (index: number) => void
	/** Handle keyboard navigation */
	handleKeyboardNavigation: (event: React.KeyboardEvent) => void
}
