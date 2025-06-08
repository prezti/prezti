'use client'

import { CLogo } from '@/components/ui/composed/c-logo'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { motion, useScroll } from 'framer-motion'
import { Github } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
	const { scrollY } = useScroll()
	const [hasScrolled, setHasScrolled] = useState(false)

	// Handle scroll events to change navbar style
	useEffect(() => {
		const unsubscribe = scrollY.on('change', (latest) => {
			setHasScrolled(latest > 10)
		})
		return unsubscribe
	}, [scrollY])

	return (
		<motion.header
			className={cn(
				'fixed z-50 flex justify-center transition-all duration-300 ease-in-out w-full',
				hasScrolled ? 'top-4 md:top-6' : 'top-0'
			)}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{
				type: 'spring',
				stiffness: 300,
				damping: 30,
				duration: 0.5,
			}}>
			{/* Container that mimics the width/styling change on scroll */}
			<div
				className={cn(
					'transition-all duration-300 ease-in-out w-full',
					hasScrolled ? 'px-2 md:px-4' : 'px-0'
				)}>
				<div
					className={cn(
						'flex h-16 items-center justify-between max-w-7xl mx-auto rounded-2xl transition-all duration-300 ease-in-out',
						hasScrolled
							? 'px-4 border border-white/10 backdrop-blur-lg bg-black/80 shadow-xl'
							: 'px-4 sm:px-6 lg:px-8 bg-transparent border-transparent'
					)}>
					{/* Logo */}
					<CLogo isLink className="flex items-center" textClassName="text-white" />

					{/* GitHub Star Button */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.3 }}>
						<a
							href="https://github.com/prezti/prezti"
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								'group inline-flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 border',
								hasScrolled
									? 'border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 text-white backdrop-blur-sm'
									: 'border-gray-700 bg-gray-900/50 hover:bg-gray-800/70 hover:border-gray-500 text-gray-300 hover:text-white'
							)}>
							<Github className="w-4 h-4 text-white transition-colors" />
							<span className="hidden sm:inline">Give us a</span>
							<Icon
								name="Star"
								className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200"
							/>
							<span className="sm:hidden">Star</span>
						</a>
					</motion.div>
				</div>
			</div>
		</motion.header>
	)
}
