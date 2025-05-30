'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import * as Collapsible from '@radix-ui/react-collapsible'
import { AlertTriangle, ChevronDown, Copy, RefreshCcw, RotateCcw, Send } from 'lucide-react'
import React, { Component, ReactNode } from 'react'

interface ErrorInfo {
	componentStack: string
	errorBoundary?: string
	eventType?: string
}

interface ErrorDetails {
	message: string
	stack?: string
	timestamp: string
	userAgent: string
	url: string
	userId?: string
	sessionId?: string
	buildVersion?: string
	componentStack?: string
	errorBoundary?: string
	recoveryAttempts: number
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
	errorDetails: ErrorDetails | null
	showDetails: boolean
	userFeedback: string
	isReporting: boolean
	reportSent: boolean
}

interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode
	onError?: (error: Error, errorInfo: ErrorInfo, errorDetails: ErrorDetails) => void
	enableReporting?: boolean
	maxRetries?: number
	level?: 'page' | 'component' | 'section'
	name?: string
}

interface ErrorRecoveryStrategy {
	name: string
	description: string
	action: () => void
	icon: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	private retryCount = 0
	private maxRetries: number
	private sessionId: string

	constructor(props: ErrorBoundaryProps) {
		super(props)

		this.maxRetries = props.maxRetries || 3
		this.sessionId = this.generateSessionId()

		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			errorDetails: null,
			showDetails: false,
			userFeedback: '',
			isReporting: false,
			reportSent: false,
		}
	}

	private generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
	}

	private createErrorDetails(error: Error, errorInfo: ErrorInfo): ErrorDetails {
		return {
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href,
			sessionId: this.sessionId,
			buildVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
			componentStack: errorInfo.componentStack,
			errorBoundary: this.props.name || 'Anonymous',
			recoveryAttempts: this.retryCount,
		}
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return {
			hasError: true,
			error,
		}
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const errorDetails = this.createErrorDetails(error, errorInfo)

		this.setState({
			errorInfo,
			errorDetails,
		})

		// Log to console for development
		console.error('Error Boundary caught an error:', error, errorInfo)

		// Call onError callback
		this.props.onError?.(error, errorInfo, errorDetails)

		// Report to error tracking service
		this.reportError(errorDetails)
	}

	private async reportError(errorDetails: ErrorDetails) {
		if (!this.props.enableReporting) return

		try {
			// In a real app, replace with your error reporting service
			// e.g., Sentry, LogRocket, Bugsnag, etc.
			const response = await fetch('/api/errors', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(errorDetails),
			})

			if (!response.ok) {
				throw new Error('Failed to report error')
			}
		} catch (reportingError) {
			console.error('Failed to report error:', reportingError)
		}
	}

	private handleRetry = () => {
		if (this.retryCount < this.maxRetries) {
			this.retryCount++
			this.setState({
				hasError: false,
				error: null,
				errorInfo: null,
				errorDetails: null,
				showDetails: false,
				userFeedback: '',
				reportSent: false,
			})
		}
	}

	private handleReset = () => {
		this.retryCount = 0
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
			errorDetails: null,
			showDetails: false,
			userFeedback: '',
			reportSent: false,
		})
	}

	private handleReload = () => {
		window.location.reload()
	}

	private handleGoHome = () => {
		window.location.href = '/'
	}

	private handleCopyError = () => {
		const { errorDetails } = this.state
		if (!errorDetails) return

		const errorText = `
Error: ${errorDetails.message}
Timestamp: ${errorDetails.timestamp}
URL: ${errorDetails.url}
User Agent: ${errorDetails.userAgent}
Session ID: ${errorDetails.sessionId}
Build Version: ${errorDetails.buildVersion}

Stack Trace:
${errorDetails.stack}

Component Stack:
${errorDetails.componentStack}
		`.trim()

		navigator.clipboard.writeText(errorText).then(() => {
			// Show toast notification
			console.log('Error details copied to clipboard')
		})
	}

	private handleSendFeedback = async () => {
		const { userFeedback, errorDetails } = this.state
		if (!userFeedback.trim() || !errorDetails) return

		this.setState({ isReporting: true })

		try {
			const feedbackData = {
				...errorDetails,
				userFeedback: userFeedback.trim(),
				feedbackTimestamp: new Date().toISOString(),
			}

			// In a real app, send to your feedback endpoint
			await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(feedbackData),
			})

			this.setState({ reportSent: true })
		} catch (error) {
			console.error('Failed to send feedback:', error)
		} finally {
			this.setState({ isReporting: false })
		}
	}

	private getRecoveryStrategies(): ErrorRecoveryStrategy[] {
		const canRetry = this.retryCount < this.maxRetries
		const { level } = this.props

		const strategies: ErrorRecoveryStrategy[] = []

		if (canRetry) {
			strategies.push({
				name: 'Try Again',
				description: 'Attempt to recover from the error',
				action: this.handleRetry,
				icon: <RefreshCcw className="h-4 w-4" />,
			})
		}

		strategies.push({
			name: 'Reset',
			description: 'Reset this component to its initial state',
			action: this.handleReset,
			icon: <RotateCcw className="h-4 w-4" />,
		})

		if (level === 'page') {
			strategies.push({
				name: 'Reload Page',
				description: 'Reload the entire page',
				action: this.handleReload,
				icon: <RefreshCcw className="h-4 w-4" />,
			})

			strategies.push({
				name: 'Go Home',
				description: 'Return to the home page',
				action: this.handleGoHome,
				icon: <RefreshCcw className="h-4 w-4" />,
			})
		}

		return strategies
	}

	private getErrorSeverity(): 'low' | 'medium' | 'high' | 'critical' {
		const { error } = this.state
		if (!error) return 'low'

		// Classify error severity based on error type and context
		const errorMessage = error.message.toLowerCase()
		const errorName = error.name.toLowerCase()

		// Critical errors
		if (
			errorName.includes('syntaxerror') ||
			errorName.includes('referenceerror') ||
			errorMessage.includes('cannot read property') ||
			errorMessage.includes('cannot access before initialization')
		) {
			return 'critical'
		}

		// High severity
		if (
			errorMessage.includes('network') ||
			errorMessage.includes('fetch') ||
			errorMessage.includes('failed to load') ||
			this.retryCount >= this.maxRetries
		) {
			return 'high'
		}

		// Medium severity
		if (errorMessage.includes('validation') || errorMessage.includes('type') || this.retryCount > 0) {
			return 'medium'
		}

		return 'low'
	}

	private getSeverityColor(severity: string): string {
		switch (severity) {
			case 'critical':
				return 'text-red-600 bg-red-50 border-red-200'
			case 'high':
				return 'text-orange-600 bg-orange-50 border-orange-200'
			case 'medium':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200'
			default:
				return 'text-blue-600 bg-blue-50 border-blue-200'
		}
	}

	render() {
		if (!this.state.hasError) {
			return this.props.children
		}

		// Use custom fallback if provided
		if (this.props.fallback && this.state.error && this.state.errorInfo) {
			return this.props.fallback(this.state.error, this.state.errorInfo, this.handleRetry)
		}

		const { error, errorDetails, showDetails, userFeedback, isReporting, reportSent } = this.state
		const recoveryStrategies = this.getRecoveryStrategies()
		const severity = this.getErrorSeverity()
		const severityColor = this.getSeverityColor(severity)

		return (
			<div className="flex items-center justify-center min-h-[400px] p-6">
				<Card className={`w-full max-w-2xl border-2 ${severityColor}`}>
					<CardHeader>
						<div className="flex items-center gap-3">
							<AlertTriangle className="h-8 w-8 text-destructive" />
							<div>
								<CardTitle className="text-xl">Something went wrong</CardTitle>
								<CardDescription>
									We encountered an unexpected error. Don&apos;t worry, your data is safe.
								</CardDescription>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Error Summary */}
						<div className="p-4 bg-muted rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="font-medium">Error Summary</span>
								<span className={`px-2 py-1 text-xs rounded-full font-medium ${severityColor}`}>
									{severity.toUpperCase()}
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								{error?.message || 'An unknown error occurred'}
							</p>
							{this.retryCount > 0 && (
								<p className="text-xs text-muted-foreground mt-1">
									Recovery attempts: {this.retryCount}/{this.maxRetries}
								</p>
							)}
						</div>

						{/* Recovery Options */}
						<div className="space-y-3">
							<h3 className="font-medium">Recovery Options</h3>
							<div className="grid grid-cols-2 gap-2">
								{recoveryStrategies.map((strategy) => (
									<Button
										key={strategy.name}
										variant="outline"
										className="flex items-center gap-2 h-auto p-3"
										onClick={strategy.action}>
										{strategy.icon}
										<div className="text-left">
											<div className="font-medium text-sm">{strategy.name}</div>
											<div className="text-xs text-muted-foreground">{strategy.description}</div>
										</div>
									</Button>
								))}
							</div>
						</div>

						{/* User Feedback */}
						<div className="space-y-3">
							<h3 className="font-medium">Help us improve</h3>
							<Textarea
								placeholder="Tell us what you were doing when this error occurred..."
								value={userFeedback}
								onChange={(e) => this.setState({ userFeedback: e.target.value })}
								className="min-h-[80px]"
								disabled={reportSent}
							/>
							<Button
								onClick={this.handleSendFeedback}
								disabled={!userFeedback.trim() || isReporting || reportSent}
								className="w-full">
								{isReporting ? (
									'Sending...'
								) : reportSent ? (
									'Feedback sent - Thank you!'
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Send Feedback
									</>
								)}
							</Button>
						</div>

						{/* Error Details */}
						<Collapsible.Root
							open={showDetails}
							onOpenChange={(open) => this.setState({ showDetails: open })}>
							<Collapsible.Trigger asChild>
								<Button variant="ghost" className="w-full justify-between">
									<span>Technical Details</span>
									<ChevronDown className="h-4 w-4" />
								</Button>
							</Collapsible.Trigger>
							<Collapsible.Content>
								<div className="mt-3 p-4 bg-muted rounded-lg space-y-3">
									{errorDetails && (
										<>
											<div className="grid grid-cols-2 gap-2 text-sm">
												<div>
													<span className="font-medium">Timestamp:</span>
													<p className="text-muted-foreground">{errorDetails.timestamp}</p>
												</div>
												<div>
													<span className="font-medium">Session ID:</span>
													<p className="text-muted-foreground font-mono text-xs">
														{errorDetails.sessionId}
													</p>
												</div>
												<div>
													<span className="font-medium">Build Version:</span>
													<p className="text-muted-foreground">{errorDetails.buildVersion}</p>
												</div>
												<div>
													<span className="font-medium">Component:</span>
													<p className="text-muted-foreground">{errorDetails.errorBoundary}</p>
												</div>
											</div>

											{errorDetails.stack && (
												<div>
													<span className="font-medium text-sm">Stack Trace:</span>
													<pre className="mt-1 p-2 bg-background rounded border text-xs overflow-auto max-h-32">
														{errorDetails.stack}
													</pre>
												</div>
											)}

											<Button
												variant="outline"
												size="sm"
												onClick={this.handleCopyError}
												className="w-full">
												<Copy className="h-4 w-4 mr-2" />
												Copy Error Details
											</Button>
										</>
									)}
								</div>
							</Collapsible.Content>
						</Collapsible.Root>
					</CardContent>
				</Card>
			</div>
		)
	}
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
	const WrappedComponent = (props: P) => (
		<ErrorBoundary {...errorBoundaryProps}>
			<Component {...props} />
		</ErrorBoundary>
	)

	WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
	return WrappedComponent
}

// Hook for error handling in functional components
export function useErrorHandler() {
	const handleError = (error: Error, errorInfo?: { componentStack?: string }) => {
		// Log the error
		console.error('Error caught by useErrorHandler:', error)

		// Report the error
		const errorDetails = {
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href,
			componentStack: errorInfo?.componentStack,
			recoveryAttempts: 0,
		}

		// In a real app, send to error reporting service
		fetch('/api/errors', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(errorDetails),
		}).catch((reportingError) => {
			console.error('Failed to report error:', reportingError)
		})
	}

	return { handleError }
}

// Error boundary for async operations
export function AsyncErrorBoundary({
	children,
	onError,
}: {
	children: ReactNode
	onError?: (error: Error) => void
}) {
	const [error, setError] = React.useState<Error | null>(null)

	React.useEffect(() => {
		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			const error = new Error(event.reason?.message || 'Unhandled promise rejection')
			setError(error)
			onError?.(error)
		}

		window.addEventListener('unhandledrejection', handleUnhandledRejection)
		return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection)
	}, [onError])

	if (error) {
		return (
			<ErrorBoundary
				name="AsyncErrorBoundary"
				level="component"
				onError={(err, info, details) => {
					console.error('Async error:', err, info, details)
				}}>
				<div>An error occurred in an async operation</div>
			</ErrorBoundary>
		)
	}

	return <>{children}</>
}

// Utility function to safely execute async operations
export async function safeAsync<T>(
	operation: () => Promise<T>,
	fallback?: T,
	onError?: (error: Error) => void
): Promise<T | undefined> {
	try {
		return await operation()
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error))
		onError?.(err)
		console.error('Safe async operation failed:', err)
		return fallback
	}
}
