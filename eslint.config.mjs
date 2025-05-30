module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@next/next/recommended',
		'prettier',
	],
	plugins: ['@typescript-eslint', 'react-hooks', 'eslint-plugin-react-compiler', 'unused-imports'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	rules: {
		'react-compiler/react-compiler': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'no-console': 'off',
		'no-debugger': 'off',
		'react-hooks/rules-of-hooks': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'no-case-declarations': 'warn',
		'no-empty-pattern': 'warn',
		'@typescript-eslint/ban-types': [
			'warn',
			{
				types: {
					'{}': false,
				},
			},
		],
		'@typescript-eslint/no-var-requires': 'off',
		'prefer-const': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
	},
	settings: {
		'prettier/prettier': require('./.prettierrc.js'),
	},
}
