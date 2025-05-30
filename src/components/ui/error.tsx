import { Icon } from '@/components/ui/icon'

type ErrorProps = {
	error?: string
}

export function Error({ error }: ErrorProps) {
	if (!error) return null

	return (
		<p className='flex items-center gap-2 base-sm text-destructive'>
			<Icon name='CircleAlert' width='16' height='16' />
			{error}
		</p>
	)
}
