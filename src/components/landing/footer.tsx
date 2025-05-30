import { Presentation } from 'lucide-react'

export function Footer() {
	return (
		<footer className="border-t border-gray-800 py-8 px-6 lg:px-8">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
				<div className="flex items-center space-x-3 mb-4 md:mb-0">
					<div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex items-center justify-center">
						<Presentation className="w-4 h-4 text-white" />
					</div>
					<span>Prezti</span>
				</div>
				<div className="flex items-center space-x-6">
					<span>© 2024</span>
					<span>Open Source</span>
					<span>Self-Hosted</span>
				</div>
			</div>
		</footer>
	)
}
