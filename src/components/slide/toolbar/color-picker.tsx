'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Palette } from 'lucide-react'
import { PREDEFINED_COLORS } from '../toolbar-options'

interface ColorPickerProps {
	currentColor?: string
	onColorChange: (color: string) => void
	disabled?: boolean
}

export function ColorPicker({
	currentColor = '#000000',
	onColorChange,
	disabled = false,
}: ColorPickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" disabled={disabled}>
					<Palette className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64">
				<div className="space-y-3">
					<Label>Text Color</Label>
					<div className="grid grid-cols-6 gap-1">
						{PREDEFINED_COLORS.map((color) => (
							<button
								key={color}
								className="w-6 h-6 rounded border border-gray-300 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
								style={{ backgroundColor: color }}
								onClick={() => onColorChange(color)}
								aria-label={`Select color ${color}`}
							/>
						))}
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="custom-color" className="text-xs">
							Custom:
						</Label>
						<Input
							id="custom-color"
							type="color"
							value={currentColor}
							onChange={(e) => onColorChange(e.target.value)}
							className="w-12 h-8 p-0 border-0"
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
