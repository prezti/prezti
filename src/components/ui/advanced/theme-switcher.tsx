'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { TooltipWrapper } from '../composed/tooltip-wrapper'

export function ThemeSwitcher({ buttonProps }: { buttonProps?: ButtonProps }) {
	const { setTheme, theme } = useTheme()

	return (
		<DropdownMenu>
			<TooltipWrapper tooltip="Change theme">
				<DropdownMenuTrigger asChild className="focus:ring-none hover:bg-transparent focus:ring-0">
					<Button variant="outline" className="px-0.5 w-5 h-5 text-muted-foreground" {...buttonProps}>
						{theme === 'light' ? (
							<Icon
								name="Sun"
								className="transition-all scale-100 rotate-0 hover:text-primary dark:-rotate-90 dark:scale-0"
							/>
						) : (
							<Icon
								name="Moon"
								className="transition-all scale-0 rotate-90 hover:text-primary dark:rotate-0 dark:scale-100"
							/>
						)}
						<span className="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
			</TooltipWrapper>
			<DropdownMenuContent align="end" className="dark:bg-black">
				<DropdownMenuItem
					onClick={() => setTheme('light')}
					className={cn(theme === 'light' ? 'bg-accent text-accent-foreground' : '')}
					aria-checked={theme === 'light'}>
					<Icon name="Sun" className="w-4 h-4 me-2" />
					<span>Light</span>
					{theme === 'light' && <Icon name="Check" className="w-4 h-4 ms-auto" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme('dark')}
					className={cn(theme === 'dark' ? 'bg-accent text-accent-foreground' : '')}
					aria-checked={theme === 'dark'}>
					<Icon name="Moon" className="w-4 h-4 me-2" />
					<span>Dark</span>
					{theme === 'dark' && <Icon name="Check" className="w-4 h-4 ms-auto" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme('system')}
					className={cn(theme === 'system' ? 'bg-accent text-accent-foreground' : '')}
					aria-checked={theme === 'system'}>
					<Icon name="Laptop" className="w-4 h-4 me-2" />
					<span>System</span>
					{theme === 'system' && <Icon name="Check" className="w-4 h-4 ms-auto" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
