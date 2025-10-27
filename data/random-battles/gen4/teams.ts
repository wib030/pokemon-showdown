import RandomGen5Teams from '../gen5/teams';
import type { PRNG } from '../../../sim';
import type { MoveCounter } from '../gen8/teams';

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'slackoff', 'softboiled', 'synthesis',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'curse', 'dragondance', 'howl', 'meditate', 'screech', 'swordsdance',
];
// Conglomerate for ease of access
const SETUP = [
	'acidarmor', 'agility', 'bellydrum', 'bulkup', 'calmmind', 'curse', 'dragondance', 'growth', 'howl', 'irondefense',
	'meditate', 'nastyplot', 'raindance', 'rockpolish', 'sunnyday', 'swordsdance', 'tailglow',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'aquajet', 'bulletpunch', 'chatter', 'eruption', 'explosion', 'fakeout', 'focuspunch', 'futuresight', 'iceshard',
	'icywind', 'knockoff', 'machpunch', 'pluck', 'pursuit', 'quickattack', 'rapidspin', 'reversal', 'selfdestruct',
	'shadowsneak', 'skyattack', 'suckerpunch', 'uturn', 'vacuumwave', 'waterspout',
];
// Hazard-setting moves
const HAZARDS = [
	'spikes', 'stealthrock', 'toxicspikes',
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['lightscreen', 'reflect'],
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	['leechseed', 'substitute'],
	['focuspunch', 'substitute'],
	['raindance', 'rest'],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	'cacturne', 'dusknoir', 'honchkrow', 'mamoswine', 'scizor', 'shedinja', 'shiftry',
];

// Lead Roles
const LEAD_ROLES = [
	'Fast Lead', 'Bulky Lead', 'Anti-Lead', 'Sand Lead', 'Sun Lead', 'Hail Lead', 'Rain Lead',
];

// Removal Roles
const REMOVAL_ROLES = [
	'Defog', 'Spinner',
];

// Attacking Roles
const ATTACKING_ROLES = [
	'Fast Attacker', 'Setup Sweeper', 'Wallbreaker', 'Bulky Attacker', 'Bulky Setup', 'Fast Bulky Setup', 'AV Pivot', 'Doubles Fast Attacker', 'Doubles Setup Sweeper', 'Doubles Wallbreaker', 
	'Doubles Bulky Attacker', 'Doubles Bulky Setup', 'Offensive Protect', 'Berry Sweeper', 'Sun Attacker', 'Rain Attacker', 'Hail Attacker', 'Sand Attacker', 'Glass Cannon', 'Fling Setup',
	'TR Attacker', 'Fast Pivot', 'Bulky Pivot', 'Sun Setup', 'Switch Trapper',
];

// Types with immunities
const IMMUNE_TYPES = [
	"Normal", "Fighting", "Poison", "Ground", "Ghost", "Fire", "Water", "Electric", "Psychic",
];

// Immunity abilities
const IMMUNITY_ABILITIES: { [k: string]: string[] } = {
	waterabsorb: ["Water"],
	stormdrain: ["Water"],
	dryskin: ["Water"],
	flashfire: ["Fire"],
	levitate: ["Ground"],
	lightningrod: ["Electric"],
	motordrive: ["Electric"],
	voltabsorb: ["Electric"],
	ghostly: ["Normal", "Fighting"],
};

// Resistance abilities
const RESISTANCE_ABILITIES: { [k: string]: string[] } = {
	unownenergy: ["Flying", "Poison", "Ground", "Rock", "Steel", "Fire", "Water", "Grass", "Electric", "Ice", "Dragon", "Fighting", "Psychic", "Bug", "Ghost", "Dark"],
	thickfat: ["Fire", "Ice"],
	heatproof: ["Fire"],
};

// Weakness abilities
const WEAKNESS_ABILITIES: { [k: string]: string[] } = {
	unownenergy: ["Normal"],
	colorchange: ["Dragon", "Ghost"],
	ghostly: ["Ghost", "Dark"],
};

// Abilities that consider resistance and weakness differently
const TYPE_ALTERING_ABILITIES = [
	'colorchange', 'ghostly',
];

class TypeFrequency {
	type: string = '';
	frequency: number = 0;
}

export class RandomGen4Teams extends RandomGen5Teams {
	override randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.noStab = NO_STAB;
		this.priorityPokemon = PRIORITY_POKEMON;

		this.moveEnforcementCheckers = {
			Bug: (movePool, moves, abilities, types, counter) => (
				!counter.get('Bug') && movePool.includes('megahorn')
			),
			Dark: (movePool, moves, abilities, types, counter) => !counter.get('Dark'),
			Dragon: (movePool, moves, abilities, types, counter) => !counter.get('Dragon'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting'),
			Fire: (movePool, moves, abilities, types, counter) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter, species) => !counter.get('Flying') && species.id !== 'aerodactyl',
			Ghost: (movePool, moves, abilities, types, counter) => !counter.get('Ghost'),
			Grass: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Grass') &&
				(species.baseStats.atk >= 100 || movePool.includes('leafstorm') || movePool.includes('solarbeam'))
			),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => !counter.get('Ice'),
			Poison: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Poison') && (['Ghost', 'Grass', 'Ground'].some(type => types.has(type)))
			),
			Psychic: (movePool, moves, abilities, types, counter) => (
				!counter.get('Psychic') && (types.has('Fighting') || movePool.includes('calmmind'))
			),
			Rock: (movePool, moves, abilities, types, counter, species) => (!counter.get('Rock') && species.baseStats.atk >= 80),
			Steel: (movePool, moves, abilities, types, counter, species) => (!counter.get('Steel') && species.id === 'metagross'),
			Water: (movePool, moves, abilities, types, counter) => !counter.get('Water'),
		};
		this.cachedStatusMoves = this.dex.moves.all()
			.filter(move => move.category === 'Status')
			.map(move => move.id);
	}

	override cullMovePool(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): void {
		// Pokemon cannot have multiple Hidden Powers in any circumstance
		let hasHiddenPower = false;
		for (const move of moves) {
			if (move.startsWith('hiddenpower')) hasHiddenPower = true;
		}
		if (hasHiddenPower) {
			let movePoolHasHiddenPower = true;
			while (movePoolHasHiddenPower) {
				movePoolHasHiddenPower = false;
				for (const moveid of movePool) {
					if (moveid.startsWith('hiddenpower')) {
						this.fastPop(movePool, movePool.indexOf(moveid));
						movePoolHasHiddenPower = true;
						break;
					}
				}
			}
		}

		if (moves.size + movePool.length <= this.maxMoveCount) return;
		// If we have two unfilled moves and only one unpaired move, cull the unpaired move.
		if (moves.size === this.maxMoveCount - 2) {
			const unpairedMoves = [...movePool];
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
				}
			}
			if (unpairedMoves.length === 1) {
				this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
			}
		}

		// These moves are paired, and shouldn't appear if there is not room for them both.
		if (moves.size === this.maxMoveCount - 1) {
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(movePool, movePool.indexOf(pair[0]));
					this.fastPop(movePool, movePool.indexOf(pair[1]));
				}
			}
		}

		// Team-based move culls
		if (teamDetails.screens && movePool.length >= this.maxMoveCount + 2) {
			if (movePool.includes('reflect')) this.fastPop(movePool, movePool.indexOf('reflect'));
			if (movePool.includes('lightscreen')) this.fastPop(movePool, movePool.indexOf('lightscreen'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stealthRock) {
			if (movePool.includes('stealthrock')) this.fastPop(movePool, movePool.indexOf('stealthrock'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.rapidSpin && !REMOVAL_ROLES.includes(role)) {
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.toxicSpikes) {
			if (movePool.includes('toxicspikes')) this.fastPop(movePool, movePool.indexOf('toxicspikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.spikes && teamDetails.spikes >= 2) {
			if (movePool.includes('spikes')) this.fastPop(movePool, movePool.indexOf('spikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.statusCure) {
			if (movePool.includes('aromatherapy')) this.fastPop(movePool, movePool.indexOf('aromatherapy'));
			if (movePool.includes('healbell')) this.fastPop(movePool, movePool.indexOf('healbell'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		// Develop additional move lists
		const badWithSetup = ['pursuit', 'toxic'];
		const statusMoves = this.cachedStatusMoves;

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, ['healingwish', 'switcheroo', 'trick']],
			[SETUP, 'uturn'],
			[SETUP, HAZARDS],
			[SETUP, badWithSetup],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[['fakeout', 'uturn'], ['switcheroo', 'trick']],
			['substitute', 'uturn'],
			['rest', 'substitute'],
			['explosion', ['destinybond', 'painsplit', 'rest', 'trick']],

			// These attacks are redundant with each other
			['surf', 'hydropump'],
			[['bodyslam', 'return'], ['bodyslam', 'doubleedge']],
			[['energyball', 'leafstorm'], ['leafblade', 'leafstorm', 'powerwhip']],
			['lavaplume', 'fireblast'],
			['closecombat', 'drainpunch'],
			['discharge', 'thunderbolt'],
			['gunkshot', 'poisonjab'],
			['payback', 'pursuit'],
			['protect', 'swordsdance'],

			// Assorted hardcodes go here:
			// Manectric
			['flamethrower', 'overheat'],
			// Walrein
			['encore', 'roar'],
			// Smeargle
			['explosion', 'whirlwind'],
			// Seviper
			['switcheroo', 'suckerpunch'],
			// Jirachi
			['bodyslam', 'healingwish'],
			// Blaziken
			['agility', 'vacuumwave'],
		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		const statusInflictingMoves = ['stunspore', 'thunderwave', 'toxic', 'willowisp', 'yawn'];
		if (role !== 'Staller') {
			this.incompatibleMoves(moves, movePool, statusInflictingMoves, statusInflictingMoves);
		}

		// Cull filler moves for otherwise fixed set Stealth Rock users
		if (!teamDetails.stealthRock) {
			if (species.id === 'registeel' && role === 'Staller') {
				if (movePool.includes('thunderwave')) this.fastPop(movePool, movePool.indexOf('thunderwave'));
				if (moves.size + movePool.length <= this.maxMoveCount) return;
			}
			if (species.id === 'wormadamtrash' && role === 'Staller') {
				if (movePool.includes('suckerpunch')) this.fastPop(movePool, movePool.indexOf('suckerpunch'));
				if (moves.size + movePool.length <= this.maxMoveCount) return;
			}
		}
		if (species.id === 'bastiodon') {
			// Enforces Toxic too, for good measure.
			this.incompatibleMoves(moves, movePool, ['metalburst', 'protect', 'roar'], ['metalburst', 'protect']);
		}
	}

	// Generate random moveset for a given species, role, preferred type.
	override randomMoveset(
		types: string[],
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		movePool: string[],
		preferredType: string,
		role: RandomTeamsTypes.Role,
		removalNum: number,
	): Set<string> {
		const moves = new Set<string>();
		let counter = this.newQueryMoves(moves, species, preferredType, abilities);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead,
			preferredType, role);

		// If there are only four moves, add all moves and return early
		if (movePool.length <= this.maxMoveCount) {
			// Still need to ensure that multiple Hidden Powers are not added (if maxMoveCount is increased)
			while (movePool.length) {
				const moveid = this.sample(movePool);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
			return moves;
		}

		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool, moves, abilities, new Set(types), counter, species, teamDetails
			);
		};

		// Add required move (e.g. Relic Song for Meloetta-P)
		if (species.requiredMove) {
			const move = this.dex.moves.get(species.requiredMove).id;
			counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role);
		}

		// Add other moves you really want to have, e.g. STAB, recovery, setup.

		// Enforce Facade if Guts is a possible ability
		if (movePool.includes('facade') && abilities.includes('Guts')) {
			counter = this.addMove('facade', moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role);
		}

		// Enforce Seismic Toss, Spore, and Volt Tackle
		for (const moveid of ['seismictoss', 'spore', 'volttackle']) {
			if (movePool.includes(moveid)) {
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Substitute on non-Setup sets with Baton Pass
		if (!role.includes('Setup')) {
			if (movePool.includes('batonpass') && movePool.includes('substitute')) {
				counter = this.addMove('substitute', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Rapid Spin on Bulky Support and Defog if the team doesn't already have it
		if (['Bulky Support', 'Defog', 'Spinner'].includes(role) && removalNum < 1) {
			if (movePool.includes('rapidspin')) {
				counter = this.addMove('rapidspin', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce STAB priority
		if (['Bulky Attacker', 'Bulky Setup'].includes(role) || this.priorityPokemon.includes(species.id)) {
			const priorityMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (types.includes(moveType) && move.priority > 0 && (move.basePower || move.basePowerCallback)) {
					priorityMoves.push(moveid);
				}
			}
			if (priorityMoves.length) {
				const moveid = this.sample(priorityMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Check if a STAB move of that type should be required
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Preferred Type
		if (!counter.get('preferred')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && preferredType === moveType) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// If no STAB move was added, add a STAB move
		if (!counter.get('stab')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.includes(moveType)) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			} else {
				// If they have no regular STAB move, enforce U-turn on Bug types.
				if (movePool.includes('uturn') && types.includes('Bug')) {
					counter = this.addMove('uturn', moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Enforce recovery
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup', 'Staller'].includes(role)) {
			const recoveryMoves = movePool.filter(moveid => RECOVERY_MOVES.includes(moveid));
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce Staller moves
		if (role === 'Staller') {
			const enforcedMoves = ['protect', 'toxic', 'wish'];
			for (const move of enforcedMoves) {
				if (movePool.includes(move)) {
					counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Enforce setup
		if (role.includes('Setup')) {
			const setupMoves = movePool.filter(moveid => SETUP.includes(moveid));
			if (setupMoves.length) {
				const moveid = this.sample(setupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size && !(moves.has('uturn') && types.includes('Bug'))) {
			// Choose an attacking move
			const attackingMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				if (!this.noStab.includes(moveid) && (move.category !== 'Status')) attackingMoves.push(moveid);
			}
			if (attackingMoves.length) {
				const moveid = this.sample(attackingMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// Enforce coverage move
		if (['Fast Attacker', 'Setup Sweeper', 'Bulky Attacker', 'Wallbreaker'].includes(role)) {
			if (counter.damagingMoves.size === 1) {
				// Find the type of the current attacking move
				const currentAttackType = counter.damagingMoves.values().next().value!.type;
				// Choose an attacking move that is of different type to the current single attack
				const coverageMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(move, species, abilities, preferredType);
					if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
						if (currentAttackType !== moveType) coverageMoves.push(moveid);
					}
				}
				if (coverageMoves.length) {
					const moveid = this.sample(coverageMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}

		// Choose remaining moves randomly from movepool and add them to moves list:
		while (moves.size < this.maxMoveCount && movePool.length) {
			const moveid = this.sample(movePool);
			counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role);
			for (const pair of MOVE_PAIRS) {
				if (moveid === pair[0] && movePool.includes(pair[1])) {
					counter = this.addMove(pair[1], moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
				if (moveid === pair[1] && movePool.includes(pair[0])) {
					counter = this.addMove(pair[0], moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role);
				}
			}
		}
		return moves;
	}

	override shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		preferredType: string,
		role: RandomTeamsTypes.Role
	): boolean {
		switch (ability) {
		case 'Chlorophyll':
			return !teamDetails.sun;
		case 'Swift Swim':
			return !teamDetails.rain;
		case 'Rock Head':
			return !counter.get('recoil');
		case 'Skill Link':
			return !counter.get('skilllink');
		}

		return false;
	}

	override getAbility(
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (abilities.length <= 1) return abilities[0];

		// Hard-code abilities here
		if (species.id === 'dewgong') return moves.has('raindance') ? 'Hydration' : 'Thick Fat';
		if (species.id === 'cloyster' && counter.get('skilllink')) return 'Skill Link';

		const abilityAllowed: string[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilities) {
			if (!this.shouldCullAbility(
				ability, types, moves, abilities, counter, movePool, teamDetails, species, preferredType, role
			)) {
				abilityAllowed.push(ability);
			}
		}

		// Pick a random allowed ability
		if (abilityAllowed.length >= 1) return this.sample(abilityAllowed);

		// If all abilities are rejected, prioritize weather abilities over non-weather abilities
		if (!abilityAllowed.length) {
			const weatherAbilities = abilities.filter(a => ['Chlorophyll', 'Swift Swim'].includes(a));
			if (weatherAbilities.length) return this.sample(weatherAbilities);
		}

		// Pick a random ability
		return this.sample(abilities);
	}

	override getPriorityItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string | undefined {
		if (species.requiredItems) return this.sample(species.requiredItems);
		if (species.id === 'latias' || species.id === 'latios') return 'Soul Dew';
		if (species.id === 'marowak') return 'Thick Club';
		if (species.id === 'pikachu') return 'Light Ball';
		if (species.id === 'shedinja' || species.id === 'smeargle') return 'Focus Sash';
		if (species.id === 'unown') return 'Choice Specs';
		if (species.id === 'wobbuffet') return 'Custap Berry';
		if (species.id === 'ditto' || (species.id === 'rampardos' && role === 'Fast Attacker')) return 'Choice Scarf';
		if (species.id === 'honchkrow') return 'Life Orb';
		if (ability === 'Poison Heal' || moves.has('facade')) return 'Toxic Orb';
		if (ability === 'Speed Boost' && species.id === 'yanmega') return 'Life Orb';
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && role !== 'Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (moves.has('bellydrum')) return 'Sitrus Berry';
		if (moves.has('waterspout')) return 'Choice Scarf';
		if (ability === 'Magic Guard') return 'Life Orb';
		if (moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (moves.has('rest') && !moves.has('sleeptalk') && !['Natural Cure', 'Shed Skin'].includes(ability)) {
			return (moves.has('raindance') && ability === 'Hydration') ? 'Damp Rock' : 'Chesto Berry';
		}
		if (ability === 'Unburden') return 'Sitrus Berry';
		if (role === 'Staller') return 'Leftovers';
	}

	override getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		const scarfReqs = (
			role !== 'Wallbreaker' &&
			species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
			!counter.get('priority') && !moves.has('pursuit')
		);

		if (
			moves.has('pursuit') && moves.has('suckerpunch') && counter.get('Dark') &&
			(!this.priorityPokemon.includes(species.id) || counter.get('Dark') >= 2)
		) return 'Black Glasses';
		if (counter.get('Special') === 4) {
			return (
				scarfReqs && species.baseStats.spa >= 90 && this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			counter.get('Special') === 3 && role === 'Fast Attacker' && (moves.has('explosion') || moves.has('selfdestruct'))
		) return 'Choice Scarf';
		if (counter.get('Special') === 3 && moves.has('uturn')) return 'Choice Specs';
		if (counter.get('Physical') === 4 && species.id !== 'jirachi' &&
			['fakeout', 'rapidspin'].every(m => !moves.has(m))
		) {
			return (
				scarfReqs && (species.baseStats.atk >= 100 || ability === 'Pure Power' || ability === 'Huge Power') &&
				this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Band';
		}

		if (types.includes('Normal') && moves.has('fakeout') && !!counter.get('Normal')) return 'Silk Scarf';
		if (species.id === 'palkia') return 'Lustrous Orb';
		if (species.id === 'farfetchd') return 'Stick';
		if (moves.has('outrage') && counter.get('setup') && !moves.has('sleeptalk')) return 'Lum Berry';
		if (['batonpass', 'protect', 'substitute'].some(m => moves.has(m))) return 'Leftovers';
		if (
			role === 'Fast Support' && isLead && defensiveStatTotal < 255 && !counter.get('recovery') &&
			(counter.get('hazards') || counter.get('setup')) && (!counter.get('recoil') || ability === 'Rock Head')
		) return 'Focus Sash';

		// Default Items
		if (role === 'Fast Support') {
			return (
				counter.get('Physical') + counter.get('Special') >= 3 &&
				['rapidspin', 'uturn'].every(m => !moves.has(m)) &&
				this.dex.getEffectiveness('Rock', species) < 2
			) ? 'Life Orb' : 'Leftovers';
		}
		// noStab moves that should reject Expert Belt
		const noExpertBeltMoves = this.noStab.filter(
			moveid => ['Dragon', 'Normal', 'Poison'].includes(this.dex.moves.get(moveid).type)
		);
		const expertBeltReqs = (
			!counter.get('Dragon') && !counter.get('Normal') && !counter.get('Poison') &&
			noExpertBeltMoves.every(m => !moves.has(m))
		);
		if (!counter.get('Status') && expertBeltReqs && (moves.has('uturn') || role === 'Fast Attacker')) return 'Expert Belt';
		if (
			['Fast Attacker', 'Setup Sweeper', 'Wallbreaker'].some(m => role === m) &&
			this.dex.getEffectiveness('Rock', species) < 2 && !moves.has('rapidspin')
		) return 'Life Orb';
		return 'Leftovers';
	}

	override randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		leadNum: number,
		removalNum: number,
	): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		const forme = this.getForme(species);
		const sets = this.randomSets[species.id]["sets"];
		const possibleSets = [];
		
		let hasLeadSet = false;
		for (let set of sets) {
			if (LEAD_ROLES.includes(set.role)) {
				hasLeadSet = true;
				break;
			}
		}
		
		let hasRemovalSet = false;
		for (let set of sets) {
			if (REMOVAL_ROLES.includes(set.role)) {
				hasRemovalSet = true;
				break;
			}
		}
		
		for (const set of sets) {
			// Enforce Lead if the team does not have one
			if (leadNum === 0 && hasLeadSet && !LEAD_ROLES.includes(set.role)) continue;
			
			// Prevent Lead if the team already has more than one lead
			if (leadNum > 1 && LEAD_ROLES.includes(set.role)) continue;
			
			// Enforce Removal if the team does not have removal
			if ((removalNum === 0 && leadNum > 0) && hasRemovalSet && !REMOVAL_ROLES.includes(set.role)) continue;
			
			// Prevent Removal if the team already has more than one removal
			if (removalNum > 1 && REMOVAL_ROLES.includes(set.role)) continue;
			
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		
		const movePool: string[] = Array.from(set.movepool);
		const preferredTypes = set.preferredTypes;
		const preferredType = this.sampleIfArray(preferredTypes) || '';
		const evPool = set.evs || '';
		const ivPool = set.ivs || '';
		const setItem = set.item || '';
		const nature = set.nature || 'Serious';

		let ability = '';
		let item = undefined;

		let evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		let ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
		
		if (evPool !== '') {
			evs = { hp: evPool[0], atk: evPool[1], def: evPool[2], spa: evPool[3], spd: evPool[4], spe: evPool[5] };
		}
		
		if (ivPool !== '') {
			ivs = { hp: ivPool[0], atk: ivPool[1], def: ivPool[2], spa: ivPool[3], spd: ivPool[4], spe: ivPool[5] };
		}

		const types = species.types;
		const abilities = set.abilities!;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, movePool,
			preferredType, role, removalNum);
		const counter = this.newQueryMoves(moves, species, preferredType, abilities);

		// Get ability
		ability = this.getAbility(new Set(types), moves, abilities, counter, movePool, teamDetails, species,
			preferredType, role);

		// Get items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
		if (item === undefined) {
			item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
		}
		item = (setItem === '') ? item : set.item;

		// For Trick / Switcheroo
		if (item === 'Leftovers' && types.includes('Poison')) {
			item = 'Black Sludge';
		}

		const level = this.getLevel(species);

		// We use a special variable to track Hidden Power
		// so that we can check for all Hidden Powers at once
		let hasHiddenPower = false;
		for (const move of moves) {
			if (move.startsWith('hiddenpower')) hasHiddenPower = true;
		}

		if (hasHiddenPower) {
			let hpType;
			for (const move of moves) {
				if (move.startsWith('hiddenpower')) hpType = move.substr(11);
			}
			if (!hpType) throw new Error(`hasHiddenPower is true, but no Hidden Power move was found.`);
			const HPivs = this.dex.types.get(hpType).HPivs;
			let iv: StatID;
			for (iv in HPivs) {
				ivs[iv] = HPivs[iv]!;
			}
		}

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard';
		const srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (moves.has('substitute') && item === 'Sitrus Berry') {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if (moves.has('bellydrum') && item === 'Sitrus Berry') {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0) break;
				if (srWeakness === 1 && ['Black Sludge', 'Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter.get('Physical') && !moves.has('transform')) {
			evs.atk = 0;
			ivs.atk = hasHiddenPower ? (ivs.atk || 31) - 28 : 0;
		}

		if (['gyroball', 'metalburst', 'trickroom'].some(m => moves.has(m))) {
			evs.spe = 0;
			ivs.spe = hasHiddenPower ? (ivs.spe || 31) - 28 : 0;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 1024),
			nature,
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			role,
		};
	}
	
	override randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		const baseFormes: { [k: string]: number } = {};
		const typeCount: { [k: string]: number } = {};
		
		/*
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const typeResistances: { [k: string]: number } = {};
		const typeDoubleResistances: { [k: string]: number } = {};
		const typeImmunities: { [k: string]: number } = {};
		*/
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		let WeaknessList: TypeFrequency[] = [];
		let DoubleWeaknessList: TypeFrequency[] = [];
		let ImmunityList: TypeFrequency[] = [];
		let ResistList: TypeFrequency[] = [];
		let DoubleResistList: TypeFrequency[] = [];
		
		let WeaknessListFull: TypeFrequency[] = [];
		let DoubleWeaknessListFull: TypeFrequency[] = [];
		
		let leadNum = 0;
		let removalNum = 0;
		let physicalAttackers = 0;
		let specialAttackers = 0;
		let maxSingleType = 2;
		
		let checkSpecies;
		let sets;
		const maxRerolls = 495;
		let rerollAttempts = 0;
		let doubleWeaknessRerolls = 0;
		let rerollAttemptsTotal = 0;
		let skipReroll = false;

		const pokemonList = Object.keys(this.randomSets);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sample(baseSpeciesPool);
			const species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			checkSpecies = this.dex.species.get(species);
			if (!species.exists) continue;
			
			skipReroll = false;
			doubleWeaknessRerolls = 0;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Prevent Shedinja from generating after Sandstorm/Hail setters
			if (species.name === 'Shedinja' && (teamDetails.sand || teamDetails.hail)) continue;

			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			const types = species.types;
			let checkTypes = types;
			let skip = false;
			let skipWeaknessCheck = false;

			const set = this.randomSet(species, teamDetails, pokemon.length === 0, leadNum, removalNum);
			
			if (set.ability === 'Multitype') {
				switch (set.item) {
					case 'Fist Plate': checkTypes = 'Fighting'; break;
					case 'Sky Plate': checkTypes = 'Flying'; break;
					case 'Toxic Plate': checkTypes = 'Poison'; break;
					case 'Earth Plate': checkTypes = 'Ground'; break;
					case 'Stone Plate': checkTypes = 'Rock'; break;
					case 'Insect Plate': checkTypes = 'Bug'; break;
					case 'Spooky Plate': checkTypes = 'Ghost'; break;
					case 'Iron Plate': checkTypes = 'Steel'; break;
					case 'Flame Plate': checkTypes = 'Fire'; break;
					case 'Splash Plate': checkTypes = 'Water'; break;
					case 'Meadow Plate': checkTypes = 'Grass'; break;
					case 'Zap Plate': checkTypes = 'Electric'; break;
					case 'Mind Plate': checkTypes = 'Psychic'; break;
					case 'Icicle Plate': checkTypes = 'Ice'; break;
					case 'Draco Plate': checkTypes = 'Dragon'; break;
					case 'Dread Plate': checkTypes = 'Dark'; break;
					default: break;
				}
			}
			
			const abilityState = this.dex.abilities.get(set.ability);
			
			if (!isMonotype && !this.forceMonotype) {
				/*
				if (leadNum < 1) {
					sets = this.randomSets[checkSpecies.id]["sets"];
					// Check if the Pokemon has a Lead set
					skip = true;
					for (const set of sets) {
						if (LEAD_ROLES.includes(set.role)) {
							skip = false;
							break;
						}
					}
				} else if (removalNum < 1 && leadNum > 0) {
					sets = this.randomSets[checkSpecies.id]["sets"];
					// Check if the Pokemon has a Removal set
					skip = true;
					for (let set of sets) {
						if (REMOVAL_ROLES.includes(set.role)) {
							skip = false;
							break;
						}
					}
				}
				if (skip) {
					rerollAttempts++;
					rerollAttemptsTotal++;
					if (rerollAttempts > maxRerolls) skipReroll = true;
					if (!skipReroll) continue;
				}
				*/
				
				if (pokemon.length > 0)
				{
					if (Array.isArray(DoubleWeaknessListFull) && DoubleWeaknessListFull.length) {
						DoubleWeaknessList = DoubleWeaknessListFull;
						if (Array.isArray(DoubleWeaknessList) && DoubleWeaknessList.length) {
							this.dex.TypeMatchupListShuffleAndConcat(DoubleWeaknessList);
							for (const DoubleWeakness of DoubleWeaknessList)
							{
								if (doubleWeaknessRerolls > (maxRerolls / 2)) {
									if (DoubleWeakness.frequency > 0 && ResistList?.some(y => y.type === DoubleWeakness.type && y.frequency < DoubleWeakness.frequency)) {
										if (this.dex.precheckEffectiveness(DoubleWeakness.type, checkTypes, set.ability) > -1) {
											skip = true;
											break;
										} else {
											skipWeaknessCheck = true;
										}
									}
								} else {
									if (IMMUNE_TYPES.includes(DoubleWeakness.type)) {
										if (DoubleWeakness.frequency > 0 && ImmunityList?.some(y => y.type === DoubleWeakness.type && y.frequency < DoubleWeakness.frequency)) {
											if (this.dex.precheckImmunity(DoubleWeakness.type, checkTypes, set.ability) && this.dex.precheckEffectiveness(DoubleWeakness.type, checkTypes, set.ability) > -2) {
												skip = true;
												break;
											} else {
												skipWeaknessCheck = true;
											}
										}
									}

									if (DoubleWeakness.frequency > 0 && DoubleResistList?.some(y => y.type === DoubleWeakness.type && y.frequency < DoubleWeakness.frequency)) {
										if (this.dex.precheckEffectiveness(DoubleWeakness.type, checkTypes, set.ability) > -2) {
											skip = true;
											break;
										} else {
											skipWeaknessCheck = true;
										}
									}
								}
							}
							if (skip) {
								rerollAttempts++;
								doubleWeaknessRerolls++;
								rerollAttemptsTotal++;
								if (rerollAttempts > maxRerolls) skipReroll = true;
								if (!skipReroll) continue;
							}
						}
					}
					
					if (Array.isArray(WeaknessListFull) && WeaknessListFull.length && !skipWeaknessCheck) {
						WeaknessList = WeaknessListFull;
						if (Array.isArray(WeaknessList) && WeaknessList.length) {
							this.dex.TypeMatchupListShuffleAndConcat(WeaknessList);
							for (const Weakness of WeaknessList)
							{
								if (IMMUNE_TYPES.includes(Weakness.type)) {
									if (Weakness.frequency > 0 && ImmunityList?.some(y => y.type === Weakness.type && y.frequency < Weakness.frequency)) {
										if (this.dex.precheckImmunity(Weakness.type, checkTypes, set.ability)) {
											skip = true;
											break;
										}
									}
								}

								if (Weakness.frequency > 0 && DoubleResistList?.some(y => y.type === Weakness.type && y.frequency < Weakness.frequency)) {
									if (this.dex.precheckEffectiveness(Weakness.type, checkTypes, set.ability) > -2) {
										skip = true;
										break;
									}
								}

								if (Weakness.frequency > 0 && ResistList?.some(y => y.type === Weakness.type && y.frequency < Weakness.frequency)) {
									if (this.dex.precheckEffectiveness(Weakness.type, checkTypes, set.ability) > -1) {
										skip = true;
										break;
									}
								}
							}
							if (skip) {
								rerollAttempts++;
								rerollAttemptsTotal++;
								if (rerollAttempts > maxRerolls) skipReroll = true;
								if (!skipReroll) continue;
							}
						}
					}
				}
				
				// Limit two of any type
				for (const typeName of types) {
					if ((typeCount[typeName] >= maxSingleType * limitFactor) && set.ability !== 'Color Change' && set.ability !== 'Imposter') {
						skip = true;
						break;
					}
				}
				if (skip) {
					rerollAttempts++;
					rerollAttemptsTotal++;
					continue;
				}
				
				// Limit two weak to any type, and one double weak to a single type
				for (const Weakness of WeaknessListFull) {
					// it's weak to the type
					if (this.dex.precheckEffectiveness(Weakness.type, checkTypes, set.ability) > 0) {
						if (Weakness.frequency >= 2 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
				for (const DoubleWeakness of DoubleWeaknessListFull) {
					// it's double weak to the type
					if (this.dex.precheckEffectiveness(DoubleWeakness.type, checkTypes, set.ability) > 0) {
						if (DoubleWeakness.frequency >= limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) {
					rerollAttempts++;
					rerollAttemptsTotal++;
					continue;
				}
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);
			rerollAttempts = 0;

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}

			// Increment weakness, resistance and immunity counter
			for (const typeName of this.dex.types.names()) {
				let Weakness = new TypeFrequency();
				let DoubleWeakness = new TypeFrequency();
				let MonImmunity = new TypeFrequency();
				let MonResist = new TypeFrequency();
				let MonDoubleResist = new TypeFrequency();
				let TempIndex = 0;

				if (this.dex.precheckEffectiveness(typeName, checkTypes, set.ability) > 0) {
					if (this.dex.precheckEffectiveness(typeName, checkTypes, set.ability) > 1) {
						if (DoubleWeaknessListFull?.some(y => y.type === typeName)) {
							TempIndex = DoubleWeaknessListFull.findIndex(y => y.type === typeName);
							DoubleWeaknessListFull[TempIndex].frequency++;
						} else {
							DoubleWeakness.type = typeName;
							DoubleWeakness.frequency++;
							DoubleWeaknessListFull.push(DoubleWeakness);
						}
					}
					else {
						if (WeaknessListFull?.some(y => y.type === typeName)) {
							TempIndex = WeaknessListFull.findIndex(y => y.type === typeName);
							WeaknessListFull[TempIndex].frequency++;
						} else {
							Weakness.type = typeName;
							Weakness.frequency++;
							WeaknessListFull.push(Weakness);
						}
					}
				}
				else {
					if (this.dex.precheckEffectiveness(typeName, checkTypes, set.ability) < 0) {
						if (this.dex.precheckEffectiveness(typeName, checkTypes, set.ability) < -1) {
							if (DoubleResistList?.some(y => y.type === typeName)) {
								TempIndex = DoubleResistList.findIndex(y => y.type === typeName);
								DoubleResistList[TempIndex].frequency++;
							} else {
								MonDoubleResist.type = typeName;
								MonDoubleResist.frequency++;
								DoubleResistList.push(MonDoubleResist);
							}
						}
						else {
							if (ResistList?.some(y => y.type === typeName)) {
								TempIndex = ResistList.findIndex(y => y.type === typeName);
								ResistList[TempIndex].frequency++;
							} else {
								MonResist.type = typeName;
								MonResist.frequency++;
								ResistList.push(MonResist);
							}
						}
					}
				}
				
				if (!this.dex.precheckImmunity(typeName, checkTypes, set.ability)) {
					if (ImmunityList?.some(y => y.type === typeName)) {
						TempIndex = ImmunityList.findIndex(y => y.type === typeName);
						ImmunityList[TempIndex].frequency++;
					} else {
						MonImmunity.type = typeName;
						MonImmunity.frequency++;
						ImmunityList.push(MonImmunity);
					}
				}
			}

			// Team details
			if (set.ability === 'Snow Warning' || set.moves.includes('hail') || (set.ability === 'Forecast' && set.item === 'Icy Rock')) teamDetails.hail = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance') || (set.ability === 'Forecast' && set.item === 'Damp Rock')) teamDetails.rain = 1;
			if (set.ability === 'Sand Stream' || set.moves.includes('sandstorm') || (set.ability === 'Forecast' && set.item === 'Smooth Rock')) teamDetails.sand = 1;
			if (set.ability === 'Drought' || set.moves.includes('sunnyday') || (set.ability === 'Forecast' && set.item === 'Heat Rock')) teamDetails.sun = 1;
			if (set.moves.includes('aromatherapy') || set.moves.includes('healbell')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes')) teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
			if (set.moves.includes('toxicspikes')) teamDetails.toxicSpikes = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('reflect') && set.moves.includes('lightscreen')) teamDetails.screens = 1;
			if (LEAD_ROLES.includes(set.role)) leadNum++;
			if (REMOVAL_ROLES.includes(set.role)) removalNum++;
			if (ATTACKING_ROLES.includes(set.role) && set.inclination === 'Physical') physicalAttackers++;
			if (ATTACKING_ROLES.includes(set.role) && set.inclination === 'Special') specialAttackers++;
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) {
			let returnMessage = "WeaknessList: ";
			let newString = '';
			for (const Weakness of WeaknessList) {
				newString = ` (Type: ${Weakness.type}, Frequency: ${Weakness.frequency})`;
				returnMessage += newString;
			}
			returnMessage += ' DoubleWeaknessList: ';
			for (const DoubleWeakness of DoubleWeaknessList) {
				newString = ` (Type: ${DoubleWeakness.type}, Frequency: ${DoubleWeakness.frequency})`;
				returnMessage += newString;
			}
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed}) ${returnMessage} Reroll Attempts: ${rerollAttemptsTotal}`);
		}

		return pokemon;
	}
}

export default RandomGen4Teams;
