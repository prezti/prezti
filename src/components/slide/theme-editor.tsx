'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { createThemeFromColors, generateBackgroundStyle } from '@/lib/theme-utils'
import type { SlideThemeType } from '@/lib/types'
import { useThemeStore } from '@/stores/theme-store'
import { ChevronDown, ChevronUp, Palette, Plus, Save, Trash2, Upload } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface ThemeEditorProps {
	isOpen: boolean
	onClose: () => void
	editingTheme?: SlideThemeType | null
	onThemeCreated?: (theme: SlideThemeType) => void
}

const FONT_OPTIONS = [
	{ value: 'Inter, system-ui', label: 'Inter' },
	{ value: 'Roboto, system-ui', label: 'Roboto' },
	{ value: 'Open Sans, system-ui', label: 'Open Sans' },
	{ value: 'Nunito, system-ui', label: 'Nunito' },
	{ value: 'Poppins, system-ui', label: 'Poppins' },
	{ value: 'Source Sans Pro, system-ui', label: 'Source Sans Pro' },
	{ value: 'Merriweather, serif', label: 'Merriweather' },
	{ value: 'Playfair Display, serif', label: 'Playfair Display' },
	{ value: 'JetBrains Mono, monospace', label: 'JetBrains Mono' },
	{ value: 'system-ui', label: 'System Default' },
]

const BLEND_MODE_OPTIONS = [
	{ value: 'normal', label: 'Normal' },
	{ value: 'multiply', label: 'Multiply' },
	{ value: 'overlay', label: 'Overlay' },
	{ value: 'screen', label: 'Screen' },
	{ value: 'soft-light', label: 'Soft Light' },
	{ value: 'hard-light', label: 'Hard Light' },
]

export function ThemeEditor({ isOpen, onClose, editingTheme, onThemeCreated }: ThemeEditorProps) {
	const { toast } = useToast()
	const { createCustomTheme, updateCustomTheme, uploadBackgroundImage } = useThemeStore()

	// Theme state
	const [themeName, setThemeName] = useState('')
	const [themeCategory, setThemeCategory] = useState<SlideThemeType['category']>('custom')
	const [primaryColor, setPrimaryColor] = useState('#2563eb')
	const [secondaryColor, setSecondaryColor] = useState('#64748b')
	const [backgroundColor, setBackgroundColor] = useState('#ffffff')
	const [textColor, setTextColor] = useState('#1e293b')

	// Background settings
	const [backgroundType, setBackgroundType] = useState<'color' | 'gradient' | 'image'>('color')
	const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
	const [gradientAngle, setGradientAngle] = useState(45)
	const [gradientStops, setGradientStops] = useState([
		{ color: '#2563eb', position: 0 },
		{ color: '#64748b', position: 100 },
	])

	// Typography settings
	const [headingFont, setHeadingFont] = useState('Inter, system-ui')
	const [bodyFont, setBodyFont] = useState('Inter, system-ui')
	const [headingColor, setHeadingColor] = useState('#1e293b')
	const [bodyColor, setBodyColor] = useState('#374151')
	const [lineHeight, setLineHeight] = useState(1.5)
	const [letterSpacing, setLetterSpacing] = useState(0)

	// Accessibility settings
	const [highContrastMode, setHighContrastMode] = useState(false)
	const [textShadowEnabled, setTextShadowEnabled] = useState(false)
	const [reducedMotion, setReducedMotion] = useState(false)

	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
	const [previewTheme, setPreviewTheme] = useState<SlideThemeType | null>(null)

	// Initialize form when editing an existing theme
	useEffect(() => {
		if (editingTheme) {
			setThemeName(editingTheme.name)
			setThemeCategory(editingTheme.category)
			setPrimaryColor(editingTheme.primaryColor || '#2563eb')
			setSecondaryColor(editingTheme.secondaryColor || '#64748b')
			setBackgroundColor(editingTheme.backgroundColor || '#ffffff')
			setTextColor(editingTheme.textColor || '#1e293b')

			// Only set supported background types
			if (
				editingTheme.background.type === 'color' ||
				editingTheme.background.type === 'gradient' ||
				editingTheme.background.type === 'image'
			) {
				setBackgroundType(editingTheme.background.type)
			}
			if (editingTheme.background.gradient) {
				setGradientType(editingTheme.background.gradient.type)
				setGradientAngle(editingTheme.background.gradient.angle || 45)
				setGradientStops(editingTheme.background.gradient.stops)
			}

			setHeadingFont(editingTheme.typography.headingFont)
			setBodyFont(editingTheme.typography.bodyFont)
			setHeadingColor(editingTheme.typography.headingColor)
			setBodyColor(editingTheme.typography.bodyColor)
			setLineHeight(editingTheme.typography.lineHeight)
			setLetterSpacing(editingTheme.typography.letterSpacing)

			setHighContrastMode(editingTheme.accessibility.highContrastMode)
			setTextShadowEnabled(editingTheme.accessibility.textShadowEnabled)
			setReducedMotion(editingTheme.accessibility.reducedMotion)
		} else {
			// Reset form for new theme
			resetForm()
		}
	}, [editingTheme, isOpen])

	// Update preview theme when settings change
	useEffect(() => {
		const theme = createPreviewTheme()
		setPreviewTheme(theme)
	}, [
		themeName,
		themeCategory,
		primaryColor,
		secondaryColor,
		backgroundColor,
		textColor,
		backgroundType,
		gradientType,
		gradientAngle,
		gradientStops,
		headingFont,
		bodyFont,
		headingColor,
		bodyColor,
		lineHeight,
		letterSpacing,
		highContrastMode,
		textShadowEnabled,
		reducedMotion,
	])

	const resetForm = () => {
		setThemeName('')
		setThemeCategory('custom')
		setPrimaryColor('#2563eb')
		setSecondaryColor('#64748b')
		setBackgroundColor('#ffffff')
		setTextColor('#1e293b')
		setBackgroundType('color')
		setGradientType('linear')
		setGradientAngle(45)
		setGradientStops([
			{ color: '#2563eb', position: 0 },
			{ color: '#64748b', position: 100 },
		])
		setHeadingFont('Inter, system-ui')
		setBodyFont('Inter, system-ui')
		setHeadingColor('#1e293b')
		setBodyColor('#374151')
		setLineHeight(1.5)
		setLetterSpacing(0)
		setHighContrastMode(false)
		setTextShadowEnabled(false)
		setReducedMotion(false)
	}

	const createPreviewTheme = useCallback((): SlideThemeType => {
		const baseTheme = createThemeFromColors(
			themeName || 'Custom Theme',
			primaryColor,
			backgroundColor,
			themeCategory
		)

		const background =
			backgroundType === 'gradient'
				? {
						type: 'gradient' as const,
						gradient: {
							type: gradientType,
							angle: gradientAngle,
							stops: gradientStops,
						},
				  }
				: { type: 'color' as const, color: backgroundColor }

		return {
			...baseTheme,
			id: 'preview',
			secondaryColor,
			textColor,
			background,
			typography: {
				...baseTheme.typography,
				headingFont,
				bodyFont,
				headingColor,
				bodyColor,
				lineHeight,
				letterSpacing,
			},
			accessibility: {
				...baseTheme.accessibility,
				highContrastMode,
				textShadowEnabled,
				reducedMotion,
			},
			metadata: {
				createdBy: 'user',
				isCustom: true,
				tags: ['custom'],
				version: '1.0.0',
			},
		}
	}, [
		themeName,
		themeCategory,
		primaryColor,
		secondaryColor,
		backgroundColor,
		textColor,
		backgroundType,
		gradientType,
		gradientAngle,
		gradientStops,
		headingFont,
		bodyFont,
		headingColor,
		bodyColor,
		lineHeight,
		letterSpacing,
		highContrastMode,
		textShadowEnabled,
		reducedMotion,
	])

	const handleSave = async () => {
		if (!themeName.trim()) {
			toast.error('Please enter a name for your theme.')
			return
		}

		try {
			const themeData = createPreviewTheme()
			let savedTheme: SlideThemeType

			if (editingTheme) {
				await updateCustomTheme(editingTheme.id, themeData)
				savedTheme = { ...themeData, id: editingTheme.id }
			} else {
				savedTheme = await createCustomTheme(themeData, themeName)
			}

			onThemeCreated?.(savedTheme)
			onClose()

			toast.success(`"${themeName}" has been ${editingTheme ? 'updated' : 'created'} successfully.`)
		} catch (error) {
			toast.error('There was an error saving your theme. Please try again.')
		}
	}

	const addGradientStop = () => {
		const newPosition = Math.min(100, Math.max(...gradientStops.map((s) => s.position)) + 25)
		setGradientStops([...gradientStops, { color: primaryColor, position: newPosition }])
	}

	const removeGradientStop = (index: number) => {
		if (gradientStops.length > 2) {
			setGradientStops(gradientStops.filter((_, i) => i !== index))
		}
	}

	const updateGradientStop = (index: number, updates: Partial<(typeof gradientStops)[0]>) => {
		const updated = [...gradientStops]
		updated[index] = { ...updated[index], ...updates }
		setGradientStops(updated.sort((a, b) => a.position - b.position))
	}

	if (!isOpen) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden">
				<DialogHeader className="px-6 py-4 border-b">
					<DialogTitle className="flex items-center gap-2">
						<Palette className="h-5 w-5" />
						{editingTheme ? 'Edit Theme' : 'Create Custom Theme'}
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-1 overflow-hidden">
					{/* Settings Panel */}
					<div className="w-2/3 overflow-hidden">
						<ScrollArea className="h-full">
							<div className="p-6 space-y-6">
								{/* Basic Settings */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Basic Settings</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="theme-name">Theme Name</Label>
											<Input
												id="theme-name"
												value={themeName}
												onChange={(e) => setThemeName(e.target.value)}
												placeholder="My Custom Theme"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="theme-category">Category</Label>
											<Select
												value={themeCategory}
												onValueChange={(value: SlideThemeType['category']) => setThemeCategory(value)}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="basic">Basic</SelectItem>
													<SelectItem value="professional">Professional</SelectItem>
													<SelectItem value="creative">Creative</SelectItem>
													<SelectItem value="industry">Industry</SelectItem>
													<SelectItem value="custom">Custom</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>

								<Separator />

								{/* Color Settings */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Colors</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="primary-color">Primary Color</Label>
											<div className="flex gap-2">
												<Input
													id="primary-color"
													type="color"
													value={primaryColor}
													onChange={(e) => setPrimaryColor(e.target.value)}
													className="w-16 h-10 p-1 border rounded"
												/>
												<Input
													value={primaryColor}
													onChange={(e) => setPrimaryColor(e.target.value)}
													placeholder="#2563eb"
													className="flex-1"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="secondary-color">Secondary Color</Label>
											<div className="flex gap-2">
												<Input
													id="secondary-color"
													type="color"
													value={secondaryColor}
													onChange={(e) => setSecondaryColor(e.target.value)}
													className="w-16 h-10 p-1 border rounded"
												/>
												<Input
													value={secondaryColor}
													onChange={(e) => setSecondaryColor(e.target.value)}
													placeholder="#64748b"
													className="flex-1"
												/>
											</div>
										</div>
									</div>
								</div>

								<Separator />

								{/* Background Settings */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Background</h3>
									<Tabs
										value={backgroundType}
										onValueChange={(value) => setBackgroundType(value as any)}>
										<TabsList className="grid w-full grid-cols-3">
											<TabsTrigger value="color">Solid Color</TabsTrigger>
											<TabsTrigger value="gradient">Gradient</TabsTrigger>
											<TabsTrigger value="image">Image</TabsTrigger>
										</TabsList>

										<TabsContent value="color" className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="background-color">Background Color</Label>
												<div className="flex gap-2">
													<Input
														id="background-color"
														type="color"
														value={backgroundColor}
														onChange={(e) => setBackgroundColor(e.target.value)}
														className="w-16 h-10 p-1 border rounded"
													/>
													<Input
														value={backgroundColor}
														onChange={(e) => setBackgroundColor(e.target.value)}
														placeholder="#ffffff"
														className="flex-1"
													/>
												</div>
											</div>
										</TabsContent>

										<TabsContent value="gradient" className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label>Gradient Type</Label>
													<Select
														value={gradientType}
														onValueChange={(value: 'linear' | 'radial') => setGradientType(value)}>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="linear">Linear</SelectItem>
															<SelectItem value="radial">Radial</SelectItem>
														</SelectContent>
													</Select>
												</div>
												{gradientType === 'linear' && (
													<div className="space-y-2">
														<Label>Angle: {gradientAngle}°</Label>
														<Slider
															value={[gradientAngle]}
															onValueChange={([value]) => setGradientAngle(value)}
															max={360}
															min={0}
															step={5}
														/>
													</div>
												)}
											</div>

											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<Label>Gradient Stops</Label>
													<Button
														variant="outline"
														size="sm"
														onClick={addGradientStop}
														disabled={gradientStops.length >= 5}>
														<Plus className="h-4 w-4 mr-1" />
														Add Stop
													</Button>
												</div>
												<div className="space-y-2">
													{gradientStops.map((stop, index) => (
														<div key={index} className="flex items-center gap-2">
															<Input
																type="color"
																value={stop.color}
																onChange={(e) => updateGradientStop(index, { color: e.target.value })}
																className="w-12 h-8 p-1 border rounded"
															/>
															<Input
																type="number"
																value={stop.position}
																onChange={(e) =>
																	updateGradientStop(index, { position: Number(e.target.value) })
																}
																min={0}
																max={100}
																className="w-20"
															/>
															<span className="text-sm text-muted-foreground">%</span>
															{gradientStops.length > 2 && (
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => removeGradientStop(index)}>
																	<Trash2 className="h-4 w-4" />
																</Button>
															)}
														</div>
													))}
												</div>
											</div>
										</TabsContent>

										<TabsContent value="image" className="space-y-4">
											<div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
												<Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
												<p className="text-sm text-muted-foreground mb-4">Upload a background image</p>
												<Button variant="outline">Choose Image</Button>
											</div>
										</TabsContent>
									</Tabs>
								</div>

								<Separator />

								{/* Typography Settings */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Typography</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label>Heading Font</Label>
											<Select value={headingFont} onValueChange={setHeadingFont}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{FONT_OPTIONS.map((font) => (
														<SelectItem key={font.value} value={font.value}>
															{font.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label>Body Font</Label>
											<Select value={bodyFont} onValueChange={setBodyFont}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{FONT_OPTIONS.map((font) => (
														<SelectItem key={font.value} value={font.value}>
															{font.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label>Heading Color</Label>
											<div className="flex gap-2">
												<Input
													type="color"
													value={headingColor}
													onChange={(e) => setHeadingColor(e.target.value)}
													className="w-16 h-10 p-1 border rounded"
												/>
												<Input
													value={headingColor}
													onChange={(e) => setHeadingColor(e.target.value)}
													className="flex-1"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label>Body Color</Label>
											<div className="flex gap-2">
												<Input
													type="color"
													value={bodyColor}
													onChange={(e) => setBodyColor(e.target.value)}
													className="w-16 h-10 p-1 border rounded"
												/>
												<Input
													value={bodyColor}
													onChange={(e) => setBodyColor(e.target.value)}
													className="flex-1"
												/>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label>Line Height: {lineHeight}</Label>
											<Slider
												value={[lineHeight]}
												onValueChange={([value]) => setLineHeight(value)}
												min={1}
												max={3}
												step={0.1}
											/>
										</div>
										<div className="space-y-2">
											<Label>Letter Spacing: {letterSpacing}px</Label>
											<Slider
												value={[letterSpacing]}
												onValueChange={([value]) => setLetterSpacing(value)}
												min={-2}
												max={5}
												step={0.1}
											/>
										</div>
									</div>
								</div>

								{/* Advanced Settings */}
								<div className="space-y-4">
									<Button
										variant="ghost"
										onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
										className="w-full justify-between p-0 h-auto">
										<h3 className="text-lg font-semibold">Advanced Settings</h3>
										{isAdvancedOpen ? (
											<ChevronUp className="h-4 w-4" />
										) : (
											<ChevronDown className="h-4 w-4" />
										)}
									</Button>

									{isAdvancedOpen && (
										<div className="space-y-4 pl-4 border-l-2 border-muted">
											<h4 className="font-medium">Accessibility</h4>
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<Label htmlFor="high-contrast">High Contrast Mode</Label>
													<Switch
														id="high-contrast"
														checked={highContrastMode}
														onCheckedChange={setHighContrastMode}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label htmlFor="text-shadow">Text Shadow</Label>
													<Switch
														id="text-shadow"
														checked={textShadowEnabled}
														onCheckedChange={setTextShadowEnabled}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label htmlFor="reduced-motion">Reduced Motion</Label>
													<Switch
														id="reduced-motion"
														checked={reducedMotion}
														onCheckedChange={setReducedMotion}
													/>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</ScrollArea>
					</div>

					{/* Preview Panel */}
					<div className="w-1/3 border-l bg-muted/50">
						<div className="p-6">
							<h3 className="text-lg font-semibold mb-4">Preview</h3>
							{previewTheme && <ThemePreviewCard theme={previewTheme} />}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t p-4 flex justify-between">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<div className="flex gap-2">
						<Button variant="outline" onClick={resetForm}>
							Reset
						</Button>
						<Button onClick={handleSave}>
							<Save className="h-4 w-4 mr-2" />
							{editingTheme ? 'Update Theme' : 'Create Theme'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function ThemePreviewCard({ theme }: { theme: SlideThemeType }) {
	const backgroundStyle = generateBackgroundStyle(theme)

	return (
		<Card className="w-full">
			<CardContent className="p-0">
				<div className="w-full h-32 rounded-t-lg relative overflow-hidden" style={backgroundStyle}>
					<div className="absolute inset-4 flex flex-col justify-center">
						<div
							className="text-sm font-semibold mb-2"
							style={{
								color: theme.typography.headingColor,
								fontFamily: theme.typography.headingFont,
							}}>
							Sample Heading
						</div>
						<div
							className="text-xs leading-tight"
							style={{
								color: theme.typography.bodyColor,
								fontFamily: theme.typography.bodyFont,
								lineHeight: theme.typography.lineHeight,
							}}>
							Sample body text content that shows how the typography looks with this theme.
						</div>
					</div>
				</div>
				<div className="p-4">
					<h4 className="font-medium mb-2">{theme.name}</h4>
					<div className="flex gap-1 mb-2">
						<Badge variant="outline" className="text-xs">
							{theme.category}
						</Badge>
					</div>
					<div className="flex gap-1">
						<div
							className="w-4 h-4 rounded-full border border-border"
							style={{ backgroundColor: theme.primaryColor }}
							title="Primary"
						/>
						<div
							className="w-4 h-4 rounded-full border border-border"
							style={{ backgroundColor: theme.secondaryColor }}
							title="Secondary"
						/>
						<div
							className="w-4 h-4 rounded-full border border-border"
							style={{ backgroundColor: theme.backgroundColor }}
							title="Background"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
