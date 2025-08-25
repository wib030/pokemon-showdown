export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standard: {
		inherit: true,
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Items Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	flatrules: {
		inherit: true,
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'Item Clause = 1', 'Adjust Level Down = 50', 'Picked Team Size = Auto', 'Cancel Mod'],
	},
	teampreview: {
		inherit: true,
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Arceus|Genesect|Gourgeist|Pumpkaboo|Xerneas|Silvally|Urshifu|Dudunsparce)(-[a-zA-Z?-]+)?/g, '$1-*')
					.replace(/(Zacian|Zamazenta)(?!-Crowned)/g, '$1-*') // Hacked-in Crowned formes will be revealed
					.replace(/(Greninja)(?!-Ash)/g, '$1-*'); // Hacked-in Greninja-Ash will be revealed
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
			}
			this.makeRequest('teampreview');
		},
	},
};
