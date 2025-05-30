import { ClientProgressBar } from '@/components/global/client-progress-bar'
import { NoSSR } from '@/components/global/no-ssr'
import { AppProviders } from '@/components/providers/app-providers'
import { ToastsComponent } from '@/components/ui/composed/toast-cmp'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Pretzi | AI Presentations that understand you',
	description:
		'Pretzi is a platform for creating and sharing AI presentations that understand what you do.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AppProviders>
					{/* <AppInitializers /> */}
					{children}
				</AppProviders>
				<Suspense>
					<ClientProgressBar />
				</Suspense>
				<NoSSR>
					<ToastsComponent />
				</NoSSR>
				<div id="toolbar-portal-target"></div>
			</body>
		</html>
	)
}
