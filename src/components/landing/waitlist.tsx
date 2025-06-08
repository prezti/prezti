'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { joinWaitlist } from './actions/join-waitlist'

export function WaitlistForm() {
	const [isPending, startTransition] = useTransition()
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

	async function handleSubmit(formData: FormData) {
		startTransition(async () => {
			const result = await joinWaitlist(formData)

			if (result.error) {
				setMessage({ type: 'error', text: result.error })
			} else if (result.success) {
				setMessage({ type: 'success', text: result.message || 'Thanks for joining!' })
				// Reset form
				const form = document.getElementById('waitlist-form') as HTMLFormElement
				form?.reset()
			}

			// Clear message after 5 seconds
			setTimeout(() => setMessage(null), 5000)
		})
	}

	return (
		<div className="max-w-md mx-auto px-4 sm:px-0">
			<form id="waitlist-form" action={handleSubmit} className="mb-6">
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:rounded-lg sm:border sm:border-gray-700 sm:bg-gray-900/50 overflow-hidden focus-within:border-gray-600 transition-colors">
					<Input
						type="email"
						name="email"
						placeholder="Enter your email"
						required
						disabled={isPending}
						className="flex-1 bg-gray-900/50 sm:bg-transparent border border-gray-700 sm:border-0 text-white placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-offset-0 h-12 px-4 disabled:opacity-50 rounded-lg sm:rounded-none"
					/>
					<Button
						type="submit"
						disabled={isPending}
						className="bg-white text-black hover:bg-gray-100 h-12 px-6 font-medium disabled:opacity-50 flex items-center justify-center min-w-[110px] rounded-lg sm:rounded-none sm:border-l sm:border-gray-700">
						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Early Access'}
					</Button>
				</div>
			</form>

			{/* Status Message */}
			{message && (
				<div
					className={`text-center text-sm mb-4 ${
						message.type === 'success' ? 'text-green-400' : 'text-red-400'
					}`}>
					{message.text}
				</div>
			)}

			{/* Social Proof */}
			<p className="text-center text-sm text-gray-400">
				Join <span className="text-blue-400 font-medium">847+ developers</span> in the waitlist
			</p>
		</div>
	)
}
