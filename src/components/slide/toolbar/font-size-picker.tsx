'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FONT_SIZE_OPTIONS } from '../toolbar-options'

interface FontSizePickerProps {
	currentSize?: string
	onSizeChange: (size: string) => void
	disabled?: boolean
}

export function FontSizePicker({
	currentSize = '24px',
	onSizeChange,
	disabled = false,
}: FontSizePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm" className="text-xs min-w-[3rem]" disabled={disabled}>
					{currentSize}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-48">
				<div className="space-y-2">
					<Label>Font Size</Label>
					<div className="grid grid-cols-3 gap-1">
						{FONT_SIZE_OPTIONS.map((size) => (
							<Button
								key={size}
								variant="ghost"
								size="sm"
								className="text-xs"
								onClick={() => onSizeChange(size)}>
								{size}
							</Button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
