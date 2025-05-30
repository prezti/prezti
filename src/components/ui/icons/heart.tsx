type HeartProps = {
	isLiked: boolean
	handleHeartClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const BUTTON_SIZE = 30
const HEART_SIZE = BUTTON_SIZE * 2
const SPRITE_SCALE = HEART_SIZE / 100
const TOTAL_SPRITE_FRAMES = 28
const TOTAL_WIDTH = 100 * TOTAL_SPRITE_FRAMES * SPRITE_SCALE + HEART_SIZE

export function Heart({ isLiked, handleHeartClick }: HeartProps) {
	const heartStyle = {
		transition: 'background-position 1s steps(28)',
		transitionDuration: isLiked ? '1s' : '0s',
		backgroundPosition: isLiked
			? `${-TOTAL_WIDTH + HEART_SIZE}px 0`
			: '0 0',
		backgroundSize: `${TOTAL_WIDTH}px ${HEART_SIZE}px`,
		height: `${HEART_SIZE}px`,
		width: `${HEART_SIZE}px`,
	}
	const buttonStyle = {
		height: `${BUTTON_SIZE}px`,
		width: `${BUTTON_SIZE}px`,
	}
	return (
		<button
			className={`relative flex items-center justify-center overflow-visible`}
			onClick={handleHeartClick}
			style={buttonStyle}
		>
			<div
				className='absolute overflow-visible cursor-pointer pointer-events-none heart'
				style={heartStyle}
			></div>
		</button>
	)
}
