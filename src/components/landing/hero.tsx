import Image from 'next/image'
import { WaitlistForm } from './waitlist'

// Loading skeleton for the waitlist form
function WaitlistFormSkeleton() {
	return (
		<div className="max-w-2xl mx-auto">
			<div className="relative backdrop-blur-sm rounded-3xl border border-border/50 p-8 shadow-2xl bg-background/90">
				{/* Header skeleton */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-3 mb-4">
						<div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
						<div>
							<div className="w-48 h-8 bg-muted rounded mb-2 animate-pulse" />
							<div className="w-64 h-4 bg-muted rounded animate-pulse" />
						</div>
					</div>
				</div>

				{/* Progress section skeleton */}
				<div className="mb-8 p-6 rounded-2xl bg-muted animate-pulse">
					<div className="flex items-center justify-between mb-3">
						<div className="w-48 h-6 bg-background rounded animate-pulse" />
						<div className="w-32 h-4 bg-background rounded animate-pulse" />
					</div>
					<div className="w-full h-3 bg-background rounded-full mb-2 animate-pulse" />
					<div className="w-24 h-3 bg-background rounded mx-auto animate-pulse" />
				</div>

				{/* Form skeleton */}
				<div className="space-y-6">
					<div className="w-full h-14 bg-muted rounded-lg animate-pulse" />
					<div className="w-full h-14 bg-muted rounded-lg animate-pulse" />
				</div>
			</div>
		</div>
	)
}

export function Hero() {
	return (
		<section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-6 lg:px-8">
			{/* Hero Content */}
			<div className="relative z-10 max-w-4xl mx-auto text-center">
				{/* Main Headlines */}
				<h1 className="text-5xl md:text-7xl font-light text-white mb-8 leading-tight tracking-tight">
					Beyond Templates.
					<br />
					<span className="text-4xl md:text-6xl text-gray-300">
						AI presentations that understand your content.
					</span>
				</h1>

				{/* Subtitle */}
				<p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
					Prezti is an open-source alternative that turns ideas into professional presentations in
					seconds. Self-host and customize to your needs.
				</p>

				{/* Original Waitlist Form */}
				<div className="mb-16">
					<WaitlistForm />
				</div>

				{/* Product Preview Image */}
				<div className="relative max-w-3xl mx-auto">
					<Image
						src="/placeholder.svg?height=1080&width=1920"
						alt="Prezti Interface Preview"
						className="w-full h-auto object-cover opacity-20 rounded-xl"
						width={1920}
						height={1080}
						priority
					/>
					{/* Overlay gradient for better text readability */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
				</div>
			</div>

			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
			</div>
		</section>
	)
}
