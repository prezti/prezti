import { ThemeProvider } from '@/components/providers/theme-provider'

export function AppProviders({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			{/* {process.env.NODE_ENV === 'development' && (
				<StagewiseToolbar config={{ plugins: [] }} />
			)} */}
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				{children}
			</ThemeProvider>
		</>
	)
}
