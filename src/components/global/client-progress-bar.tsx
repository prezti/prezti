'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export function ClientProgressBar() {
	return (
		<AppProgressBar
			height='4px'
			color='hsl(var(--primary))'
			options={{ showSpinner: false }}
			shallowRouting
		/>
	)
}
