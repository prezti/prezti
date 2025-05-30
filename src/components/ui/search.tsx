'use client'

import { A } from '@/components/ui/a'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSidebar } from './sidebar'

export type SearchResult = {
	id?: string
	icon_name?: string
	title: string
	url: string
	subtitle?: string
}

type SearchProps = {
	results: SearchResult[]
	placeholder?: string
	triggerLabel?: string
	defaultIcon?: string
	maxResults?: number
	className?: string
	triggerClassName?: string
	popoverSide?: 'top' | 'right' | 'bottom' | 'left'
	popoverAlign?: 'start' | 'center' | 'end'
	sideOffset?: number
	width?: string | number
	onResultSelect?: (result: SearchResult) => void
}

export function Search({
	results,
	placeholder = 'Search...',
	triggerLabel = 'Search',
	defaultIcon = 'Database',
	maxResults = 6,
	className = '',
	triggerClassName = '',
	popoverSide = 'right',
	popoverAlign = 'start',
	sideOffset = 4,
	width = '24rem',
	onResultSelect,
}: SearchProps) {
	const router = useRouter()
	const isMobile = useIsMobile()
	const { onOpenChange: handleSidebarOpenChange } = useSidebar()
	const [searchTerm, setSearchTerm] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [focusedIndex, setFocusedIndex] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)

	// Ensure results is always a valid array
	const safeResults = useMemo(() => results || [], [results])

	// Memoize filtered results to prevent recalculations during renders
	const filteredResults = useMemo(() => {
		return safeResults
			.filter((result) => result.title.toLowerCase().includes(searchTerm.toLowerCase()))
			.slice(0, maxResults)
	}, [safeResults, searchTerm, maxResults])

	// Reset focused index when results change
	useEffect(() => {
		setFocusedIndex(0)
	}, [filteredResults.length])

	// Focus on the input when opening the search
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 0)
		}
	}, [isOpen])

	// Focus on result item by index
	const focusResultItem = useCallback((index: number) => {
		const element = document.getElementById(`search-result-${index}`)
		if (element) {
			element.focus()
		}
	}, [])

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}, [])

	const handleResultSelect = useCallback(
		(result: SearchResult) => {
			if (onResultSelect) {
				onResultSelect(result)
			} else {
				router.push(result.url)
				if (isMobile) {
					handleSidebarOpenChange(false)
				}
			}
			setIsOpen(false)
		},
		[router, onResultSelect]
	)

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			setIsOpen(true)
		}
	}, [])

	const handleSearchInputKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (filteredResults.length === 0) return

			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault()
					const nextIndex = Math.min(focusedIndex + 1, filteredResults.length - 1)
					setFocusedIndex(nextIndex)
					focusResultItem(nextIndex)
					break
				case 'ArrowUp':
					e.preventDefault()
					if (focusedIndex === 0) {
						inputRef.current?.focus()
					} else {
						const prevIndex = Math.max(focusedIndex - 1, 0)
						setFocusedIndex(prevIndex)
						focusResultItem(prevIndex)
					}
					break
				case 'Enter':
					e.preventDefault()
					if (filteredResults.length > 0) {
						handleResultSelect(filteredResults[0])
					}
					break
				case 'Escape':
					e.preventDefault()
					setIsOpen(false)
					break
			}
		},
		[filteredResults, focusedIndex, focusResultItem, handleResultSelect]
	)

	const handleResultKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault()
					if (index < filteredResults.length - 1) {
						const nextIndex = index + 1
						setFocusedIndex(nextIndex)
						focusResultItem(nextIndex)
					}
					break
				case 'ArrowUp':
					e.preventDefault()
					if (index > 0) {
						const prevIndex = index - 1
						setFocusedIndex(prevIndex)
						focusResultItem(prevIndex)
					} else {
						inputRef.current?.focus()
					}
					break
				case 'Enter':
					e.preventDefault()
					handleResultSelect(filteredResults[index])
					break
				case 'Escape':
					e.preventDefault()
					setIsOpen(false)
					break
			}
		},
		[filteredResults, focusResultItem, handleResultSelect]
	)

	const SearchContent = useMemo(() => {
		const resultHeight = 48 // Approximate height of each result item
		const maxHeight = Math.min(filteredResults.length * resultHeight, 300)

		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className="border-b p-2.5">
						<Input
							type="search"
							placeholder={placeholder}
							className="h-8 rounded-sm shadow-none focus-visible:ring-0"
							value={searchTerm}
							onChange={handleSearchChange}
							onKeyDown={handleSearchInputKeyDown}
							ref={inputRef}
						/>
					</div>
				</form>
				<ScrollArea style={{ height: maxHeight }}>
					<div className="grid gap-1 p-1.5 text-sm">
						{filteredResults.length > 0 ? (
							filteredResults.map((result, index) => (
								<A
									href={result.url}
									key={result.id || result.url || result.title}
									id={`search-result-${index}`}
									className={`flex items-center gap-2 rounded-md p-2.5 outline-none text-foreground ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 ${
										focusedIndex === index ? 'bg-accent text-accent-foreground' : ''
									}`}
									onClick={() => handleResultSelect(result)}
									onKeyDown={(e) => handleResultKeyDown(e, index)}
									tabIndex={0}>
									<Icon name={result.icon_name || defaultIcon} className="w-4 h-4" />
									<div className="flex flex-col">
										<div className="font-medium">{result.title}</div>
										{result.subtitle && (
											<div className="text-xs text-muted-foreground">{result.subtitle}</div>
										)}
									</div>
								</A>
							))
						) : (
							<div className="flex items-center justify-center h-12 text-muted-foreground">
								No results found
							</div>
						)}
					</div>
				</ScrollArea>
			</>
		)
	}, [
		filteredResults,
		searchTerm,
		placeholder,
		handleSearchChange,
		handleSearchInputKeyDown,
		handleResultKeyDown,
		handleResultSelect,
		focusedIndex,
		defaultIcon,
	])

	const handleOpenChange = useCallback((open: boolean) => {
		setIsOpen(open)
		setFocusedIndex(0)
	}, [])

	const triggerStyles = `flex h-10 w-full min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 data-[state=open]:bg-accent data-[state=open]:text-primary ${triggerClassName}`

	if (isMobile) {
		return (
			<Drawer open={isOpen} onOpenChange={handleOpenChange}>
				<DrawerTrigger className={triggerStyles} onKeyDown={handleKeyDown} tabIndex={0}>
					<SearchIcon className="w-5 h-5 shrink-0" />
					<div className="flex flex-1 text-base overflow-hidden">
						<div className="pe-6 line-clamp-1">{triggerLabel}</div>
					</div>
				</DrawerTrigger>
				<DrawerContent>{SearchContent}</DrawerContent>
			</Drawer>
		)
	}

	return (
		<Popover open={isOpen} onOpenChange={handleOpenChange}>
			<PopoverTrigger className={triggerStyles} onKeyDown={handleKeyDown} tabIndex={0}>
				<SearchIcon className="w-5 h-5 shrink-0" />
				<div className="flex flex-1 text-base overflow-hidden">
					<div className="pe-6 line-clamp-1">{triggerLabel}</div>
				</div>
			</PopoverTrigger>
			<PopoverContent
				side={popoverSide}
				align={popoverAlign}
				sideOffset={sideOffset}
				className="p-0"
				style={{ width }}>
				{SearchContent}
			</PopoverContent>
		</Popover>
	)
}
