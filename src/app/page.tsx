'use client'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { Navbar } from '@/components/landing/navbar'

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />
			<Hero />
			<Footer />
		</div>
	)
}
