// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
	{
		section: "FPT LC",
		column: 4,
	},
	{
		name: "[Gen 4] LC Uber",
		mod: 'gen4',
		ruleset: ['Standard', 'Little Cup', 'Evasion Abilities Clause', 'Sleep Moves Clause', 'Team Preview'],
		banlist: [
			'Berry Juice', 'Dragon Rage', 'Sonic Boom', 'Swagger',
		],
	},
	{
		name: "[Gen 4] LC",
		mod: 'gen4',
		ruleset: ['Standard', 'Little Cup', 'Evasion Abilities Clause', 'Sleep Moves Clause', 'Team Preview'],
		banlist: [
			'LC Uber', 'Deep Sea Tooth', 'Berry Juice', 'Dragon Rage', 'Sonic Boom', 'Swagger',
		],
	},
];