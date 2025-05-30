import type {
	BackgroundImageDefinition,
	ElementType,
	GradientDefinition,
	SlideThemeType,
	SlideType,
} from './types'

/**
 * Generate CSS style object from theme background definition
 */
export function generateBackgroundStyle(theme: SlideThemeType): React.CSSProperties {
	const { background } = theme

	switch (background.type) {
		case 'color':
			return {
				backgroundColor: background.color || theme.backgroundColor || '#ffffff',
			}

		case 'gradient':
			if (background.gradient) {
				return generateGradientStyle(background.gradient)
			}
			return { backgroundColor: theme.backgroundColor || '#ffffff' }

		case 'image':
			if (background.image) {
				return generateImageBackgroundStyle(background.image)
			}
			return { backgroundColor: theme.backgroundColor || '#ffffff' }

		case 'pattern':
			if (background.pattern) {
				// Pattern backgrounds will be implemented in a future step
				return {
					backgroundColor: background.pattern.backgroundColor,
					// TODO: Add pattern generation
				}
			}
			return { backgroundColor: theme.backgroundColor || '#ffffff' }

		default:
			return {
				backgroundColor: theme.backgroundColor || '#ffffff',
			}
	}
}

/**
 * Generate CSS style for gradient backgrounds
 */
export function generateGradientStyle(gradient: GradientDefinition): React.CSSProperties {
	const { type, stops, angle = 0, center } = gradient
	const stopStrings = stops.map((stop) => `${stop.color} ${stop.position}%`)

	if (type === 'linear') {
		return {
			background: `linear-gradient(${angle}deg, ${stopStrings.join(', ')})`,
		}
	} else {
		const centerPoint = center ? `${center.x}% ${center.y}%` : 'center'
		return {
			background: `radial-gradient(circle at ${centerPoint}, ${stopStrings.join(', ')})`,
		}
	}
}

/**
 * Generate CSS style for image backgrounds
 */
export function generateImageBackgroundStyle(image: BackgroundImageDefinition): React.CSSProperties {
	const {
		src,
		localSrc,
		size = 'cover',
		position = 'center',
		customPosition,
		customSize,
		opacity = 1,
		blendMode = 'normal',
	} = image

	let backgroundPosition: string = position
	if (position === 'custom' && customPosition) {
		backgroundPosition = `${customPosition.x}% ${customPosition.y}%`
	}

	let backgroundSize: string = size
	if (size === 'custom' && customSize) {
		backgroundSize = `${customSize.width}% ${customSize.height}%`
	}

	return {
		backgroundImage: `url("${localSrc || src}")`,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat: 'no-repeat',
		opacity,
		mixBlendMode: blendMode as any,
	}
}

/**
 * Apply theme to a slide
 */
export function applyThemeToSlide(slide: SlideType, theme: SlideThemeType): SlideType {
	return {
		...slide,
		// Clear any existing background color when applying theme
		backgroundColor: theme.background.type === 'color' ? theme.backgroundColor : undefined,
		themeOverride: {
			...theme,
			id: `${theme.id}-applied-${Date.now()}`,
		},
		useGlobalTheme: false,
		elements: slide.elements.map((element) => applyThemeToElement(element, theme)),
	}
}

/**
 * Apply theme styling to an element
 */
export function applyThemeToElement(element: ElementType, theme: SlideThemeType): ElementType {
	const updated = { ...element }

	// Apply theme colors and typography based on element type
	if (element.type === 'heading') {
		updated.style = {
			...updated.style,
			color: theme.typography.headingColor,
			fontFamily: theme.typography.headingFont,
		}
		// Apply heading size based on content or default to h2
		const headingLevel = getHeadingLevel(element.content as string)
		if (headingLevel && theme.typography.headingSizes[headingLevel]) {
			updated.style.fontSize = theme.typography.headingSizes[headingLevel]
		}
	} else if (['paragraph', 'bullet-list', 'numbered-list'].includes(element.type)) {
		updated.style = {
			...updated.style,
			color: theme.typography.bodyColor,
			fontFamily: theme.typography.bodyFont,
			lineHeight: theme.typography.lineHeight,
			letterSpacing: theme.typography.letterSpacing,
		}
	} else if (['rectangle', 'circle', 'triangle'].includes(element.type)) {
		// Apply theme colors to shapes
		updated.style = {
			...updated.style,
			backgroundColor: theme.primaryColor,
		}
		updated.borderColor = theme.secondaryColor
	} else if (element.type === 'line') {
		updated.style = {
			...updated.style,
			backgroundColor: theme.secondaryColor,
		}
	}

	return updated
}

/**
 * Detect heading level from content
 */
function getHeadingLevel(content: string): keyof SlideThemeType['typography']['headingSizes'] | null {
	if (!content) return 'h2'

	// Simple heuristic based on content length and context
	if (content.length < 20) return 'h1'
	if (content.length < 40) return 'h2'
	if (content.length < 60) return 'h3'
	return 'h4'
}

/**
 * Calculate effective theme for a slide
 */
export function getSlideEffectiveTheme(
	slide: SlideType,
	globalTheme: SlideThemeType | null
): SlideThemeType | null {
	if (!globalTheme) return null

	// If slide has theme override and doesn't use global theme
	if (slide.useGlobalTheme === false && slide.themeOverride) {
		return {
			...globalTheme,
			...slide.themeOverride,
			metadata: {
				...globalTheme.metadata,
				isCustom: true,
			},
		}
	}

	return globalTheme
}

/**
 * Merge two themes (base + override)
 */
export function mergeThemes(
	baseTheme: SlideThemeType,
	override: Partial<SlideThemeType>
): SlideThemeType {
	return {
		...baseTheme,
		...override,
		background: {
			...baseTheme.background,
			...override.background,
		},
		typography: {
			...baseTheme.typography,
			...override.typography,
		},
		accessibility: {
			...baseTheme.accessibility,
			...override.accessibility,
		},
		metadata: {
			...baseTheme.metadata,
			...override.metadata,
			isCustom: true,
			updatedAt: new Date().toISOString(),
		},
		illustrations: override.illustrations || baseTheme.illustrations,
	}
}

/**
 * Validate theme accessibility
 */
export function validateThemeAccessibility(theme: SlideThemeType): {
	isValid: boolean
	issues: string[]
} {
	const issues: string[] = []

	// Check contrast ratio for heading
	const headingContrast = calculateContrastRatio(
		theme.typography.headingColor,
		theme.backgroundColor || '#ffffff'
	)
	if (headingContrast < 4.5) {
		issues.push('Heading text contrast is below WCAG AA standard (4.5:1)')
	}

	// Check contrast ratio for body text
	const bodyContrast = calculateContrastRatio(
		theme.typography.bodyColor,
		theme.backgroundColor || '#ffffff'
	)
	if (bodyContrast < 4.5) {
		issues.push('Body text contrast is below WCAG AA standard (4.5:1)')
	}

	// Check if background image might affect readability
	if (theme.background.type === 'image' && !theme.accessibility.textShadowEnabled) {
		issues.push('Background image detected without text shadow - text may be hard to read')
	}

	return {
		isValid: issues.length === 0,
		issues,
	}
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(foreground: string, background: string): number {
	const getLuminance = (color: string): number => {
		// Convert hex to RGB
		const hex = color.replace('#', '')
		const r = parseInt(hex.substring(0, 2), 16) / 255
		const g = parseInt(hex.substring(2, 4), 16) / 255
		const b = parseInt(hex.substring(4, 6), 16) / 255

		// Calculate relative luminance
		const sRGB = [r, g, b].map((c) => {
			return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
		})

		return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
	}

	const l1 = getLuminance(foreground)
	const l2 = getLuminance(background)

	const lighter = Math.max(l1, l2)
	const darker = Math.min(l1, l2)

	return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSSProperties(theme: SlideThemeType): Record<string, string> {
	return {
		'--theme-primary': theme.primaryColor || '#2563eb',
		'--theme-secondary': theme.secondaryColor || '#64748b',
		'--theme-background': theme.backgroundColor || '#ffffff',
		'--theme-text': theme.textColor || '#1e293b',
		'--theme-heading-color': theme.typography.headingColor,
		'--theme-body-color': theme.typography.bodyColor,
		'--theme-heading-font': theme.typography.headingFont,
		'--theme-body-font': theme.typography.bodyFont,
		'--theme-line-height': theme.typography.lineHeight.toString(),
		'--theme-letter-spacing': `${theme.typography.letterSpacing}px`,
	}
}

/**
 * Create a theme object from a basic color palette
 */
export function createThemeFromColors(
	name: string,
	primaryColor: string,
	backgroundColor: string = '#ffffff',
	category: SlideThemeType['category'] = 'custom'
): Omit<SlideThemeType, 'id' | 'metadata'> {
	// Generate complementary colors
	const textColor = backgroundColor === '#ffffff' ? '#1e293b' : '#f8fafc'
	const secondaryColor = adjustColorBrightness(primaryColor, -20)

	return {
		name,
		category,
		primaryColor,
		secondaryColor,
		backgroundColor,
		textColor,
		headerFont: 'system-ui',
		bodyFont: 'system-ui',
		background: {
			type: 'color',
			color: backgroundColor,
		},
		illustrations: [],
		typography: {
			headingFont: 'system-ui',
			bodyFont: 'system-ui',
			headingColor: primaryColor,
			bodyColor: textColor,
			headingSizes: {
				h1: 48,
				h2: 40,
				h3: 32,
				h4: 24,
				h5: 20,
				h6: 16,
			},
			lineHeight: 1.5,
			letterSpacing: 0,
		},
		accessibility: {
			contrastRatio: calculateContrastRatio(textColor, backgroundColor),
			highContrastMode: false,
			textShadowEnabled: false,
			backgroundImageDisabled: false,
			reducedMotion: false,
		},
	}
}

/**
 * Adjust color brightness
 */
function adjustColorBrightness(hex: string, percent: number): string {
	const num = parseInt(hex.replace('#', ''), 16)
	const amt = Math.round(2.55 * percent)
	const R = (num >> 16) + amt
	const G = ((num >> 8) & 0x00ff) + amt
	const B = (num & 0x0000ff) + amt

	return (
		'#' +
		(
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
			(B < 255 ? (B < 1 ? 0 : B) : 255)
		)
			.toString(16)
			.slice(1)
	)
}
