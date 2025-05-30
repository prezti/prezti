'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertCircle, CheckCircle, Clock, Redo, Save, Undo } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface AutoSaveIndicatorProps {
	hasUnsavedChanges: boolean
	lastSaved: Date | null
	onSave: () => void
	onUndo: () => void
	onRedo: () => void
	canUndo: boolean
	canRedo: boolean
	undoCount: number
	redoCount: number
	isSaving?: boolean
	saveError?: string | null
}

export function AutoSaveIndicator({
	hasUnsavedChanges,
	lastSaved,
	onSave,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoCount,
	redoCount,
	isSaving = false,
	saveError = null,
}: AutoSaveIndicatorProps) {
	const [timeAgo, setTimeAgo] = useState<string>('')

	const updateTimeAgo = useCallback(() => {
		if (!lastSaved) {
			setTimeAgo('Never saved')
			return
		}

		const now = new Date()
		const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)

		if (diff < 60) {
			setTimeAgo('Just now')
		} else if (diff < 3600) {
			const minutes = Math.floor(diff / 60)
			setTimeAgo(`${minutes}m ago`)
		} else if (diff < 86400) {
			const hours = Math.floor(diff / 3600)
			setTimeAgo(`${hours}h ago`)
		} else {
			const days = Math.floor(diff / 86400)
			setTimeAgo(`${days}d ago`)
		}
	}, [lastSaved])

	useEffect(() => {
		updateTimeAgo()
		const interval = setInterval(updateTimeAgo, 30000) // Update every 30 seconds
		return () => clearInterval(interval)
	}, [updateTimeAgo])

	const getSaveStatus = () => {
		if (isSaving) {
			return {
				icon: <Save className="h-3.5 w-3.5 text-blue-500 animate-pulse" />,
				text: 'Saving...',
				textColor: 'text-blue-600',
			}
		}

		if (saveError) {
			return {
				icon: <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
				text: 'Save failed',
				textColor: 'text-red-600',
			}
		}

		if (hasUnsavedChanges) {
			return {
				icon: <Clock className="h-3.5 w-3.5 text-amber-500" />,
				text: 'Unsaved changes',
				textColor: 'text-amber-600',
			}
		}

		return {
			icon: <CheckCircle className="h-3.5 w-3.5 text-green-500" />,
			text: `Saved ${timeAgo}`,
			textColor: 'text-muted-foreground',
		}
	}

	const saveStatus = getSaveStatus()

	return (
		<div className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2 shadow-sm">
			{/* Undo/Redo */}
			<div className="flex items-center gap-1">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={onUndo}
								disabled={!canUndo || isSaving}
								className="h-8 w-8 p-0">
								<Undo className="h-3.5 w-3.5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Undo {undoCount > 0 && `(${undoCount} available)`} (Ctrl+Z)</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={onRedo}
								disabled={!canRedo || isSaving}
								className="h-8 w-8 p-0">
								<Redo className="h-3.5 w-3.5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Redo {redoCount > 0 && `(${redoCount} available)`} (Ctrl+Y)</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className="w-px h-4 bg-border" />

			{/* Save Status */}
			<div className="flex items-center gap-2">
				{saveStatus.icon}
				<span className={`text-sm ${saveStatus.textColor}`}>{saveStatus.text}</span>

				{(hasUnsavedChanges || saveError) && !isSaving && (
					<Button variant="ghost" size="sm" onClick={onSave} className="h-8 px-2">
						<Save className="h-3.5 w-3.5 mr-1" />
						{saveError ? 'Retry' : 'Save'}
					</Button>
				)}
			</div>
		</div>
	)
}
