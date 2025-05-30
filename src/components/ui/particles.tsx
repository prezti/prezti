'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'

interface MousePosition {
	x: number
	y: number
}

function useMousePosition(): MousePosition {
	const [mousePosition, setMousePosition] = useState<MousePosition>({
		x: 0,
		y: 0,
	})

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			setMousePosition({ x: event.clientX, y: event.clientY })
		}

		window.addEventListener('mousemove', handleMouseMove)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [])

	return mousePosition
}

interface ParticlesProps {
	className?: string
	quantity?: number
	staticity?: number
	ease?: number
	size?: number
	refresh?: boolean
	width?: string
	height?: string
	vx?: number
	vy?: number
}

// Array of Tailwind CSS default colors with their RGB values
const TAILWIND_COLORS = [
	{ name: 'red-500', rgb: [239, 68, 68] },
	{ name: 'blue-500', rgb: [59, 130, 246] },
	{ name: 'green-500', rgb: [34, 197, 94] },
	{ name: 'yellow-500', rgb: [234, 179, 8] },
	{ name: 'purple-500', rgb: [168, 85, 247] },
	{ name: 'pink-500', rgb: [236, 72, 153] },
	{ name: 'indigo-500', rgb: [99, 102, 241] },
	{ name: 'teal-500', rgb: [20, 184, 166] },
	{ name: 'orange-500', rgb: [249, 115, 22] },
	{ name: 'cyan-500', rgb: [6, 182, 212] },
]

export const Particles: React.FC<ParticlesProps> = ({
	className = '',
	quantity = 250,
	staticity = 50,
	ease = 50,
	size = 0.6,
	refresh = false,
	width = '100%',
	height = '100%',
	vx = 0,
	vy = 0,
}) => {
	// All useRefs first
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const canvasContainerRef = useRef<HTMLDivElement>(null)
	const context = useRef<CanvasRenderingContext2D | null>(null)
	const circles = useRef<Circle[]>([])
	const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
	const animationFrameId = useRef<number>(0)

	// Then useState
	const mousePosition = useMousePosition()

	// Constants
	const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1

	type Circle = {
		x: number
		y: number
		translateX: number
		translateY: number
		size: number
		alpha: number
		targetAlpha: number
		dx: number
		dy: number
		magnetism: number
		color: { name: string; rgb: number[] }
	}

	const circleParams = (): Circle => {
		const x = Math.floor(Math.random() * canvasSize.current.w)
		const y = Math.floor(Math.random() * canvasSize.current.h)
		const translateX = 0
		const translateY = 0
		const pSize = Math.floor(Math.random() * 2) + size
		const alpha = 0
		const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1))
		const dx = (Math.random() - 0.5) * 0.1
		const dy = (Math.random() - 0.5) * 0.1
		const magnetism = 0.1 + Math.random() * 4
		const color =
			TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)]
		return {
			x,
			y,
			translateX,
			translateY,
			size: pSize,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism,
			color,
		}
	}

	const drawCircle = (circle: Circle, update = false) => {
		if (context.current) {
			const { x, y, translateX, translateY, size, alpha, color } = circle
			context.current.translate(translateX, translateY)
			context.current.beginPath()
			context.current.arc(x, y, size, 0, 2 * Math.PI)
			context.current.fillStyle = `rgba(${color.rgb.join(', ')}, ${alpha})`
			context.current.fill()
			context.current.setTransform(dpr, 0, 0, dpr, 0, 0)

			if (!update) {
				circles.current.push(circle)
			}
		}
	}

	const clearContext = () => {
		if (context.current) {
			context.current.clearRect(
				0,
				0,
				canvasSize.current.w,
				canvasSize.current.h,
			)
		}
	}

	const drawParticles = () => {
		clearContext()
		const particleCount = quantity
		for (let i = 0; i < particleCount; i++) {
			const circle = circleParams()
			drawCircle(circle)
		}
	}

	const remapValue = (
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number,
	): number => {
		const remapped =
			((value - start1) * (end2 - start2)) / (end1 - start1) + start2
		return remapped > 0 ? remapped : 0
	}

	const animate = () => {
		clearContext()
		circles.current.forEach((circle: Circle, i: number) => {
			// Handle the alpha value
			const edge = [
				circle.x + circle.translateX - circle.size,
				canvasSize.current.w -
					circle.x -
					circle.translateX -
					circle.size,
				circle.y + circle.translateY - circle.size,
				canvasSize.current.h -
					circle.y -
					circle.translateY -
					circle.size,
			]
			const closestEdge = edge.reduce((a, b) => Math.min(a, b))
			const remapClosestEdge = parseFloat(
				remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
			)
			if (remapClosestEdge > 1) {
				circle.alpha += 0.02
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge
			}
			circle.x += circle.dx + vx
			circle.y += circle.dy + vy
			circle.translateX +=
				(mouse.current.x / (staticity / circle.magnetism) -
					circle.translateX) /
				ease
			circle.translateY +=
				(mouse.current.y / (staticity / circle.magnetism) -
					circle.translateY) /
				ease

			drawCircle(circle, true)

			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.current.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.current.h + circle.size
			) {
				circles.current.splice(i, 1)
				const newCircle = circleParams()
				drawCircle(newCircle)
			}
		})
		animationFrameId.current = window.requestAnimationFrame(animate)
	}

	const resizeCanvas = () => {
		if (
			canvasContainerRef.current &&
			canvasRef.current &&
			context.current
		) {
			circles.current.length = 0
			canvasSize.current.w = canvasContainerRef.current.offsetWidth
			canvasSize.current.h = canvasContainerRef.current.offsetHeight
			canvasRef.current.width = canvasSize.current.w * dpr
			canvasRef.current.height = canvasSize.current.h * dpr
			canvasRef.current.style.width = `${canvasSize.current.w}px`
			canvasRef.current.style.height = `${canvasSize.current.h}px`
			context.current.scale(dpr, dpr)
		}
	}

	const initCanvas = () => {
		resizeCanvas()
		drawParticles()
	}

	const onMouseMove = () => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect()
			const { w, h } = canvasSize.current
			const x = mousePosition.x - rect.left - w / 2
			const y = mousePosition.y - rect.top - h / 2
			const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
			if (inside) {
				mouse.current.x = x
				mouse.current.y = y
			}
		}
	}

	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext('2d')
		}
		initCanvas()
		animate()
		window.addEventListener('resize', initCanvas)

		return () => {
			window.removeEventListener('resize', initCanvas)
			if (animationFrameId.current) {
				window.cancelAnimationFrame(animationFrameId.current)
			}
		}
	}, [])

	useEffect(() => {
		onMouseMove()
	}, [mousePosition.x, mousePosition.y])

	useEffect(() => {
		initCanvas()
	}, [refresh])

	return (
		<div
			className={cn(
				'absolute inset-0 w-full h-full pointer-events-none',
				className,
			)}
			ref={canvasContainerRef}
			style={{ width, height }}
			aria-hidden='true'
		>
			<canvas ref={canvasRef} className='size-full' />
		</div>
	)
}
