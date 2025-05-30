// utils/toast
import { Icon } from '@/components/ui/icon'
import { LoadingCircle } from '@/components/ui/icons/loading-circle'
import { cn } from '@/lib/utils'
import { ReactElement } from 'react'
import { toast as SonnerToast } from 'sonner'

// Types and Interfaces
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'promise' | 'cancel'

export type ToastMessage = string | { title: string; description?: string }

export interface ToastOptions {
	duration?: number
	customClassName?: string
	onSuccess?: (payload: unknown) => void
	onError?: (error: unknown) => void
	action?: {
		label: string
		onClick: () => void
	}
}

export type PromiseMessages<T> =
	| {
			loading: string
			success: string | ((message: unknown, input: T) => string)
			error: string | ((error: unknown, input: T) => string)
	  }
	| {
			loading?: never
			success?: string | ((message: unknown, input: T) => string)
			error: string | ((error: unknown, input: T) => string)
	  }

export type PromiseActions<T> = {
	onSuccess?: (payload: unknown, input: T) => void
	onError?: (error: unknown, input: T) => void
	onFinally?: (result: unknown, input: T) => void
}

// Toast type configurations
const toastTypes: Record<ToastType, { className: string; icon: ReactElement }> = {
	success: {
		className: 'bg-green-500 text-background',
		icon: <Icon name="Check" className="text-background" />,
	},
	error: {
		className: 'bg-destructive text-destructive-foreground',
		icon: <Icon name="X" className="text-destructive-foreground" />,
	},
	info: {
		className: 'bg-blue-500 text-background',
		icon: <Icon name="Lightbulb" className="text-background" />,
	},
	warning: {
		className: 'bg-yellow-400 text-background',
		icon: <Icon name="TriangleAlert" className="text-background" />,
	},
	promise: {
		className: 'bg-muted text-muted-foreground',
		icon: <LoadingCircle />,
	},
	cancel: {
		className: 'bg-destructive text-destructive-foreground',
		icon: <Icon name="X" className="text-destructive-foreground" />,
	},
}

// Core toast display function
const showToast = (type: ToastType, message: ToastMessage, options?: ToastOptions) => {
	const { className, icon } = toastTypes[type] || toastTypes.info
	const { duration = 5000, customClassName = '', action } = options || {}

	return SonnerToast.custom(
		(t) => (
			<div
				className={cn(
					'flex justify-between items-center px-4 py-3 rounded-lg min-h-[3rem] min-w-[22rem]',
					className,
					customClassName
				)}>
				<div className="flex flex-col gap-1 flex-1">
					<span className="flex gap-4 items-center">
						{icon} {typeof message === 'string' ? message : message.title}
					</span>
					{typeof message !== 'string' && message.description && (
						<p className="text-sm">{message.description}</p>
					)}
				</div>
				<div className="flex items-center gap-2 ml-4">
					{action && (
						<button
							onClick={() => {
								action.onClick()
								SonnerToast.dismiss(t)
							}}
							className="px-3 py-1 text-sm font-medium bg-background/20 hover:bg-background/30 rounded transition-colors">
							{action.label}
						</button>
					)}
					<button onClick={() => SonnerToast.dismiss(t)}>
						<Icon name="X" />
					</button>
				</div>
			</div>
		),
		{ duration }
	)
}

// Toast function overloads
function toast(
	message: { title: string; description?: string },
	options?: ToastOptions
): ReturnType<typeof showToast>
function toast(
	type: ToastType,
	message: ToastMessage,
	options?: ToastOptions
): ReturnType<typeof showToast>

// Toast function implementation
function toast(
	typeOrMessage: ToastType | { title: string; description?: string },
	messageOrOptions?: ToastMessage | ToastOptions,
	options?: ToastOptions
) {
	// If first argument is an object with title property, treat it as a message with 'info' type
	if (typeof typeOrMessage === 'object' && 'title' in typeOrMessage) {
		return showToast('info', typeOrMessage, messageOrOptions as ToastOptions)
	}

	// Otherwise use the standard implementation
	return showToast(typeOrMessage as ToastType, messageOrOptions as ToastMessage, options)
}

// Toast convenience methods
toast.success = (message: ToastMessage, options?: ToastOptions) => showToast('success', message, options)

toast.error = (message: ToastMessage, options?: ToastOptions) => showToast('error', message, options)

toast.info = (message: ToastMessage, options?: ToastOptions) => showToast('info', message, options)

toast.warning = (message: ToastMessage, options?: ToastOptions) => showToast('warning', message, options)

toast.cancel = (message: string, options?: ToastOptions) => showToast('cancel', message, options)

toast.dismiss = SonnerToast.dismiss

// Promise-based toast function
function toastPromise<T>(
	asyncFunction: (input: T) => Promise<unknown>,
	messages: PromiseMessages<T> & PromiseActions<T>,
	options?: ToastOptions
) {
	return async (input: T) => {
		const toastId = messages.loading
			? toast('promise', messages.loading, {
					...options,
					duration: Infinity,
			  })
			: null

		try {
			const result = await asyncFunction(input)
			if (toastId) toast.dismiss(toastId)

			const successMessage =
				typeof messages.success === 'function' ? messages.success(result, input) : messages.success
			if (successMessage) toast('success', successMessage, options)

			if (messages.onSuccess) {
				messages.onSuccess(result, input)
			}

			return result
		} catch (error) {
			if (toastId) toast.dismiss(toastId)

			const errorMessage =
				typeof messages.error === 'function' ? messages.error(error, input) : messages.error
			toast('error', errorMessage, options)

			if (messages.onError) {
				messages.onError(error, input)
			}

			throw error
		}
	}
}

toast.promise = toastPromise

export { toast }
