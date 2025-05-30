import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config, { isServer }) => {
		// Exclude "canvas" and related modules from server-side bundling
		config.resolve.fallback = {
			...config.resolve.fallback,
			canvas: false,
			fs: false,
			path: false,
			os: false,
		}

		// Mark canvas module and pptxgenjs as external (not required)
		config.externals = [...(config.externals || []), 'canvas']

		// Handle Node.js modules for client-side
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				path: false,
				os: false,
				crypto: false,
				stream: false,
				buffer: false,
				util: false,
				url: false,
				querystring: false,
				'node:fs': false,
				'node:fs/promises': false,
				'node:https': false,
				'node:http': false,
				'node:path': false,
				'node:url': false,
			}

			// Exclude pptxgenjs from client bundle
			config.externals = [...(config.externals || []), 'pptxgenjs']
		}

		return config
	},
	// Transpile packages that might have issues
	transpilePackages: [],
}

export default nextConfig
