import { motion, type MotionProps } from 'framer-motion'

type MotionUlProps = MotionProps & React.HTMLAttributes<HTMLUListElement>
type MotionLiProps = MotionProps & React.HTMLAttributes<HTMLLIElement>

type MotionDivProps = MotionProps &
	React.HTMLAttributes<HTMLDivElement> & {
		ref?: React.RefObject<HTMLDivElement>
	}
export const MotionDiv = motion.div as React.FC<MotionDivProps>
export const MotionUl = motion.ul as React.FC<MotionUlProps>
export const MotionLi = motion.li as React.FC<MotionLiProps>
