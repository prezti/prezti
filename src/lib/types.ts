export interface ThemeType {
	primaryColor?: string
	secondaryColor?: string
	backgroundColor?: string
	textColor?: string
	headerFont?: string
	bodyFont?: string
}

// Enhanced theme system types
export interface ColorStop {
	color: string
	position: number // 0-100
}

export interface GradientDefinition {
	type: 'linear' | 'radial'
	stops: ColorStop[]
	angle?: number // For linear gradients (0-360)
	center?: { x: number; y: number } // For radial gradients (0-100)
}

export interface BackgroundImageDefinition {
	src: string
	localSrc?: string // For uploaded images
	alt?: string
	position:
		| 'center'
		| 'top'
		| 'bottom'
		| 'left'
		| 'right'
		| 'top-left'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-right'
		| 'custom'
	size: 'cover' | 'contain' | 'auto' | 'custom'
	customPosition?: { x: number; y: number } // Percentage values
	customSize?: { width: number; height: number } // Percentage values
	opacity: number // 0-1
	blendMode: 'normal' | 'multiply' | 'overlay' | 'screen' | 'soft-light' | 'hard-light'
}

export interface PatternDefinition {
	type: 'dots' | 'lines' | 'grid' | 'diagonal' | 'hexagon' | 'triangle'
	color: string
	backgroundColor: string
	size: number // Pattern size in pixels
	opacity: number // 0-1
	spacing: number // Space between pattern elements
}

export interface IllustrationInstance {
	id: string
	assetId: string
	name?: string
	src: string
	position: { x: number; y: number; z: number } // z for layer order
	size: { width: number; height: number }
	rotation: number // degrees
	opacity: number // 0-1
	color?: string // For colorizable illustrations
	locked: boolean
	visible: boolean
}

export interface TypographyDefinition {
	headingFont: string
	bodyFont: string
	headingColor: string
	bodyColor: string
	headingSizes: {
		h1: number
		h2: number
		h3: number
		h4: number
		h5: number
		h6: number
	}
	lineHeight: number
	letterSpacing: number
}

export interface AccessibilitySettings {
	contrastRatio: number
	highContrastMode: boolean
	textShadowEnabled: boolean
	backgroundImageDisabled: boolean
	reducedMotion: boolean
}

export interface SlideThemeType extends ThemeType {
	id: string
	name: string
	category: 'basic' | 'professional' | 'creative' | 'industry' | 'custom'

	// Enhanced background system
	background: {
		type: 'color' | 'gradient' | 'image' | 'pattern'
		color?: string
		gradient?: GradientDefinition
		image?: BackgroundImageDefinition
		pattern?: PatternDefinition
	}

	// Illustration system
	illustrations: IllustrationInstance[]

	// Enhanced typography
	typography: TypographyDefinition

	// Accessibility
	accessibility: AccessibilitySettings

	// Metadata
	metadata: {
		createdBy: 'system' | 'user'
		isCustom: boolean
		tags: string[]
		previewImage?: string
		createdAt?: string
		updatedAt?: string
		version: string
	}
}

export interface ElementPosition {
	x: number
	y: number
}

export interface ElementSize {
	width: string | number
	height: string | number
}

export interface ElementStyle {
	fontSize?: string | number
	fontFamily?: string
	color?: string
	textAlign?: 'left' | 'center' | 'right' | 'justify'
	fontWeight?: string | number
	fontStyle?: string
	textDecoration?: string
	backgroundColor?: string
	lineHeight?: string | number
	letterSpacing?: string | number
}

export interface ElementType {
	id: string
	name?: string
	type:
		| 'heading'
		| 'paragraph'
		| 'bullet-list'
		| 'numbered-list'
		| 'image'
		| 'rectangle'
		| 'circle'
		| 'triangle'
		| 'line'
		| 'arrow'
		| 'star'
		| 'list'
	content?: string | string[]
	x: number
	y: number
	width: number
	height: number
	style?: ElementStyle
	alt?: string
	rotation?: number
	opacity?: number
	borderWidth?: number
	borderColor?: string
	backgroundColor?: string
	fontSize?: string | number
	fontWeight?: string | number
	fontStyle?: string
	textDecoration?: string
	color?: string
	textAlign?: 'left' | 'center' | 'right' | 'justify'
	src?: string
	isLocked?: boolean
	lockAspectRatio?: boolean
	position?: ElementPosition
	size?: ElementSize
	zIndex?: number
	groupId?: string | null
}

export interface ElementGroupType {
	id: string
	name?: string
	elementIds: string[]
}

export interface SlideType {
	id: string
	layout?:
		| 'title-only'
		| 'title-content'
		| 'section-header'
		| 'image-caption'
		| 'blank'
		| 'two-columns'
		| 'three-columns'
	width?: number
	height?: number
	backgroundColor?: string
	transition?: {
		type: 'fade' | 'slide' | 'zoom' | 'spin'
		duration?: number
	}
	elements: ElementType[]
	selectedElementIds?: string[]
	groups?: ElementGroupType[]
	// Enhanced theme support
	themeOverride?: Partial<SlideThemeType>
	useGlobalTheme?: boolean
	themeTransition?: {
		enabled: boolean
		duration: number
		easing: string
	}
	// Additional properties for simple slide editing
	title?: string
	subtitle?: string
	content?: string
	bulletPoints?: string[]
	titleColor?: string
	titleSize?: string
	subtitleColor?: string
	subtitleSize?: string
	contentColor?: string
	contentSize?: string
	image?: string
	imageAlt?: string
	imageWidth?: string
	alignment?: 'flex-start' | 'center' | 'flex-end'
}

export interface PresentationType {
	title: string
	author?: string
	date?: string
	version?: string
	theme: ThemeType
	// Enhanced theme system
	globalTheme?: SlideThemeType
	customThemes?: SlideThemeType[]
	themeSettings?: {
		allowSlideOverrides: boolean
		autoContrastAdjustment: boolean
		progressiveImageLoading: boolean
		accessibilityMode: boolean
	}
	slides: SlideType[]
}

// Re-export virtualized slides types
export * from './types/virtualizedSlides'
