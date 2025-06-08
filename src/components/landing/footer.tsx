import { CLogo } from '@/components/ui/composed/c-logo'
import { Github, Twitter } from 'lucide-react'

export function Footer() {
	return (
		<footer className="border-t border-gray-800/50 bg-gradient-to-b from-black to-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 mb-6 md:mb-8">
					{/* Logo & Description */}
					<div className="sm:col-span-2 md:col-span-2 text-center sm:text-left">
						<div className="flex justify-center sm:justify-start mb-4">
							<CLogo className="!justify-start" textClassName="text-white" />
						</div>
						<p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6 sm:mb-0 mx-auto sm:mx-0">
							Open-source presentation platform that turns ideas into professional presentations in
							seconds. Self-host and customize to your needs.
						</p>
					</div>

					{/* Quick Links */}
					<div className="sm:col-span-1 text-center sm:text-left">
						<h3 className="text-white font-medium mb-3 text-sm">Open Source</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://github.com/prezti/prezti"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									Repository
								</a>
							</li>
							<li>
								<a
									href="https://github.com/prezti/prezti#readme"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									Documentation
								</a>
							</li>
							<li>
								<a
									href="https://github.com/prezti/prezti/blob/main/LICENSE"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									License
								</a>
							</li>
						</ul>
					</div>

					{/* Social Links */}
					<div className="sm:col-span-1 text-center sm:text-left">
						<h3 className="text-white font-medium mb-3 text-sm">Connect</h3>
						<div className="space-y-2">
							<a
								href="https://x.com/prezti_com"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
								<Twitter className="w-4 h-4" />
								<span>@prezti_com</span>
							</a>
							<a
								href="https://x.com/YonatanLavy"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
								<Twitter className="w-4 h-4" />
								<span>@YonatanLavy</span>
							</a>
							<a
								href="https://github.com/prezti/prezti"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
								<Github className="w-4 h-4" />
								<span>GitHub</span>
							</a>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-6 md:pt-8 border-t border-gray-800/50">
					<div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-3 md:space-y-0">
						<div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
							<span>© 2024 Prezti</span>
							<span className="hidden sm:inline">•</span>
							<span>Open Source</span>
							<span className="hidden sm:inline">•</span>
							<span>Self-Hosted</span>
						</div>
						<div className="text-center md:text-right">
							<span>From idea to presentation in seconds</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
