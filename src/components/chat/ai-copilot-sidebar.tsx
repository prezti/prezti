'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Bot,
	CheckCircle,
	FileImage,
	Layout,
	Loader2,
	Palette,
	Send,
	Sparkles,
	User,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { SlideCreationTool } from './slide-creation-tool'

interface AiCopilotSidebarProps {
	onClose: () => void
}

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
	isTyping?: boolean
	toolCall?: {
		name: string
		status: 'executing' | 'completed'
		component?: React.ReactNode
	}
}

// Type for demo conversation items
interface DemoConversationItem {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestampOffset: number
	toolCall?: {
		name: string
		status: 'executing' | 'completed'
		componentName?: string
	}
}

// Demo conversation configuration
const DEMO_CONVERSATION: DemoConversationItem[] = [
	{
		id: '1',
		role: 'user',
		content: 'Make a slide for an online announcement.',
		timestampOffset: -120000, // 2 minutes ago
	},
	{
		id: '2',
		role: 'assistant',
		content: "I'll help you create a professional announcement slide! Let me generate that for you.",
		timestampOffset: -110000, // 1 minute 50 seconds ago
	},
	{
		id: '3',
		role: 'assistant',
		content: '',
		timestampOffset: -100000, // 1 minute 40 seconds ago
		toolCall: {
			name: 'create_slide',
			status: 'completed',
			componentName: 'SlideCreationTool',
		},
	},
	{
		id: '4',
		role: 'assistant',
		content:
			"Perfect! I've created a beautiful announcement slide for you. The slide includes a modern gradient background, compelling headline, and clear call-to-action. Is there anything else I can help you with?",
		timestampOffset: -80000, // 1 minute 20 seconds ago
	},
]

const contextualActions = [
	{
		icon: FileImage,
		label: 'Add background image',
		description: 'Choose from curated collection',
	},
	{
		icon: Palette,
		label: 'Suggest color palette',
		description: 'AI-powered color recommendations',
	},
	{
		icon: Layout,
		label: 'Optimize layout',
		description: 'Improve slide composition',
	},
]

export function AiCopilotSidebar({ onClose }: AiCopilotSidebarProps) {
	const [messages, setMessages] = useState<Message[]>([])
	const [inputValue, setInputValue] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [showActions, setShowActions] = useState(false)
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [demoInitialized, setDemoInitialized] = useState(false)

	// Initialize demo conversation once
	useEffect(() => {
		if (demoInitialized) return

		const demoMessages: Message[] = DEMO_CONVERSATION.map((msg) => {
			const baseMessage = {
				id: msg.id,
				role: msg.role,
				content: msg.content,
				timestamp: new Date(Date.now() + msg.timestampOffset),
			}

			// Add toolCall if it exists, with the actual React component
			if (msg.toolCall) {
				return {
					...baseMessage,
					toolCall: {
						name: msg.toolCall.name,
						status: msg.toolCall.status,
						component:
							msg.toolCall.componentName === 'SlideCreationTool' ? <SlideCreationTool /> : undefined,
					},
				}
			}

			return baseMessage
		})

		setMessages(demoMessages)
		setShowActions(true)
		setDemoInitialized(true)
	}, [demoInitialized])

	const handleSendMessage = () => {
		if (!inputValue.trim()) return

		const newMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: inputValue,
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, newMessage])
		setInputValue('')
		setIsLoading(true)
		setShowSuggestions(false)
		setShowActions(false)

		// Simulate AI response
		setTimeout(() => {
			const aiResponse: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: "I'd be happy to help you with that! Let me work on it for you.",
				timestamp: new Date(),
				isTyping: true,
			}
			setMessages((prev) => [...prev, aiResponse])

			setTimeout(() => {
				setMessages((prev) =>
					prev.map((msg) => (msg.id === aiResponse.id ? { ...msg, isTyping: false } : msg))
				)
				setIsLoading(false)
				setShowActions(true)
			}, 2000)
		}, 1000)
	}

	const handleInputFocus = () => {
		if (!isLoading && messages.length > 0 && showActions) {
			setShowSuggestions(true)
		}
	}

	const handleInputBlur = () => {
		setTimeout(() => setShowSuggestions(false), 150)
	}

	const handleSuggestionClick = (suggestionText: string) => {
		setInputValue(suggestionText)
		setShowSuggestions(false)
	}

	return (
		<div className="h-full flex flex-col bg-background text-foreground">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
				<div className="flex items-center gap-3 min-w-0">
					<div className="h-7 w-7 flex items-center justify-center bg-primary rounded-lg flex-shrink-0">
						<Bot className="h-5 w-5 text-primary-foreground" />
					</div>
					<div className="min-w-0">
						<h2 className="font-semibold text-foreground truncate">AI Copilot</h2>
						<p className="text-sm text-muted-foreground truncate">Your presentation assistant</p>
					</div>
				</div>
				<Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
					<X className="h-4 w-4" />
				</Button>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{messages.map((message) => (
						<div key={message.id} className="space-y-2">
							<div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
								{message.role === 'assistant' && (
									<div className="h-6 w-6 flex items-center justify-center bg-primary rounded-full flex-shrink-0 mt-1">
										<Bot className="h-4 w-4 text-primary-foreground" />
									</div>
								)}
								{message.content && (
									<div
										className={`max-w-[calc(100%-4rem)] rounded-2xl px-4 py-3 break-words ${
											message.role === 'user'
												? 'bg-primary text-primary-foreground'
												: 'bg-muted text-muted-foreground'
										}`}>
										{message.content && <p className="text-sm leading-relaxed">{message.content}</p>}
										{message.isTyping && (
											<div className="flex gap-1 py-2">
												<div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
												<div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-100" />
												<div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-200" />
											</div>
										)}
									</div>
								)}
								{message.role === 'user' && (
									<div className="p-1.5 bg-muted rounded-full flex-shrink-0 mt-1">
										<User className="h-4 w-4 text-muted-foreground" />
									</div>
								)}
							</div>
							{!message.content && <div className="-mb-1"></div>}

							{/* Tool Call Display */}
							{message.toolCall && (
								<div className="ml-11 mr-2">
									<Card className="p-3 border-border bg-secondary/30">
										<div className="flex items-center gap-3 mb-2">
											<div className="p-1.5 bg-green-500 rounded-md flex-shrink-0">
												{message.toolCall.status === 'executing' ? (
													<Loader2 className="h-4 w-4 text-secondary-foreground animate-spin" />
												) : (
													<CheckCircle className="h-4 w-4 text-white" />
												)}
											</div>
											<div className="min-w-0">
												<p className="text-sm font-medium text-foreground truncate">
													{message.toolCall.status === 'executing'
														? 'Creating slide...'
														: 'Slide created successfully'}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													Tool: {message.toolCall.name}
												</p>
											</div>
										</div>
										{message.toolCall.component}
									</Card>
								</div>
							)}
						</div>
					))}

					{/* Contextual Actions (Displayed after AI's final message) */}
					{showActions &&
						!isLoading &&
						messages.length > 0 &&
						messages[messages.length - 1].role === 'assistant' && (
							<div className="ml-11 mr-2 space-y-2 pt-2">
								<div className="flex items-center gap-2 mb-1">
									<Sparkles className="h-3.5 w-3.5 text-accent-foreground flex-shrink-0" />
									<span className="text-xs font-medium text-muted-foreground">Suggestions</span>
								</div>
								{contextualActions.map((action, index) => (
									<Button
										key={index}
										variant="outline"
										className="w-full justify-start h-auto p-2.5 group hover:bg-accent hover:border-accent-foreground/30"
										onClick={() => handleSuggestionClick(action.label)}>
										<div className="flex items-center gap-2.5 w-full min-w-0">
											<action.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
											<div className="text-left flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground truncate group-hover:text-accent-foreground transition-colors">
													{action.label}
												</p>
											</div>
										</div>
									</Button>
								))}
							</div>
						)}
				</div>
			</ScrollArea>

			{/* Input Area */}
			<div className="p-4 border-t border-border flex-shrink-0 relative">
				{/* Suggestions Overlay (shown on input focus if actions are available) */}
				{showSuggestions && (
					<div className="absolute bottom-full left-4 right-4 mb-2 bg-popover border border-border rounded-lg shadow-xl z-10 p-2 space-y-1 max-h-48 overflow-y-auto">
						{contextualActions.map((action, index) => (
							<button
								key={index}
								onClick={() => handleSuggestionClick(action.label)}
								className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 group">
								<action.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
								<span className="truncate text-foreground group-hover:text-accent-foreground">
									{action.label}
								</span>
							</button>
						))}
					</div>
				)}

				<div className="flex gap-2">
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Ask AI or type '/' for commands..."
						className="flex-1 min-w-0"
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault()
								handleSendMessage()
							}
							if (e.key === 'Escape') {
								setShowSuggestions(false)
							}
							if (e.key === '/') {
								setShowSuggestions(true)
							}
						}}
					/>
					<Button
						onClick={handleSendMessage}
						disabled={!inputValue.trim() || isLoading}
						size="icon"
						variant="default"
						className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
