import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select'
import { cn } from '@/lib/utils'
import React, { useEffect, useMemo } from 'react'

// Time picker types and utilities
export type TimePickerType = 'minutes' | 'seconds' | 'hours' | '12hours'
export type Period = 'AM' | 'PM'

// ---------- Config Start ----------
export type TimePickerConfig = {
	allowSeconds: boolean
}

export const DEFAULT_TIME_PICKER_CONFIG: TimePickerConfig = {
	allowSeconds: false,
}
// ---------- Config End ----------

export function isValidHour(value: string) {
	return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value)
}

export function isValid12Hour(value: string) {
	return /^(0[1-9]|1[0-2])$/.test(value)
}

export function isValidMinuteOrSecond(value: string) {
	return /^[0-5][0-9]$/.test(value)
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean }

export function getValidNumber(
	value: string,
	{ max, min = 0, loop = false }: GetValidNumberConfig,
) {
	let numericValue = parseInt(value, 10)

	if (!isNaN(numericValue)) {
		if (!loop) {
			if (numericValue > max) numericValue = max
			if (numericValue < min) numericValue = min
		} else {
			if (numericValue > max) numericValue = min
			if (numericValue < min) numericValue = max
		}
		return numericValue.toString().padStart(2, '0')
	}

	return '00'
}

export function getValidHour(value: string) {
	if (isValidHour(value)) return value
	return getValidNumber(value, { max: 23 })
}

export function getValid12Hour(value: string) {
	if (isValid12Hour(value)) return value
	return getValidNumber(value, { min: 1, max: 12 })
}

export function getValidMinuteOrSecond(value: string) {
	if (isValidMinuteOrSecond(value)) return value
	return getValidNumber(value, { max: 59 })
}

type GetValidArrowNumberConfig = {
	min: number
	max: number
	step: number
}

export function getValidArrowNumber(
	value: string,
	{ min, max, step }: GetValidArrowNumberConfig,
) {
	let numericValue = parseInt(value, 10)
	if (!isNaN(numericValue)) {
		numericValue += step
		return getValidNumber(String(numericValue), { min, max, loop: true })
	}
	return '00'
}

export function getValidArrowHour(value: string, step: number) {
	return getValidArrowNumber(value, { min: 0, max: 23, step })
}

export function getValidArrow12Hour(value: string, step: number) {
	return getValidArrowNumber(value, { min: 1, max: 12, step })
}

export function getValidArrowMinuteOrSecond(value: string, step: number) {
	return getValidArrowNumber(value, { min: 0, max: 59, step })
}

export function setHours(date: Date, value: string) {
	const hours = getValidHour(value)
	date.setHours(parseInt(hours, 10))
	return date
}

export function setSeconds(date: Date, value: string) {
	const seconds = getValidMinuteOrSecond(value)
	date.setSeconds(parseInt(seconds, 10))
	return date
}

export function setMinutes(date: Date, value: string) {
	const minutes = getValidMinuteOrSecond(value)
	date.setMinutes(parseInt(minutes, 10))
	return date
}

export function set12Hours(date: Date, value: string, period: Period) {
	const hours = parseInt(getValid12Hour(value), 10)
	const convertedHours = convert12HourTo24Hour(hours, period)
	date.setHours(convertedHours)
	return date
}

export function setDateByType(
	date: Date,
	value: string,
	type: TimePickerType,
	period?: Period,
) {
	switch (type) {
		case 'minutes':
			return setMinutes(date, value)
		case 'seconds':
			return setSeconds(date, value)
		case 'hours':
			return setHours(date, value)
		case '12hours': {
			if (!period) return date
			return set12Hours(date, value, period)
		}
		default:
			return date
	}
}

export function getDateByType(date: Date, type: TimePickerType) {
	switch (type) {
		case 'minutes':
			return getValidMinuteOrSecond(String(date.getMinutes()))
		case 'seconds':
			return getValidMinuteOrSecond(String(date.getSeconds()))
		case 'hours':
			return getValidHour(String(date.getHours()))
		case '12hours':
			const hours = display12HourValue(date.getHours())
			return getValid12Hour(String(hours))
		default:
			return '00'
	}
}

export function getArrowByType(
	value: string,
	step: number,
	type: TimePickerType,
) {
	switch (type) {
		case 'minutes':
			return getValidArrowMinuteOrSecond(value, step)
		case 'seconds':
			return getValidArrowMinuteOrSecond(value, step)
		case 'hours':
			return getValidArrowHour(value, step)
		case '12hours':
			return getValidArrow12Hour(value, step)
		default:
			return '00'
	}
}

export function convert12HourTo24Hour(hour: number, period: Period) {
	if (period === 'PM') {
		if (hour < 12) {
			return hour + 12
		}
		return hour
	} else if (period === 'AM') {
		if (hour === 12) return 0
		return hour
	}
	return hour
}

export function display12HourValue(hours: number) {
	if (hours === 0 || hours === 12) return '12'
	if (hours >= 13) return `${hours - 12}`
	return `${hours}`
}

export function getPeriod(hours: number): Period {
	return hours >= 12 ? 'PM' : 'AM'
}

// TimePickerInput Component
export interface TimePickerInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	picker: TimePickerType
	date: Date | undefined
	setDate: (date: Date | undefined) => void
	period?: Period
	onRightFocus?: () => void
	onLeftFocus?: () => void
}

export const TimePickerInput = React.forwardRef<
	HTMLInputElement,
	TimePickerInputProps
>(
	(
		{
			className,
			type = 'tel',
			value,
			id,
			name,
			date = new Date(new Date().setHours(0, 0, 0, 0)),
			setDate,
			onChange,
			onKeyDown,
			picker,
			period,
			onLeftFocus,
			onRightFocus,
			...props
		},
		ref,
	) => {
		const [flag, setFlag] = React.useState<boolean>(false)
		const [prevIntKey, setPrevIntKey] = React.useState<string>('0')

		React.useEffect(() => {
			if (flag) {
				const timer = setTimeout(() => {
					setFlag(false)
				}, 2000)

				return () => clearTimeout(timer)
			}
		}, [flag])

		const calculatedValue = React.useMemo(() => {
			if (!date) return '00'
			return getDateByType(date, picker)
		}, [date, picker])

		const calculateNewValue = (key: string) => {
			if (picker === '12hours') {
				if (
					flag &&
					calculatedValue.slice(1, 2) === '1' &&
					prevIntKey === '0'
				)
					return '0' + key
			}

			return !flag ? '0' + key : calculatedValue.slice(1, 2) + key
		}

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Tab') return
			e.preventDefault()
			if (e.key === 'ArrowRight') onRightFocus?.()
			if (e.key === 'ArrowLeft') onLeftFocus?.()
			if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
				const step = e.key === 'ArrowUp' ? 1 : -1
				const newValue = getArrowByType(calculatedValue, step, picker)
				if (flag) setFlag(false)
				if (!date) return
				const tempDate = new Date(date)
				setDate(setDateByType(tempDate, newValue, picker, period))
			}
			if (e.key >= '0' && e.key <= '9') {
				if (picker === '12hours') setPrevIntKey(e.key)

				const newValue = calculateNewValue(e.key)
				if (flag) onRightFocus?.()
				setFlag((prev) => !prev)
				if (!date) return
				const tempDate = new Date(date)
				setDate(setDateByType(tempDate, newValue, picker, period))
			}
		}

		return (
			<Input
				ref={ref}
				id={id || picker}
				name={name || picker}
				className={cn(
					'w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none',
					className,
				)}
				value={value || calculatedValue}
				onChange={(e) => {
					e.preventDefault()
					onChange?.(e)
				}}
				type={type}
				inputMode='decimal'
				onKeyDown={(e) => {
					onKeyDown?.(e)
					handleKeyDown(e)
				}}
				{...props}
			/>
		)
	},
)

TimePickerInput.displayName = 'TimePickerInput'

// TimePeriodSelect Component
export interface PeriodSelectorProps {
	period: Period
	setPeriod: (m: Period) => void
	date: Date | undefined
	setDate: (date: Date | undefined) => void
	onRightFocus?: () => void
	onLeftFocus?: () => void
}

export const TimePeriodSelect = React.forwardRef<
	HTMLButtonElement,
	PeriodSelectorProps
>(({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus }, ref) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (e.key === 'ArrowRight') onRightFocus?.()
		if (e.key === 'ArrowLeft') onLeftFocus?.()
	}

	const handleValueChange = (value: Period) => {
		setPeriod(value)

		if (date) {
			const tempDate = new Date(date)
			const hours = display12HourValue(date.getHours())
			setDate(setDateByType(tempDate, hours.toString(), '12hours', value))
		}
	}

	return (
		<div className='flex h-10 items-center'>
			<Select
				value={period}
				onValueChange={(value: Period) => handleValueChange(value)}
			>
				<SelectTrigger
					ref={ref}
					className='w-[65px] focus:bg-accent focus:text-accent-foreground'
					onKeyDown={handleKeyDown}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='AM'>AM</SelectItem>
					<SelectItem value='PM'>PM</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
})

TimePeriodSelect.displayName = 'TimePeriodSelect'

// TimePicker Component
interface TimePickerProps {
	date: Date | undefined
	setDate: (date: Date | undefined) => void
	showAddButton?: boolean
	config?: Partial<TimePickerConfig>
}

export function TimePicker({
	date,
	setDate,
	showAddButton = false,
	config,
}: TimePickerProps) {
	const effectiveConfig = { ...DEFAULT_TIME_PICKER_CONFIG, ...config }
	const defaultDate = date || new Date()
	const [period, setPeriod] = React.useState<Period>(
		getPeriod(defaultDate.getHours()),
	)

	// Check if time is effectively midnight (00:00:00) or undefined
	const isEffectivelyMidnight = React.useMemo(() => {
		if (!date) return true
		return (
			date.getHours() === 0 &&
			date.getMinutes() === 0 &&
			date.getSeconds() === 0
		)
	}, [date])

	const [showPicker, setShowPicker] = React.useState(
		!showAddButton || !isEffectivelyMidnight,
	)

	// Get current values
	const hour = useMemo(() => {
		if (!date) return '12'
		const displayHour = display12HourValue(date.getHours())
		// We need to return the raw number for proper matching in the select
		return displayHour
	}, [date])

	const minute = useMemo(() => {
		if (!date) return '00'
		return date.getMinutes().toString().padStart(2, '0')
	}, [date])

	const second = useMemo(() => {
		if (!date) return '00'
		return date.getSeconds().toString().padStart(2, '0')
	}, [date])

	useEffect(() => {
		if (date) {
			setPeriod(getPeriod(date.getHours()))
			if (showAddButton) {
				setShowPicker(
					date.getHours() !== 0 ||
						date.getMinutes() !== 0 ||
						date.getSeconds() !== 0,
				)
			}
		} else if (showAddButton) {
			setShowPicker(false)
		}
	}, [date, showAddButton])

	const handleHourChange = (value: string) => {
		if (!date) {
			const newDate = new Date()
			newDate.setHours(
				convert12HourTo24Hour(parseInt(value), period),
				0,
				0,
				0,
			)
			setDate(newDate)
			return
		}

		const newDate = new Date(date)
		newDate.setHours(
			convert12HourTo24Hour(parseInt(value), period),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds(),
		)
		setDate(newDate)
	}

	const handleMinuteChange = (value: string) => {
		if (!date) {
			const newDate = new Date()
			newDate.setMinutes(parseInt(value))
			setDate(newDate)
			return
		}

		const newDate = new Date(date)
		newDate.setMinutes(parseInt(value))
		setDate(newDate)
	}

	const handleSecondChange = (value: string) => {
		if (!date) {
			const newDate = new Date()
			newDate.setSeconds(parseInt(value))
			setDate(newDate)
			return
		}

		const newDate = new Date(date)
		newDate.setSeconds(parseInt(value))
		setDate(newDate)
	}

	const handlePeriodChange = (value: Period) => {
		setPeriod(value)

		if (!date) {
			const newDate = new Date()
			const h = newDate.getHours() % 12 || 12
			newDate.setHours(
				value === 'AM' ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12,
			)
			setDate(newDate)
			return
		}

		const newDate = new Date(date)
		const h = newDate.getHours() % 12 || 12
		newDate.setHours(
			value === 'AM' ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12,
		)
		setDate(newDate)
	}

	const handleAddTime = () => {
		// Set current time
		const now = new Date()
		// Round to nearest 15 minutes for better UX
		const minutes = Math.round(now.getMinutes() / 15) * 15
		now.setMinutes(minutes, 0, 0)
		setDate(now)
		setShowPicker(true)
	}

	// Generate options - using 1-12 without padding for hours
	const hours = Array.from({ length: 12 }, (_, i) => String(i + 1))
	const minutes = Array.from({ length: 60 }, (_, i) =>
		i.toString().padStart(2, '0'),
	)
	const seconds = Array.from({ length: 60 }, (_, i) =>
		i.toString().padStart(2, '0'),
	)

	if (showAddButton && !showPicker) {
		return (
			<Button
				variant='outline'
				size='sm'
				className='text-muted-foreground'
				onClick={handleAddTime}
			>
				+ Add Time
			</Button>
		)
	}

	return (
		<div className='flex items-center justify-center gap-2'>
			<div className='grid gap-1 text-center'>
				<Label
					htmlFor='hours'
					className='text-xs text-muted-foreground'
				>
					Hours
				</Label>
				<Select value={hour} onValueChange={handleHourChange}>
					<SelectTrigger className='w-[62px] px-2 py-1.5'>
						<SelectValue placeholder='--' />
					</SelectTrigger>
					<SelectContent>
						{hours.map((hour) => (
							<SelectItem key={hour} value={hour}>
								{hour}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='mt-auto mb-[9px] text-center text-xl font-medium text-muted-foreground'>
				:
			</div>

			<div className='grid gap-1 text-center'>
				<Label
					htmlFor='minutes'
					className='text-xs text-muted-foreground'
				>
					Minutes
				</Label>
				<Select value={minute} onValueChange={handleMinuteChange}>
					<SelectTrigger className='w-[62px] px-2 py-1.5'>
						<SelectValue placeholder='--' />
					</SelectTrigger>
					<SelectContent className='max-h-[200px]'>
						{minutes.map((minute) => (
							<SelectItem key={minute} value={minute}>
								{minute}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{effectiveConfig.allowSeconds && (
				<>
					<div className='mt-auto mb-[9px] text-center text-xl font-medium text-muted-foreground'>
						:
					</div>
					<div className='grid gap-1 text-center'>
						<Label
							htmlFor='seconds'
							className='text-xs text-muted-foreground'
						>
							Seconds
						</Label>
						<Select
							value={second}
							onValueChange={handleSecondChange}
						>
							<SelectTrigger className='w-[62px] px-2 py-1.5'>
								<SelectValue placeholder='--' />
							</SelectTrigger>
							<SelectContent className='max-h-[200px]'>
								{seconds.map((second) => (
									<SelectItem key={second} value={second}>
										{second}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</>
			)}

			<div className='grid gap-1 text-center'>
				<Label
					htmlFor='period'
					className='text-xs text-muted-foreground'
				>
					Period
				</Label>
				<Select value={period} onValueChange={handlePeriodChange}>
					<SelectTrigger className='w-[62px] px-2 py-1.5'>
						<SelectValue placeholder='--' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='AM'>AM</SelectItem>
						<SelectItem value='PM'>PM</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
