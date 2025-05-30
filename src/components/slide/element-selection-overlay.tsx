'use client'

import { Icon } from '@/components/ui/icon'
import * as React from 'react'

interface ElementSelectionOverlayProps {
	selectedElements: string[]
	elements: Array<{
		id: string
		x?: number
		y?: number
		width?: number
		height?: number
		rotation?: number
	}>
	zoom: number
	onResizeStart: (e: React.MouseEvent, elementId: string, direction: string) => void
	onRotateStart?: (e: React.MouseEvent, elementId: string) => void
	// onLayoutDragStart is intentionally removed as per user request
}

export function ElementSelectionOverlay({
	selectedElements,
	elements,
	zoom,
	onResizeStart,
	onRotateStart,
}: ElementSelectionOverlayProps) {
	if (selectedElements.length === 0) return null

	return (
		<>
			{selectedElements.map((elementId) => {
				const element = elements.find((el) => el.id === elementId)
				if (!element) return null

				const x = (element.x || 0) * zoom
				const y = (element.y || 0) * zoom
				const width = (element.width || 100) * zoom
				const height = (element.height || 50) * zoom

				// Adaptive handle sizing based on zoom level
				const baseHandleSize = 14
				const handleSize = Math.max(10, Math.min(20, baseHandleSize * (1 / Math.sqrt(zoom))))
				const handleOffset = handleSize / 2

				// Enhanced handle styles with better visual feedback
				const handleStyle: React.CSSProperties = {
					position: 'absolute',
					width: handleSize,
					height: handleSize,
					backgroundColor: '#2563eb', // Slightly darker blue
					border: '2px solid white',
					borderRadius: '50%',
					cursor: 'pointer',
					pointerEvents: 'auto',
					boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4), 0 1px 2px rgba(0, 0, 0, 0.1)',
					transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
					zIndex: 10,
				}

				// Style for the rotation icon container
				const rotationIconContainerStyle: React.CSSProperties = {
					position: 'absolute',
					cursor: 'grab',
					pointerEvents: 'auto',
					left: '50%',
					top: -38, // Adjusted spacing for a potentially larger icon/container
					transform: 'translateX(-50%)',
					transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
					zIndex: 11,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '4px', // Clickable area padding
				}

				// Selection border with subtle animation
				const selectionBorderStyle: React.CSSProperties = {
					position: 'absolute',
					left: x - 1,
					top: y - 1,
					width: width + 2,
					height: height + 2,
					border: '1px solid #2563eb',
					borderRadius: '2px',
					pointerEvents: 'none',
					boxSizing: 'border-box',
					transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
					transformOrigin: `${(width + 2) / 2}px ${(height + 2) / 2}px`,
					backgroundColor: 'rgba(37, 99, 235, 0.05)', // Very subtle blue tint
					animation: 'selection-pulse 2s infinite ease-in-out',
				}

				return (
					<React.Fragment key={`selection-${elementId}`}>
						{/* Selection border with subtle background tint */}
						<div style={selectionBorderStyle} />

						{/* Handle container */}
						<div
							style={{
								position: 'absolute',
								left: x,
								top: y,
								width: width,
								height: height,
								pointerEvents: 'none',
								transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
								transformOrigin: `${width / 2}px ${height / 2}px`,
								zIndex: 10,
							}}>
							{/* Rotation handle - changed to an Icon */}
							{onRotateStart && (
								<div
									style={rotationIconContainerStyle}
									title="Rotate element (Hold Shift for 15° increments)"
									onMouseDown={(e) => {
										e.stopPropagation()
										onRotateStart(e, elementId)
									}}
									onMouseEnter={(e) => {
										;(e.currentTarget as HTMLElement).style.transform = 'translateX(-50%) scale(1.2)'
									}}
									onMouseLeave={(e) => {
										;(e.currentTarget as HTMLElement).style.transform = 'translateX(-50%) scale(1)'
									}}>
									<Icon
										name="REFRESH_CW"
										size={20}
										className="text-slate-700 hover:text-blue-600 transition-colors"
									/>
								</div>
							)}

							{/* Corner resize handles with enhanced visual feedback */}
							{/* Top-left corner handle */}
							<div
								style={{
									...handleStyle,
									left: -handleOffset,
									top: -handleOffset,
									cursor: 'nw-resize',
								}}
								title="Resize from top-left (Hold Shift to maintain proportions)"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'top-left')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>

							{/* Top-right corner handle */}
							<div
								style={{
									...handleStyle,
									right: -handleOffset,
									top: -handleOffset,
									cursor: 'ne-resize',
								}}
								title="Resize from top-right (Hold Shift to maintain proportions)"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'top-right')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>

							{/* Bottom-right corner handle */}
							<div
								style={{
									...handleStyle,
									right: -handleOffset,
									bottom: -handleOffset,
									cursor: 'se-resize',
								}}
								title="Resize from bottom-right (Hold Shift to maintain proportions)"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'bottom-right')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>

							{/* Bottom-left corner handle */}
							<div
								style={{
									...handleStyle,
									left: -handleOffset,
									bottom: -handleOffset,
									cursor: 'sw-resize',
								}}
								title="Resize from bottom-left (Hold Shift to maintain proportions)"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'bottom-left')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>

							{/* Top edge handle */}
							<div
								style={{
									...handleStyle,
									left: '50%',
									top: -handleOffset,
									transform: 'translateX(-50%)',
									cursor: 'n-resize',
								}}
								title="Resize from top edge"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'top')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateX(-50%) scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateX(-50%) scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>

							{/* Bottom edge handle */}
							<div
								style={{
									...handleStyle,
									left: '50%',
									bottom: -handleOffset,
									transform: 'translateX(-50%)',
									cursor: 's-resize',
								}}
								title="Resize from bottom edge"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'bottom')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateX(-50%) scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateX(-50%) scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>

							{/* Left edge handle */}
							<div
								style={{
									...handleStyle,
									left: -handleOffset,
									top: '50%',
									transform: 'translateY(-50%)',
									cursor: 'w-resize',
								}}
								title="Resize from left edge"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'left')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>

							{/* Right edge handle */}
							<div
								style={{
									...handleStyle,
									right: -handleOffset,
									top: '50%',
									transform: 'translateY(-50%)',
									cursor: 'e-resize',
								}}
								title="Resize from right edge"
								onMouseDown={(e) => {
									e.stopPropagation()
									onResizeStart(e, elementId, 'right')
								}}
								onMouseEnter={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1.2)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									;(e.currentTarget as HTMLElement).style.transform = 'translateY(-50%) scale(1)'
									;(e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'
								}}
							/>
						</div>

						{/* CSS animations injected via style tag */}
						<style>{`
							@keyframes selection-pulse {
								0%, 100% {
									opacity: 0.8;
								}
								50% {
									opacity: 1;
								}
							}
						`}</style>
					</React.Fragment>
				)
			})}
		</>
	)
}
