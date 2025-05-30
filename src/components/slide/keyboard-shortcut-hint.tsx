'use client'

import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

type KeyboardShortcut = {
	keys: string[]
	description: string
}

type ActionGroup = {
	label: string
	shortcuts: KeyboardShortcut[]
}

// Define common shortcuts for elements
const elementShortcuts: ActionGroup = {
	label: 'Element Actions',
	shortcuts: [
		{ keys: ['Delete'], description: 'Delete element' },
		{ keys: ['Ctrl', 'D'], description: 'Duplicate element' },
		{ keys: ['Ctrl', 'C'], description: 'Copy element' },
		{ keys: ['Ctrl', 'V'], description: 'Paste element' },
		{ keys: ['Arrow Keys'], description: 'Move element (1px)' },
		{ keys: ['Shift', 'Arrow Keys'], description: 'Move element (10px)' },
	],
}

// Define common shortcuts for text editing
const textShortcuts: ActionGroup = {
	label: 'Text Editing',
	shortcuts: [
		{ keys: ['Ctrl', 'B'], description: 'Bold text' },
		{ keys: ['Ctrl', 'I'], description: 'Italic text' },
		{ keys: ['Ctrl', 'U'], description: 'Underline text' },
		{ keys: ['Ctrl', 'Enter'], description: 'Save text changes' },
	],
}

interface KeyboardShortcutHintProps {
	isVisible: boolean
	mode: 'element' | 'text' | null
	position: { x: number; y: number }
}

export function KeyboardShortcutHint({ isVisible, mode, position }: KeyboardShortcutHintProps) {
	if (!isVisible || !mode) return null

	const shortcuts = mode === 'element' ? elementShortcuts : textShortcuts

	// Calculate position to ensure it stays in viewport
	const adjustedPosition = {
		x: Math.min(position.x, window.innerWidth - 260),
		y: Math.min(position.y, window.innerHeight - (shortcuts.shortcuts.length * 32 + 40)),
	}

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="fixed z-40 bg-black/80 backdrop-blur-sm text-white rounded-lg shadow-lg p-3 w-[250px]"
				style={{
					left: `${adjustedPosition.x}px`,
					top: `${adjustedPosition.y}px`,
				}}>
				<div className="text-xs text-primary font-medium mb-2">{shortcuts.label}</div>

				<div className="space-y-1.5">
					{shortcuts.shortcuts.map((shortcut, index) => (
						<div key={index} className="flex items-center justify-between">
							<span className="text-xs text-white/80">{shortcut.description}</span>
							<div className="flex items-center space-x-1">
								{shortcut.keys.map((key, keyIndex) => (
									<React.Fragment key={keyIndex}>
										<kbd className="text-[10px] bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20">
											{key}
										</kbd>
										{keyIndex < shortcut.keys.length - 1 && key !== 'Shift' && key !== 'Alt' && (
											<span className="text-white/50 text-[10px]">+</span>
										)}
									</React.Fragment>
								))}
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</AnimatePresence>
	)
}
