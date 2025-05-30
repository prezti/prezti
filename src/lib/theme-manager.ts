import type { ElementType, SlideType, ThemeType } from './types'

// Predefined theme collection
export const PRESET_THEMES: Record<string, ThemeType> = {
	default: {
		primaryColor: '#2563eb',
		secondaryColor: '#64748b',
		backgroundColor: '#ffffff',
		textColor: '#1e293b',
		headerFont: 'system-ui',
		bodyFont: 'system-ui',
	},
	dark: {
		primaryColor: '#3b82f6',
		secondaryColor: '#6b7280',
		backgroundColor: '#111827',
		textColor: '#f9fafb',
		headerFont: 'system-ui',
		bodyFont: 'system-ui',
	},
	professional: {
		primaryColor: '#1e40af',
		secondaryColor: '#475569',
		backgroundColor: '#f8fafc',
		textColor: '#0f172a',
		headerFont: 'Inter, system-ui',
		bodyFont: 'Inter, system-ui',
	},
	creative: {
		primaryColor: '#7c3aed',
		secondaryColor: '#a855f7',
		backgroundColor: '#fdf4ff',
		textColor: '#581c87',
		headerFont: 'Space Grotesk, system-ui',
		bodyFont: 'Inter, system-ui',
	},
	nature: {
		primaryColor: '#059669',
		secondaryColor: '#10b981',
		backgroundColor: '#f0fdf4',
		textColor: '#064e3b',
		headerFont: 'Poppins, system-ui',
		bodyFont: 'Open Sans, system-ui',
	},
	sunset: {
		primaryColor: '#dc2626',
		secondaryColor: '#f97316',
		backgroundColor: '#fef2f2',
		textColor: '#7f1d1d',
		headerFont: 'Playfair Display, serif',
		bodyFont: 'Source Sans Pro, system-ui',
	},
	ocean: {
		primaryColor: '#0891b2',
		secondaryColor: '#06b6d4',
		backgroundColor: '#f0f9ff',
		textColor: '#0c4a6e',
		headerFont: 'Nunito, system-ui',
		bodyFont: 'Roboto, system-ui',
	},
	elegant: {
		primaryColor: '#6366f1',
		secondaryColor: '#8b5cf6',
		backgroundColor: '#fefbff',
		textColor: '#312e81',
		headerFont: 'Crimson Text, serif',
		bodyFont: 'Lato, system-ui',
	},
	modern: {
		primaryColor: '#14b8a6',
		secondaryColor: '#06d6a0',
		backgroundColor: '#f7fffc',
		textColor: '#134e4a',
		headerFont: 'Montserrat, system-ui',
		bodyFont: 'Noto Sans, system-ui',
	},
	minimal: {
		primaryColor: '#374151',
		secondaryColor: '#6b7280',
		backgroundColor: '#ffffff',
		textColor: '#111827',
		headerFont: 'JetBrains Mono, monospace',
		bodyFont: 'system-ui',
	},
}

// Color palette generator
export function generateColorPalette(baseColor: string): string[] {
	// Convert hex to HSL for color manipulation
	const hexToHsl = (hex: string) => {
		const r = parseInt(hex.slice(1, 3), 16) / 255
		const g = parseInt(hex.slice(3, 5), 16) / 255
		const b = parseInt(hex.slice(5, 7), 16) / 255

		const max = Math.max(r, g, b)
		const min = Math.min(r, g, b)
		let h = 0,
			s = 0
		const l = (max + min) / 2

		if (max !== min) {
			const d = max - min
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0)
					break
				case g:
					h = (b - r) / d + 2
					break
				case b:
					h = (r - g) / d + 4
					break
			}
			h /= 6
		}

		return [h * 360, s * 100, l * 100]
	}

	// Convert HSL back to hex
	const hslToHex = (h: number, s: number, l: number) => {
		h /= 360
		s /= 100
		l /= 100
		const a = s * Math.min(l, 1 - l)
		const f = (n: number) => {
			const k = (n + h * 12) % 12
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0')
		}
		return `#${f(0)}${f(8)}${f(4)}`
	}

	const [h, s, l] = hexToHsl(baseColor)

	// Generate palette with various lightness values
	return [
		hslToHex(h, s, Math.min(95, l + 40)), // Very light
		hslToHex(h, s, Math.min(85, l + 25)), // Light
		hslToHex(h, s, Math.min(75, l + 15)), // Medium light
		baseColor, // Original
		hslToHex(h, s, Math.max(25, l - 15)), // Medium dark
		hslToHex(h, s, Math.max(15, l - 25)), // Dark
		hslToHex(h, s, Math.max(5, l - 40)), // Very dark
	]
}

// Theme application utilities
export function applyThemeToElement(element: ElementType, theme: ThemeType): ElementType {
	const updated = { ...element }

	// Apply theme colors based on element type
	if (element.type === 'heading') {
		updated.style = {
			...updated.style,
			color: theme.primaryColor,
			fontFamily: theme.headerFont,
		}
	} else if (['paragraph', 'bullet-list', 'numbered-list'].includes(element.type)) {
		updated.style = {
			...updated.style,
			color: theme.textColor,
			fontFamily: theme.bodyFont,
		}
	} else if (['rectangle', 'circle'].includes(element.type)) {
		// Apply theme colors to shapes
		const palette = generateColorPalette(theme.primaryColor || '#2563eb')
		updated.style = {
			...updated.style,
			backgroundColor: palette[1], // Light shade
		}
		updated.borderColor = theme.primaryColor
	}

	return updated
}

export function applyThemeToSlide(slide: SlideType, theme: ThemeType): SlideType {
	return {
		...slide,
		backgroundColor: theme.backgroundColor,
		elements: slide.elements.map((element: ElementType) => applyThemeToElement(element, theme)),
	}
}

// Theme validation and utilities
export function validateTheme(theme: Partial<ThemeType>): boolean {
	const required = ['primaryColor', 'backgroundColor', 'textColor']
	return required.every((key) => theme[key as keyof ThemeType])
}

export function createCustomTheme(
	name: string,
	primaryColor: string,
	backgroundColor: string = '#ffffff',
	textColor: string = '#000000'
): ThemeType {
	const palette = generateColorPalette(primaryColor)

	return {
		primaryColor,
		secondaryColor: palette[2],
		backgroundColor,
		textColor,
		headerFont: 'system-ui',
		bodyFont: 'system-ui',
	}
}

// Font combinations
export const FONT_COMBINATIONS = [
	{
		name: 'Classic',
		header: 'Georgia, serif',
		body: 'Arial, sans-serif',
	},
	{
		name: 'Modern',
		header: 'Helvetica Neue, sans-serif',
		body: 'Helvetica Neue, sans-serif',
	},
	{
		name: 'Elegant',
		header: 'Playfair Display, serif',
		body: 'Source Sans Pro, sans-serif',
	},
	{
		name: 'Professional',
		header: 'Inter, sans-serif',
		body: 'Inter, sans-serif',
	},
	{
		name: 'Creative',
		header: 'Space Grotesk, sans-serif',
		body: 'Inter, sans-serif',
	},
	{
		name: 'Minimal',
		header: 'JetBrains Mono, monospace',
		body: 'system-ui',
	},
]

// Theme persistence
export function saveTheme(name: string, theme: ThemeType): void {
	const customThemes = getCustomThemes()
	customThemes[name] = theme
	localStorage.setItem('customThemes', JSON.stringify(customThemes))
}

export function getCustomThemes(): Record<string, ThemeType> {
	try {
		const stored = localStorage.getItem('customThemes')
		return stored ? JSON.parse(stored) : {}
	} catch {
		return {}
	}
}

export function deleteCustomTheme(name: string): void {
	const customThemes = getCustomThemes()
	delete customThemes[name]
	localStorage.setItem('customThemes', JSON.stringify(customThemes))
}

export function getAllThemes(): Record<string, ThemeType> {
	return {
		...PRESET_THEMES,
		...getCustomThemes(),
	}
}
