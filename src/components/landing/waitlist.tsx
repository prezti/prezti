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
		<div className="max-w-md mx-auto">
			<form id="waitlist-form" action={handleSubmit} className="mb-4">
				<div className="flex gap-0 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
					<Input
						type="email"
						name="email"
						placeholder="example@gmail.com"
						required
						disabled={isPending}
						className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 rounded-s-lg rounded-t-lg rounded-b-lg rounded-e-none focus:ring-0 focus:outline-none h-12 px-4 disabled:opacity-50"
					/>
					<Button
						type="submit"
						disabled={isPending}
						className="bg-white text-black hover:bg-gray-100 h-12 px-6 rounded-none font-medium disabled:opacity-50 flex items-center justify-center min-w-[120px]">
						{isPending ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<>
								Join Waitlist
								<span className="ml-2">→</span>
							</>
						)}
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
			<div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
				<div className="w-2 h-2 bg-green-400 rounded-full"></div>
				<span>847 people already joined</span>
			</div>
		</div>
	)
}
