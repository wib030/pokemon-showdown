// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

export const Formats: FormatList = [

	// S/V Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "Singles",
	},
	{
		name: "[Gen 4] OU",

		mod: 'gen4',
		ruleset: ['Standard', 'Sleep Moves Clause', 'Evasion Abilities Clause'],
		banlist: ['Uber', 'AG', 'Baton Pass'],
	},
	{
		name: "[Gen 4] OU Platinum Dex",

		mod: 'gen4',
		ruleset: ['Standard', 'Sleep Moves Clause', 'Evasion Abilities Clause', 'Sinnoh Pokedex'],
		banlist: ['Uber', 'AG', 'Baton Pass'],
	},
	{
		name: "[Gen 4] Random Battle",

		mod: 'gen4',
		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Evasion Moves Clause', 'Evasion Abilities Clause'],
	},
	{
		name: "[Gen 4] Ubers",

		mod: 'gen4',
		ruleset: ['Standard', 'Sleep Moves Clause', 'Evasion Abilities Clause'],
		banlist: ['AG', 'Baton Pass'],
	},
	{
		name: "[Gen 4] UU",

		mod: 'gen4',
		ruleset: ['[Gen 4] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 4] NU",

		mod: 'gen4',
		ruleset: ['[Gen 4] UU'],
		banlist: ['UU', 'NUBL'],
	},
	{
		name: "[Gen 4] LC",

		mod: 'gen4',
		ruleset: ['Little Cup', 'Standard', 'Sleep Moves Clause', 'Evasion Abilities Clause'],
		banlist: [
			'Baton Pass', 'Meditite', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma',
			'Berry Juice', 'Deep Sea Tooth', 'Dragon Rage', 'Sonic Boom', 'Swagger',
		],
	},
	{
		name: "[Gen 4] Monotype",

		mod: 'gen4',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Same Type Clause', 'Sleep Moves Clause'],
		banlist: ['Baton Pass'],
	},

	// S/V Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "Doubles",
	},
	{
		name: "[Gen 4] Random Doubles Battle",

		mod: 'gen4',
		gameType: 'doubles',
		team: 'random',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Evasion Moves Clause', 'Evasion Abilities Clause'],
	},
	{
		name: "[Gen 4] Doubles OU",

		mod: 'gen4',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'Sleep Moves Clause'],
		banlist: ['DUber', 'Baton Pass'],
	},
	{
		name: "[Gen 4] Doubles Ubers",

		mod: 'gen4',
		gameType: 'doubles',
		ruleset: ['Standard Doubles', 'Sleep Moves Clause'],
		banlist: ['Baton Pass'],
	},
	{
		name: "[Gen 4] Doubles UU",

		mod: 'gen4',
		gameType: 'doubles',
		ruleset: ['[Gen 4] Doubles OU'],
		banlist: ['DOU', 'DBL'],
	},
	{
		name: "[Gen 4] Doubles LC",

		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Standard Doubles', 'Little Cup', 'Sleep Moves Clause'],
		banlist: [
			'Baton Pass', 'Meditite', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma',
			'Berry Juice', 'Deep Sea Tooth', 'Dragon Rage', 'Sonic Boom', 'Swagger',
		],
	},

	// Draft League
	///////////////////////////////////////////////////////////////////

	{
		section: "Draft",
	},
	{
		name: "[Gen 4] Draft",

		mod: 'gen4',
		ruleset: ['Standard Draft', 'Min Source Gen = 4'],
	},
	{
		name: "[Gen 4] 6v6 Doubles Draft",

		mod: 'gen4',
		gameType: 'doubles',
		ruleset: ['Standard Draft', 'Min Source Gen = 4'],
	},
];
