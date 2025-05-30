import { ENHANCED_PRESET_THEMES } from '@/lib/preset-themes'
import type { PresentationType, SlideThemeType, SlideType } from '@/lib/types'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface ThemeStore {
	// Current state
	globalTheme: SlideThemeType | null
	slideThemeOverrides: Map<string, Partial<SlideThemeType>>
	availableThemes: SlideThemeType[]
	customThemes: SlideThemeType[]

	// UI state
	themeGalleryOpen: boolean
	selectedThemeId: string | null
	previewMode: boolean
	loadingStates: Map<string, 'loading' | 'loaded' | 'error'>
	activeSlideThemeEditor: string | null // slideId being edited

	// Actions
	setGlobalTheme: (theme: SlideThemeType) => void
	setSlideThemeOverride: (slideId: string, override: Partial<SlideThemeType>) => void
	removeSlideThemeOverride: (slideId: string) => void
	clearSlideThemeOverride: (slideId: string) => void

	// Theme gallery actions
	openThemeGallery: () => void
	closeThemeGallery: () => void
	setSelectedTheme: (themeId: string | null) => void
	setPreviewMode: (enabled: boolean) => void

	// Custom theme management
	createCustomTheme: (
		theme: Omit<SlideThemeType, 'id' | 'metadata'>,
		name: string
	) => Promise<SlideThemeType>
	updateCustomTheme: (themeId: string, updates: Partial<SlideThemeType>) => Promise<void>
	deleteCustomTheme: (themeId: string) => Promise<void>

	// Asset management
	uploadBackgroundImage: (file: File) => Promise<string>
	setLoadingState: (key: string, state: 'loading' | 'loaded' | 'error') => void

	// Slide theme editor
	openSlideThemeEditor: (slideId: string) => void
	closeSlideThemeEditor: () => void

	// Utility actions
	getSlideEffectiveTheme: (slideId: string, slides: SlideType[]) => SlideThemeType | null
	initializeFromPresentation: (presentation: PresentationType) => void
	exportThemeData: () => {
		globalTheme: SlideThemeType | null
		customThemes: SlideThemeType[]
		slideOverrides: Record<string, Partial<SlideThemeType>>
	}
}

// Helper function to create default theme
function createDefaultSlideTheme(): SlideThemeType {
	return {
		id: 'default',
		name: 'Default',
		category: 'basic',
		primaryColor: '#2563eb',
		secondaryColor: '#64748b',
		backgroundColor: '#ffffff',
		textColor: '#1e293b',
		headerFont: 'system-ui',
		bodyFont: 'system-ui',
		background: {
			type: 'color',
			color: '#ffffff',
		},
		illustrations: [],
		typography: {
			headingFont: 'system-ui',
			bodyFont: 'system-ui',
			headingColor: '#1e293b',
			bodyColor: '#374151',
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
			contrastRatio: 4.5,
			highContrastMode: false,
			textShadowEnabled: false,
			backgroundImageDisabled: false,
			reducedMotion: false,
		},
		metadata: {
			createdBy: 'system',
			isCustom: false,
			tags: ['basic', 'default'],
			version: '1.0.0',
		},
	}
}

export const useThemeStore = create<ThemeStore>()(
	subscribeWithSelector((set, get) => ({
		// Initial state
		globalTheme: createDefaultSlideTheme(),
		slideThemeOverrides: new Map(),
		availableThemes: ENHANCED_PRESET_THEMES,
		customThemes: [],

		// UI state
		themeGalleryOpen: false,
		selectedThemeId: null,
		previewMode: false,
		loadingStates: new Map(),
		activeSlideThemeEditor: null,

		// Actions
		setGlobalTheme: (theme: SlideThemeType) => {
			set({ globalTheme: theme })
			// Save to localStorage for persistence
			localStorage.setItem('globalTheme', JSON.stringify(theme))
		},

		setSlideThemeOverride: (slideId: string, override: Partial<SlideThemeType>) => {
			const overrides = new Map(get().slideThemeOverrides)
			overrides.set(slideId, override)
			set({ slideThemeOverrides: overrides })
			// Save to localStorage
			const overrideObj = Object.fromEntries(overrides)
			localStorage.setItem('slideThemeOverrides', JSON.stringify(overrideObj))
		},

		removeSlideThemeOverride: (slideId: string) => {
			const overrides = new Map(get().slideThemeOverrides)
			overrides.delete(slideId)
			set({ slideThemeOverrides: overrides })
			// Save to localStorage
			const overrideObj = Object.fromEntries(overrides)
			localStorage.setItem('slideThemeOverrides', JSON.stringify(overrideObj))
		},

		clearSlideThemeOverride: (slideId: string) => {
			get().removeSlideThemeOverride(slideId)
		},

		// Theme gallery actions
		openThemeGallery: () => set({ themeGalleryOpen: true }),
		closeThemeGallery: () => set({ themeGalleryOpen: false, selectedThemeId: null, previewMode: false }),
		setSelectedTheme: (themeId: string | null) => set({ selectedThemeId: themeId }),
		setPreviewMode: (enabled: boolean) => set({ previewMode: enabled }),

		// Custom theme management
		createCustomTheme: async (
			themeData: Omit<SlideThemeType, 'id' | 'metadata'>,
			name: string
		): Promise<SlideThemeType> => {
			const newTheme: SlideThemeType = {
				...themeData,
				id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				name,
				category: 'custom',
				metadata: {
					createdBy: 'user',
					isCustom: true,
					tags: ['custom'],
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					version: '1.0.0',
				},
			}

			const customThemes = [...get().customThemes, newTheme]
			set({ customThemes })

			// Save to localStorage
			localStorage.setItem('customThemes', JSON.stringify(customThemes))

			return newTheme
		},

		updateCustomTheme: async (themeId: string, updates: Partial<SlideThemeType>): Promise<void> => {
			const customThemes = get().customThemes.map((theme) =>
				theme.id === themeId
					? {
							...theme,
							...updates,
							metadata: {
								...theme.metadata,
								updatedAt: new Date().toISOString(),
							},
					  }
					: theme
			)
			set({ customThemes })

			// Save to localStorage
			localStorage.setItem('customThemes', JSON.stringify(customThemes))
		},

		deleteCustomTheme: async (themeId: string): Promise<void> => {
			const customThemes = get().customThemes.filter((theme) => theme.id !== themeId)
			set({ customThemes })

			// Save to localStorage
			localStorage.setItem('customThemes', JSON.stringify(customThemes))
		},

		// Asset management
		uploadBackgroundImage: async (file: File): Promise<string> => {
			const key = `upload-${Date.now()}`
			set((state) => {
				const newLoadingStates = new Map(state.loadingStates)
				newLoadingStates.set(key, 'loading')
				return { loadingStates: newLoadingStates }
			})

			try {
				// Create object URL for local file
				const url = URL.createObjectURL(file)

				// In a real app, this would upload to a server
				// For now, we'll just use the object URL
				await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate upload

				set((state) => {
					const newLoadingStates = new Map(state.loadingStates)
					newLoadingStates.set(key, 'loaded')
					return { loadingStates: newLoadingStates }
				})

				return url
			} catch (error) {
				set((state) => {
					const newLoadingStates = new Map(state.loadingStates)
					newLoadingStates.set(key, 'error')
					return { loadingStates: newLoadingStates }
				})
				throw error
			}
		},

		setLoadingState: (key: string, state: 'loading' | 'loaded' | 'error') => {
			set((current) => {
				const newLoadingStates = new Map(current.loadingStates)
				newLoadingStates.set(key, state)
				return { loadingStates: newLoadingStates }
			})
		},

		// Slide theme editor
		openSlideThemeEditor: (slideId: string) => set({ activeSlideThemeEditor: slideId }),
		closeSlideThemeEditor: () => set({ activeSlideThemeEditor: null }),

		// Utility actions
		getSlideEffectiveTheme: (slideId: string, slides: SlideType[]): SlideThemeType | null => {
			const slide = slides.find((s) => s.id === slideId)
			if (!slide) return get().globalTheme

			if (slide.useGlobalTheme === false && slide.themeOverride) {
				// Merge global theme with slide override
				const globalTheme = get().globalTheme
				if (!globalTheme) return null

				return {
					...globalTheme,
					...slide.themeOverride,
					metadata: {
						...globalTheme.metadata,
						isCustom: true,
					},
				}
			}

			return get().globalTheme
		},

		initializeFromPresentation: (presentation: PresentationType) => {
			if (presentation.globalTheme) {
				set({ globalTheme: presentation.globalTheme })
			}
			if (presentation.customThemes) {
				set({ customThemes: presentation.customThemes })
			}

			// Load slide overrides
			const overrides = new Map<string, Partial<SlideThemeType>>()
			presentation.slides.forEach((slide) => {
				if (slide.themeOverride) {
					overrides.set(slide.id, slide.themeOverride)
				}
			})
			set({ slideThemeOverrides: overrides })
		},

		exportThemeData: () => {
			const state = get()
			return {
				globalTheme: state.globalTheme,
				customThemes: state.customThemes,
				slideOverrides: Object.fromEntries(state.slideThemeOverrides),
			}
		},
	}))
)

// Initialize store from localStorage
if (typeof window !== 'undefined') {
	const savedGlobalTheme = localStorage.getItem('globalTheme')
	const savedCustomThemes = localStorage.getItem('customThemes')
	const savedSlideOverrides = localStorage.getItem('slideThemeOverrides')

	if (savedGlobalTheme) {
		try {
			const theme = JSON.parse(savedGlobalTheme)
			useThemeStore.getState().setGlobalTheme(theme)
		} catch (error) {
			console.error('Failed to load saved global theme:', error)
		}
	}

	if (savedCustomThemes) {
		try {
			const themes = JSON.parse(savedCustomThemes)
			useThemeStore.setState({ customThemes: themes })
		} catch (error) {
			console.error('Failed to load saved custom themes:', error)
		}
	}

	if (savedSlideOverrides) {
		try {
			const overrides = JSON.parse(savedSlideOverrides) as Record<string, Partial<SlideThemeType>>
			const overrideMap = new Map(Object.entries(overrides))
			useThemeStore.setState({ slideThemeOverrides: overrideMap })
		} catch (error) {
			console.error('Failed to load saved slide overrides:', error)
		}
	}
}
