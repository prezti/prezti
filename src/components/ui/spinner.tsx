import { LoadingCircle } from '@/components/ui/icons/loading-circle'
import { cn } from '@/lib/utils'

export function Spinner({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
	return <LoadingCircle className={cn(className)} dimensions={size} />
}
