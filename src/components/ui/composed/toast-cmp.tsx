'use client'

import { useDirection } from '@/hooks/use-direction'
import { Toaster } from 'sonner'

export function ToastsComponent() {
	const { isRTL } = useDirection()
	return <Toaster position={isRTL ? 'bottom-left' : 'bottom-right'} />
}
