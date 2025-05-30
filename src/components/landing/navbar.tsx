'use client'

import { Button } from '@/components/ui/button'
import { Github, Presentation } from 'lucide-react'

export function Navbar() {
	return (
		<nav className="max-w-7xl mx-auto px-6 lg:px-8">
			<div className="flex justify-between items-center h-16">
				{/* Logo */}
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
						<Presentation className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl text-white">Prezti</span>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-6">
					<a
						href="https://github.com"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm">
						<Github className="w-4 h-4" />
						<span>Star on GitHub</span>
					</a>
					<Button size="sm" className="bg-white text-black hover:bg-gray-100">
						Get Started
					</Button>
				</div>
			</div>
		</nav>
	)
}
