export const Routes = {
	home: () => '/',
	app: () => '/app',
	slides: (id?: string) => (id ? `/slides/${id}` : '/slides'),
} as const

export type RoutePaths = ReturnType<(typeof Routes)[keyof typeof Routes]>
