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
		<section className="relative min-h-screen bg-gradient-to-b from-gray-950 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 lg:pt-32 pb-16">
			<div className="relative z-10 w-full max-w-6xl mx-auto">
				{/* Main Content */}
				<div className="text-center mb-12 md:mb-20">
					{/* Headlines */}
					<div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
						<h1 className="text-4xl sm:text-6xl md:text-8xl font-extralight text-white leading-[0.85] tracking-tight px-4 sm:px-0">
							Beyond Templates
						</h1>
						<p className="text-xl sm:text-2xl md:text-4xl text-gray-400 font-light leading-tight max-w-4xl mx-auto px-4 sm:px-0">
							AI presentations that understand your content
						</p>
					</div>

					{/* Subtitle */}
					<p className="text-lg sm:text-xl text-gray-500 mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
						Prezti is an open-source alternative that turns ideas into professional presentations in
						seconds. Self-host and customize to your needs.
					</p>

					{/* Waitlist Form */}
					<div className="mb-12 md:mb-20">
						<WaitlistForm />
					</div>
				</div>

				{/* Product Preview */}
				<div className="relative max-w-5xl mx-auto px-4 sm:px-0">
					<div className="relative overflow-hidden rounded-lg md:rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
						<Image
							src="/images/dashboard.png"
							alt="Prezti Interface Preview"
							className="w-full h-auto object-cover"
							width={1920}
							height={1080}
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
						/>
					</div>
				</div>
			</div>

			{/* Subtle Background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl" />
			</div>
		</section>
	)
}
