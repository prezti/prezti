import { cn } from '@/lib/utils'

type LogoTextProps = {
	text: string
	className?: string
}

export function LogoText({ className, text }: LogoTextProps) {
	return (
		<h1
			className={cn('inline-flex relative items-center text-2xl font-bold text-foreground', className)}>
			{text}
		</h1>
	)
}
