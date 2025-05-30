'use client'

import dynamic from 'next/dynamic'
import { Fragment } from 'react'

function NoSsrComponent({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <Fragment>{children}</Fragment>
}

export const NoSSR = dynamic(() => Promise.resolve(NoSsrComponent), {
	ssr: false,
})
