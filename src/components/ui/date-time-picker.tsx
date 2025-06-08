import { Button, buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { add, format } from 'date-fns'
import { type Locale, enUS } from 'date-fns/locale'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { useImperativeHandle, useRef } from 'react'
import { DayPicker, DayPickerProps } from 'react-day-picker'
import { DEFAULT_TIME_PICKER_CONFIG, TimePicker, TimePickerConfig } from './time-picker'

// ---------- utils start ----------
function genMonths(locale: Pick<Locale, 'options' | 'localize' | 'formatLong'>) {
	return Array.from({ length: 12 }, (_, i) => ({
		value: i,
		label: format(new Date(2021, i), 'MMMM', { locale }),
	}))
}

function genYears(yearRange = 50) {
	const today = new Date()
	return Array.from({ length: yearRange * 2 + 1 }, (_, i) => ({
		value: today.getFullYear() - yearRange + i,
		label: (today.getFullYear() - yearRange + i).toString(),
	}))
}

// ---------- utils end ----------

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	yearRange = 50,
	...props
}: DayPickerProps & { yearRange?: number }) {
	const MONTHS = React.useMemo(() => {
		let locale: Pick<Locale, 'options' | 'localize' | 'formatLong'> = enUS
		const { options, localize, formatLong } = props.locale || {}
		if (options && localize && formatLong) {
			locale = {
				options,
				localize,
				formatLong,
			}
		}
		return genMonths(locale)
	}, [])

	const YEARS = React.useMemo(() => genYears(yearRange), [])
	const disableLeftNavigation = () => {
		const today = new Date()
		const startDate = new Date(today.getFullYear() - yearRange, 0, 1)
		if (props.month) {
			return (
				props.month.getMonth() === startDate.getMonth() &&
				props.month.getFullYear() === startDate.getFullYear()
			)
		}
		return false
	}
	const disableRightNavigation = () => {
		const today = new Date()
		const endDate = new Date(today.getFullYear() + yearRange, 11, 31)
		if (props.month) {
			return (
				props.month.getMonth() === endDate.getMonth() &&
				props.month.getFullYear() === endDate.getFullYear()
			)
		}
		return false
	}

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4  sm:space-y-0 justify-center',
				month: 'flex flex-col items-center space-y-4',
				month_caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'text-sm font-medium',
				nav: 'space-x-1 flex items-center ',
				button_previous: cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-5 top-5',
					disableLeftNavigation() && 'pointer-events-none'
				),
				button_next: cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-5 top-5',
					disableRightNavigation() && 'pointer-events-none'
				),
				month_grid: 'w-full border-collapse space-y-1',
				weekdays: cn('flex', props.showWeekNumber && 'justify-end'),
				weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
				week: 'flex w-full mt-2',
				day: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 rounded-1',
				day_button: cn(
					buttonVariants({ variant: 'ghost' }),
					'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-l-md rounded-r-md'
				),
				range_end: 'day-range-end',
				selected:
					'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-l-md rounded-r-md',
				today: 'bg-accent text-accent-foreground',
				outside:
					'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
				disabled: 'text-muted-foreground opacity-50',
				range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
				hidden: 'invisible',
				...classNames,
			}}
			components={{
				Chevron: ({ ...props }) =>
					props.orientation === 'left' ? (
						<ChevronLeft className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					),
				MonthCaption: ({ calendarMonth }) => {
					return (
						<div className="inline-flex gap-2">
							<Select
								defaultValue={calendarMonth.date.getMonth().toString()}
								onValueChange={(value) => {
									const newDate = new Date(calendarMonth.date)
									newDate.setMonth(Number.parseInt(value, 10))
									props.onMonthChange?.(newDate)
								}}>
								<SelectTrigger className="focus:bg-accent focus:text-accent-foreground w-fit gap-1 border-none p-0">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{MONTHS.map((month) => (
										<SelectItem key={month.value} value={month.value.toString()}>
											{month.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								defaultValue={calendarMonth.date.getFullYear().toString()}
								onValueChange={(value) => {
									const newDate = new Date(calendarMonth.date)
									newDate.setFullYear(Number.parseInt(value, 10))
									props.onMonthChange?.(newDate)
								}}>
								<SelectTrigger className="focus:bg-accent focus:text-accent-foreground w-fit gap-1 border-none p-0">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{YEARS.map((year) => (
										<SelectItem
											key={year.value}
											value={year.value.toString()}
											disabled={Boolean(
												(props.fromYear && year.value < props.fromYear) ||
													(props.toYear && year.value > props.toYear)
											)}>
											{year.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)
				},
			}}
			{...props}
		/>
	)
}
Calendar.displayName = 'Calendar'

type Granularity = 'day' | 'hour' | 'minute' | 'second'

// ---------- DateTimePickerConfig Start ----------
export type DateTimePickerConfigType = {
	allowTimeSelection: boolean
	timePickerConfig: Partial<TimePickerConfig>
	restrictions: Pick<
		DayPickerProps,
		'disabled' | 'fromDate' | 'toDate' | 'fromMonth' | 'toMonth' | 'fromYear' | 'toYear'
		// TODO: Add other DayPickerProps like `selected`, `onSelect` if needed for controlled selection from config
	>
	yearRange?: number // Keep yearRange for now, can be part of restrictions.fromYear/toYear
}

export const DEFAULT_DATE_TIME_PICKER_CONFIG: DateTimePickerConfigType = {
	allowTimeSelection: true,
	timePickerConfig: {
		...DEFAULT_TIME_PICKER_CONFIG, // Inherits allowSeconds: false
	},
	restrictions: {},
	yearRange: 50,
}
// ---------- DateTimePickerConfig End ----------

type DateTimePickerProps = {
	value?: Date
	onChange?: (date: Date | undefined) => void
	onMonthChange?: (date: Date | undefined) => void
	disabled?: boolean
	placeholder?: string
	/**
	 * The year range will be: `This year + yearRange` and `this year - yearRange`.
	 * Default is 50.
	 * For example:
	 * This year is 2024, The year dropdown will be 1974 to 2024 which is generated by `2024 - 50 = 1974` and `2024 + 50 = 2074`.
	 * */
	yearRange?: number
	/**
	 * The format is derived from the `date-fns` documentation.
	 * @reference https://date-fns.org/v3.6.0/docs/format
	 **/
	displayFormat?: { hour24?: string; hour12?: string }
	/**
	 * The granularity prop allows you to control the smallest unit that is displayed by DateTimePicker.
	 * By default, the value is `second` which shows all time inputs.
	 **/
	granularity?: Granularity
	className?: string
	/**
	 * Show the default month and time when popup the calendar. Default is the current Date().
	 **/
	defaultPopupValue?: Date
	config?: Partial<DateTimePickerConfigType>
	withTrigger?: boolean // New prop to control whether to render with a trigger or directly
} & Pick<DayPickerProps, 'locale' | 'weekStartsOn' | 'showWeekNumber' | 'showOutsideDays'>

type DateTimePickerRef = {
	value?: Date
} & Omit<HTMLButtonElement, 'value'>

// Create a component for the calendar and time picker content, to be used both in the popover and directly
function DateTimePickerContent({
	month,
	setMonth,
	displayDate,
	onChange,
	effectiveOnMonthChange,
	config,
	granularity,
	onSelect,
	locale,
	...props
}: {
	month: Date
	setMonth: (date: Date) => void
	displayDate: Date | undefined
	onChange?: (date: Date | undefined) => void
	effectiveOnMonthChange?: (date: Date | undefined) => void
	config: DateTimePickerConfigType
	granularity: Granularity
	onSelect: (date?: Date) => void
	locale: Locale
} & Pick<DayPickerProps, 'weekStartsOn' | 'showWeekNumber' | 'showOutsideDays'>) {
	// Determine if the time picker should be rendered
	const shouldShowTimePicker = config.allowTimeSelection && granularity !== 'day'

	return (
		<div className="w-auto p-0">
			<Calendar
				mode="single"
				selected={displayDate}
				month={month}
				onSelect={(newDate) => {
					if (newDate) {
						const currentHours = config.allowTimeSelection ? month?.getHours() ?? 0 : 0
						const currentMinutes = config.allowTimeSelection ? month?.getMinutes() ?? 0 : 0
						const currentSeconds =
							config.allowTimeSelection && config.timePickerConfig.allowSeconds
								? month?.getSeconds() ?? 0
								: 0

						newDate.setHours(currentHours, currentMinutes, currentSeconds)
						onSelect(newDate)
					}
				}}
				onMonthChange={(date) => {
					if (date) setMonth(date)
					effectiveOnMonthChange?.(date)
				}}
				yearRange={config.yearRange}
				locale={locale}
				{...props}
				{...config.restrictions}
			/>
			{shouldShowTimePicker && (
				<div className="border-border border-t p-3">
					<TimePicker
						date={month}
						setDate={(newDate) => {
							if (newDate) {
								const updatedDate = new Date(month || new Date())
								updatedDate.setHours(newDate.getHours())
								updatedDate.setMinutes(newDate.getMinutes())
								updatedDate.setSeconds(config.timePickerConfig.allowSeconds ? newDate.getSeconds() : 0)
								updatedDate.setMilliseconds(newDate.getMilliseconds())

								onChange?.(updatedDate)
								setMonth(updatedDate)
							} else {
								const dateWithoutTime = new Date(month)
								dateWithoutTime.setHours(0, 0, 0, 0)
								onChange?.(dateWithoutTime)
								setMonth(dateWithoutTime)
							}
						}}
						config={config.timePickerConfig}
						showAddButton={false}
					/>
				</div>
			)}
		</div>
	)
}

const DateTimePicker = React.forwardRef<Partial<DateTimePickerRef>, DateTimePickerProps>(
	(
		{
			locale = enUS,
			defaultPopupValue = new Date(new Date().setHours(0, 0, 0, 0)),
			value,
			onChange,
			onMonthChange,
			disabled,
			displayFormat,
			granularity = 'second',
			placeholder = 'Pick a date',
			className,
			config: userConfig,
			withTrigger = false, // Default to rendering without trigger
			...props
		},
		ref
	) => {
		const config = { ...DEFAULT_DATE_TIME_PICKER_CONFIG, ...userConfig }
		config.timePickerConfig = {
			...DEFAULT_TIME_PICKER_CONFIG,
			...userConfig?.timePickerConfig,
		}
		config.restrictions = {
			...DEFAULT_DATE_TIME_PICKER_CONFIG.restrictions,
			...userConfig?.restrictions,
		}

		const [month, setMonth] = React.useState<Date>(value ?? defaultPopupValue)
		const buttonRef = useRef<HTMLButtonElement>(null)
		const [displayDate, setDisplayDate] = React.useState<Date | undefined>(value ?? undefined)
		const [isOpen, setIsOpen] = React.useState(false)

		const effectiveOnMonthChange = onMonthChange || onChange

		React.useEffect(() => {
			setDisplayDate(value)
		}, [value])

		const handleMonthChange = (newDay: Date | undefined) => {
			if (!newDay) {
				return
			}
			if (!defaultPopupValue) {
				newDay.setHours(month?.getHours() ?? 0, month?.getMinutes() ?? 0, month?.getSeconds() ?? 0)
				effectiveOnMonthChange?.(newDay)
				setMonth(newDay)
				return
			}
			const diff = newDay.getTime() - defaultPopupValue.getTime()
			const diffInDays = diff / (1000 * 60 * 60 * 24)
			const newDateFull = add(defaultPopupValue, {
				days: Math.ceil(diffInDays),
			})
			newDateFull.setHours(month?.getHours() ?? 0, month?.getMinutes() ?? 0, month?.getSeconds() ?? 0)
			effectiveOnMonthChange?.(newDateFull)
			setMonth(newDateFull)
		}

		const onSelect = (newDay?: Date) => {
			if (!newDay) {
				return
			}
			if (!config.allowTimeSelection) {
				newDay.setHours(0, 0, 0, 0)
			}
			onChange?.(newDay)
			setMonth(newDay)
			setDisplayDate(newDay)

			// Close the popover if we're in withTrigger mode after selection
			if (withTrigger) {
				setIsOpen(false)
			}
		}

		useImperativeHandle(ref, () => ({ ...buttonRef.current, value: displayDate }), [displayDate])

		const showSecondsInFormat =
			config.allowTimeSelection && granularity === 'second' && config.timePickerConfig.allowSeconds

		const initHourFormat = {
			hour24: displayFormat?.hour24 ?? `PPP HH:mm${showSecondsInFormat ? ':ss' : ''}`,
			hour12: displayFormat?.hour12 ?? `PP hh:mm${showSecondsInFormat ? ':ss' : ''} b`,
		}
		if (!config.allowTimeSelection) {
			initHourFormat.hour24 = displayFormat?.hour24 || 'PPP'
			initHourFormat.hour12 = displayFormat?.hour12 || 'PPP'
		}

		let loc = enUS
		const { options, localize, formatLong } = locale
		if (options && localize && formatLong) {
			loc = {
				...enUS,
				options,
				localize,
				formatLong,
			}
		}

		// Extract common content props
		const contentProps = {
			month,
			setMonth,
			displayDate,
			onChange,
			effectiveOnMonthChange,
			config,
			granularity,
			onSelect,
			locale: loc,
			...props,
		}

		// If withTrigger is false, render the calendar directly without the Popover wrapper
		if (!withTrigger) {
			return (
				<div className={cn('date-time-picker-direct', className)}>
					<DateTimePickerContent {...contentProps} />
				</div>
			)
		}

		// Otherwise, render with the trigger button and popover
		return (
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger
					asChild
					disabled={
						typeof config.restrictions.disabled === 'boolean'
							? config.restrictions.disabled
							: disabled ?? false
					}>
					<Button
						variant="outline"
						className={cn(
							'w-full justify-start text-left font-normal',
							!displayDate && 'text-muted-foreground',
							className
						)}
						ref={buttonRef}>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{displayDate ? (
							format(
								displayDate,
								displayFormat?.hour24 && !displayFormat.hour12 && config.allowTimeSelection
									? initHourFormat.hour24
									: initHourFormat.hour12,
								{
									locale: loc,
								}
							)
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<DateTimePickerContent {...contentProps} />
				</PopoverContent>
			</Popover>
		)
	}
)

DateTimePicker.displayName = 'DateTimePicker'

export { DateTimePicker }
export type { DateTimePickerProps, DateTimePickerRef }
