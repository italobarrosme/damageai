export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'fix',
				'feat',
				'perf',
				'docs',
				'style',
				'refactor',
				'test',
				'chore',
				'build',
				'ci',
				'revert',
			],
		],
		'subject-case': [2, 'always', 'lower-case'],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
	},
};

