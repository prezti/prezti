'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle, Layout, Palette, Sparkles, Type } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Step {
	id: string
	label: string
	icon: typeof Type
	completed: boolean
	progress: number
}

export function SlideCreationTool() {
	const [steps, setSteps] = useState<Step[]>([
		{
			id: '1',
			label: 'Analyzing content requirements',
			icon: Sparkles,
			completed: false,
			progress: 0,
		},
		{
			id: '2',
			label: 'Designing layout structure',
			icon: Layout,
			completed: false,
			progress: 0,
		},
		{
			id: '3',
			label: 'Applying visual styling',
			icon: Palette,
			completed: false,
			progress: 0,
		},
		{
			id: '4',
			label: 'Adding content elements',
			icon: Type,
			completed: false,
			progress: 0,
		},
	])

	const [currentStep, setCurrentStep] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setSteps((prevSteps) => {
				const newSteps = [...prevSteps]

				if (currentStep < newSteps.length) {
					const step = newSteps[currentStep]

					if (step.progress < 100) {
						step.progress += 20
					} else if (!step.completed) {
						step.completed = true
						setTimeout(() => setCurrentStep((prev) => prev + 1), 500)
					}
				}

				return newSteps
			})
		}, 300)

		if (currentStep >= steps.length) {
			clearInterval(interval)
		}

		return () => clearInterval(interval)
	}, [currentStep, steps.length])

	return (
		<div className="space-y-4">
			{/* Progress Steps */}
			<div className="space-y-3">
				{steps.map((step, index) => (
					<div
						key={step.id}
						className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
							index <= currentStep
								? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
								: 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
						}`}>
						<div
							className={`p-2 rounded-lg transition-all duration-300 ${
								step.completed
									? 'bg-green-500'
									: index === currentStep
									? 'bg-blue-500'
									: 'bg-slate-300 dark:bg-slate-600'
							}`}>
							{step.completed ? (
								<CheckCircle className="h-4 w-4 text-white" />
							) : (
								<step.icon className="h-4 w-4 text-white" />
							)}
						</div>
						<div className="flex-1">
							<p
								className={`text-sm font-medium ${
									index <= currentStep
										? 'text-slate-900 dark:text-slate-100'
										: 'text-slate-500 dark:text-slate-400'
								}`}>
								{step.label}
							</p>
							{index === currentStep && !step.completed && (
								<div className="mt-2">
									<div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1">
										<div
											className="bg-blue-500 h-1 rounded-full transition-all duration-300"
											style={{ width: `${step.progress}%` }}
										/>
									</div>
								</div>
							)}
						</div>
						{step.completed && (
							<Badge
								variant="secondary"
								className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
								Done
							</Badge>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
