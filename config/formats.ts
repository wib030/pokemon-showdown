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

export const Formats: import('../sim/dex-formats').FormatList = [

	// FPT Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "FPT Singles",
		column: 4,
	},
	{
		name: "[Gen 4] Random Battle",
		mod: 'gen4',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 4] Ubers",
		mod: 'gen4',
		ruleset: ['Standard', 'Team Preview'],
		banlist: ['AG'],
	},
	{
		name: "[Gen 4] OU",
		mod: 'gen4',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Baton Pass Stat Trap Clause', 'Freeze Clause Mod', 'Team Preview'],
		banlist: ['AG', 'Uber', 'Arena Trap', 'Quick Claw', 'Soul Dew', 'Swagger'],
	},
	{
		name: "[Gen 4] UU",
		mod: 'gen4',
		ruleset: ['[Gen 4] OU', '!Baton Pass Stat Trap Clause', '!Freeze Clause Mod'],
		banlist: ['OU', 'UUBL', 'Baton Pass'],
		unbanlist: ['Arena Trap', 'Snow Cloak', 'Quick Claw', 'Swagger'],
	},
	{
		name: "[Gen 4] NU",
		mod: 'gen4',
		ruleset: ['[Gen 4] UU', 'Baton Pass Clause'],
		banlist: ['UU', 'NUBL'],
		unbanlist: ['Sand Veil', 'Baton Pass'],
	},
	{
		name: "[Gen 4] LC",
		mod: 'gen4',
		ruleset: ['Standard', 'Little Cup', 'Evasion Abilities Clause', 'Sleep Moves Clause', 'Team Preview'],
		banlist: [
			'Meditite', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma',
			'Berry Juice', 'Deep Sea Tooth', 'Dragon Rage', 'Sonic Boom', 'Swagger',
		],
	},
	{
		name: "[Gen 4] Anything Goes",
		mod: 'gen4',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 4] Draft",
		mod: 'gen4',
		searchShow: false,
		ruleset: ['Standard Draft', 'Swagger Clause', 'DryPass Clause', 'Sleep Moves Clause', '!Evasion Abilities Clause'],
		banlist: ['King\'s Rock', 'Quick Claw', 'Assist', 'Sand Stream ++ Sand Veil', 'Snow Warning ++ Snow Cloak'],
	},
	
	// FPT Doubles
	///////////////////////////////////////////////////////////////////
	{
		section: "FPT Doubles",
		column: 4,
	},
	{
		name: "[Gen 4] Doubles OU",
		mod: 'gen4',
		gameType: 'doubles',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['AG', 'Uber', 'Soul Dew', 'Dark Void', 'Thunder Wave'],
		unbanlist: ['Machamp', 'Manaphy', 'Mew', 'Salamence', 'Wobbuffet', 'Wynaut'],
	},
	{
		name: "[Gen 4] 6v6 Doubles Draft",
		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		teraPreviewDefault: true,
		ruleset: ['Standard Draft', '!Sleep Clause Mod', '!Evasion Clause'],
	},
	{
		name: "[Gen 4] 4v4 Doubles Draft",
		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		teraPreviewDefault: true,
		ruleset: ['Standard Draft', 'Item Clause = 1', 'VGC Timer', '!Sleep Clause Mod', '!OHKO Clause', '!Evasion Clause', 'Adjust Level = 50', 'Picked Team Size = 4'],
	},
];
