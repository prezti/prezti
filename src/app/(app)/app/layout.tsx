'use client'

import { AiCopilotSidebar } from '@/components/chat/ai-copilot-sidebar'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)
	const [isRTL, setIsRTL] = useState(false)

	// Check for RTL direction
	useEffect(() => {
		const checkRTL = () => {
			setIsRTL(document.documentElement.dir === 'rtl')
		}
		checkRTL()

		// Listen for direction changes
		const observer = new MutationObserver(checkRTL)
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['dir'],
		})

		return () => observer.disconnect()
	}, [])

	// Keyboard shortcut to toggle sidebar
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
				event.preventDefault()
				setIsSidebarOpen((prev) => !prev)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<div className="h-screen bg-background text-foreground">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				{/* AI Copilot Sidebar Panel (RTL: on left) */}
				{isSidebarOpen && isRTL && (
					<>
						<ResizablePanel
							defaultSize={25}
							minSize={20}
							maxSize={50}
							collapsible
							onCollapse={() => setIsSidebarOpen(false)}
							className="bg-background border-r border-border">
							<AiCopilotSidebar onClose={() => setIsSidebarOpen(false)} />
						</ResizablePanel>
						<ResizableHandle withHandle className="w-2 bg-muted hover:bg-primary/20 transition-colors" />
					</>
				)}

				{/* Main Content Panel */}
				<ResizablePanel defaultSize={isSidebarOpen ? 75 : 100} minSize={50}>
					<div className="relative h-full">
						{children}

						{/* Floating AI Toggle Button */}
						{isSidebarOpen ? null : (
							<Button
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								className={`fixed bottom-6 h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 z-50 group ${
									isRTL ? 'left-6' : 'right-6'
								}`}
								size="icon">
								<>
									<MessageSquare className="h-5 w-5 text-white" />
									{!isSidebarOpen && (
										<div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
									)}
								</>
							</Button>
						)}
					</div>
				</ResizablePanel>

				{/* AI Copilot Sidebar Panel (LTR: on right) */}
				{isSidebarOpen && !isRTL && (
					<>
						<ResizableHandle
							withHandle
							className="w-2 bg-slate-200 dark:bg-slate-700 hover:bg-blue-300 dark:hover:bg-blue-600 transition-colors"
						/>
						<ResizablePanel
							defaultSize={25}
							minSize={20}
							maxSize={50}
							className="bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700">
							<AiCopilotSidebar onClose={() => setIsSidebarOpen(false)} />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>
		</div>
	)
}
