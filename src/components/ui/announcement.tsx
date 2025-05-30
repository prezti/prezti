import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface AnnouncementProps {
	title: string
	description: string
	href?: string
	onClose?: () => void
}

export function Announcement({
	title,
	description,
	href,
	onClose,
}: AnnouncementProps) {
	const Content = () => (
		<section className='flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-border/60 hover:shadow-sm'>
			<span className='flex items-center justify-between text-muted-foreground'>
				<h5 className='text-[13px] font-medium'>{title}</h5>
				{onClose && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									onClick={onClose}
									className='inline-flex h-5 w-5 items-center justify-center rounded-sm text-xs hover:bg-accent focus:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
								>
									<span className='text-lg'>×</span>
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Close</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</span>
			<p className='text-sm text-card-foreground'>{description}</p>
		</section>
	)

	return (
		<div className='collapsed:hidden relative w-full'>
			<div className='absolute inset-x-0 -top-8 z-10 h-8 w-full from-background to-transparent bg-gradient-to-t' />
			{href ? (
				<a
					href={href}
					target='_blank'
					rel='noreferrer'
					className='relative z-20 block h-fit w-full p-2 pt-0'
				>
					<Content />
				</a>
			) : (
				<div className='relative z-20 block h-fit w-full p-2 pt-0'>
					<Content />
				</div>
			)}
		</div>
	)
}
