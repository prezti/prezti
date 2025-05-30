import type { ElementType } from '@/lib/types'
import {
	AlignCenter,
	AlignCenterHorizontal,
	AlignCenterVertical,
	AlignHorizontalDistributeEnd,
	AlignHorizontalDistributeStart,
	AlignLeft,
	AlignRight,
	AlignVerticalDistributeEnd,
	AlignVerticalDistributeStart,
	Copy,
	ImageIcon,
	List,
	Square,
	Trash2,
	Type,
} from 'lucide-react'

export interface ToolbarOption {
	id: string
	icon: typeof Type
	tooltip: string
	shortcut?: string
	action: string
	variant?: 'default' | 'ghost'
}

export interface ElementCreationOption extends ToolbarOption {
	elementType: ElementType['type']
}

export interface ElementAlignmentOption extends ToolbarOption {
	alignType:
		| 'slideLeft'
		| 'slideCenterHorizontal'
		| 'slideRight'
		| 'slideTop'
		| 'slideCenterVertical'
		| 'slideBottom'
}

export interface TextAlignmentOption extends ToolbarOption {
	alignType: 'left' | 'center' | 'right'
}

export const ELEMENT_CREATION_OPTIONS: ElementCreationOption[] = [
	{
		id: 'add-heading',
		icon: Type,
		tooltip: 'Add Heading (H)',
		shortcut: 'H',
		action: 'createElement',
		elementType: 'heading',
	},
	{
		id: 'add-paragraph',
		icon: AlignLeft,
		tooltip: 'Add Text (T)',
		shortcut: 'T',
		action: 'createElement',
		elementType: 'paragraph',
	},
	{
		id: 'add-list',
		icon: List,
		tooltip: 'Add List (L)',
		shortcut: 'L',
		action: 'createElement',
		elementType: 'bullet-list',
	},
	{
		id: 'add-image',
		icon: ImageIcon,
		tooltip: 'Add Image (I)',
		shortcut: 'I',
		action: 'createElement',
		elementType: 'image',
	},
	{
		id: 'add-shape',
		icon: Square,
		tooltip: 'Add Shape (S)',
		shortcut: 'S',
		action: 'createElement',
		elementType: 'rectangle',
	},
]

export const ELEMENT_OPERATIONS: ToolbarOption[] = [
	{
		id: 'duplicate',
		icon: Copy,
		tooltip: 'Duplicate (Ctrl+D)',
		shortcut: 'Ctrl+D',
		action: 'duplicate',
	},
	{
		id: 'delete',
		icon: Trash2,
		tooltip: 'Delete (Del)',
		shortcut: 'Del',
		action: 'delete',
	},
]

export const ELEMENT_ALIGNMENT_OPTIONS: ElementAlignmentOption[] = [
	{
		id: 'align-left',
		icon: AlignHorizontalDistributeStart,
		tooltip: 'Align Left Edge',
		action: 'alignElement',
		alignType: 'slideLeft',
	},
	{
		id: 'align-center-horizontal',
		icon: AlignCenterHorizontal,
		tooltip: 'Align Center Horizontally',
		action: 'alignElement',
		alignType: 'slideCenterHorizontal',
	},
	{
		id: 'align-right',
		icon: AlignHorizontalDistributeEnd,
		tooltip: 'Align Right Edge',
		action: 'alignElement',
		alignType: 'slideRight',
	},
	{
		id: 'align-top',
		icon: AlignVerticalDistributeStart,
		tooltip: 'Align Top Edge',
		action: 'alignElement',
		alignType: 'slideTop',
	},
	{
		id: 'align-center-vertical',
		icon: AlignCenterVertical,
		tooltip: 'Align Center Vertically',
		action: 'alignElement',
		alignType: 'slideCenterVertical',
	},
	{
		id: 'align-bottom',
		icon: AlignVerticalDistributeEnd,
		tooltip: 'Align Bottom Edge',
		action: 'alignElement',
		alignType: 'slideBottom',
	},
]

export const TEXT_ALIGNMENT_OPTIONS: TextAlignmentOption[] = [
	{
		id: 'text-align-left',
		icon: AlignLeft,
		tooltip: 'Align Left',
		action: 'alignText',
		alignType: 'left',
	},
	{
		id: 'text-align-center',
		icon: AlignCenter,
		tooltip: 'Align Center',
		action: 'alignText',
		alignType: 'center',
	},
	{
		id: 'text-align-right',
		icon: AlignRight,
		tooltip: 'Align Right',
		action: 'alignText',
		alignType: 'right',
	},
]

export const FONT_SIZE_OPTIONS = ['12px', '16px', '18px', '24px', '32px', '48px']

export const PREDEFINED_COLORS = [
	'#000000',
	'#434343',
	'#666666',
	'#999999',
	'#CCCCCC',
	'#FFFFFF',
	'#FFF2CC',
	'#FFE5CC',
	'#FFD9CC',
	'#E9D8E4',
	'#D9E8FF',
	'#D9EAD3',
	'#FFD966',
	'#F6B26B',
	'#E06666',
	'#8E7CC3',
	'#6FA8DC',
	'#93C47D',
	'#A89900',
	'#783F04',
	'#660000',
	'#540057',
	'#0B5394',
	'#274E13',
]

export const TEXT_ELEMENT_TYPES = ['heading', 'paragraph', 'bullet-list', 'numbered-list']
