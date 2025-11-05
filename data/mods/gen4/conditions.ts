export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	brn: {
		inherit: true,
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
	},
	par: {
		inherit: true,
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'par');
			}
			target.addVolatile("nopar");
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasAbility('quickfeet')) {
				return this.chainModify(0.5);
			}
			return spe;
		},
		onBeforeMove(pokemon) {
			if (!pokemon.hasAbility('quickfeet') && this.randomChance(1, 5) && !pokemon.volatiles['nopar']) {
				this.add('cant', pokemon, 'par');
				pokemon.addVolatile("nopar");
				return false;
			} else {
				pokemon.removeVolatile("nopar");
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-3 turns
			let badDreamsActive = false;
			let sleepRoll = this.random(1, 100);
			let sleepTurns = 3;
			const oneTurnChance = 25;
			const twoTurnChance = 75;
			
			for (const mon of this.getAllActive()) {
				if (mon.isAlly(target)) continue;
				if (mon.hasAbility('baddreams')) {
					badDreamsActive = true;
					break;
				}
			}
			
			if (sleepRoll < twoTurnChance) {
				if (sleepRoll < oneTurnChance) {
					if (badDreamsActive === false) {
						sleepTurns = sleepTurns - 2;
					}
				} else {
					sleepTurns = sleepTurns - 1;
				}
			}
			
			this.effectState.time = sleepTurns;
			target.sleepHealFlag = true;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusState.time--;
			}
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.sleepHealFlag = false;
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			if (pokemon.sleepHealFlag === true) {
				let badDreamsActive = false;
				for (const mon of this.getAllActive()) {
					if (mon.isAlly(pokemon)) continue;
					if (mon.hasAbility('baddreams')) {
						badDreamsActive = true;
						break;
					}
				}
				
				if (badDreamsActive === false) {
					this.heal(pokemon.baseMaxhp / 8, pokemon);
				}
			}
		},
	},
	psn: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 6,
	},
	tox: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 6,
	},
	confusion: {
		inherit: true,
		onBeforeMove(pokemon) {
			pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.randomChance(1, 3)) {
				return;
			}
			const damage = this.actions.getDamage(pokemon, pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			this.damage(damage, pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				type: '???',
			} as ActiveMove);
			return false;
		},
	},
	frz: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (this.randomChance(2, 5)) {
				pokemon.cureStatus();
				return;
			}
			if (move.flags['defrost']) return;
			this.add('cant', pokemon, 'frz');
			return false;
		},
	},
	substitutebroken: {
		noCopy: true,
	},
	trapped: {
		inherit: true,
		noCopy: false,
	},
	trapper: {
		inherit: true,
		noCopy: false,
	},
	partiallytrapped: {
		inherit: true,
		durationCallback(target, source) {
			if (source.hasItem('gripclaw')) return 6;
			return this.random(3, 7);
		},
		onResidualOrder: 10,
		onResidualSubOrder: 9,
	},
	lockedmove: {
		inherit: true,
		onAfterMove() {},
	},
	choicelock: {
		inherit: true,
		onStart(pokemon) {
			if (!pokemon.lastMove) return false;
			this.effectState.move = pokemon.lastMove.id;
		},
	},
	futuremove: {
		inherit: true,
		onResidualOrder: 11,
	},
	stall: {
		// Protect, Detect, Endure counter
		name: 'stall',
		duration: 2,
		counterMax: 8,
		onStart() {
			this.effectState.counter = 3;
		},
		onStallMove(pokemon) {
			// this.effectState.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			const counter = this.effectState.counter || 1;
			this.debug(`Success chance: ${Math.round(100 / counter)}%`);
			const success = this.randomChance(1, counter);
			if (!success) delete pokemon.volatiles['stall'];
			return success;
		},
		onRestart() {
			if (this.effectState.counter < (this.effect as Condition).counterMax!) {
				this.effectState.counter *= 3;
			}
			this.effectState.duration = 2;
		},
	},
	// Arceus's true typing for all its formes is Normal, and it's only Multitype
	// that changes its type, but its formes are specified to be their corresponding
	// type in the Pokedex, so that needs to be overridden. Without Multitype it
	// starts as Normal type, but its type can be changed by other effects.
	// This is mainly relevant for Hackmons Cup and Balanced Hackmons.
	arceus: {
		name: 'Arceus',
		onBeforeSwitchIn(pokemon) {
			pokemon.setType('Normal'); // Multitype will prevent this
		},
		onSwitchIn(pokemon) {
			if (pokemon.ability === 'multitype') {
				const item = pokemon.getItem();
				const targetForme = (item?.onPlate ? 'Arceus-' + item.onPlate : 'Arceus');
				if (pokemon.species.name !== targetForme) {
					pokemon.formeChange(targetForme);
				}
			}
		},
	},
	giratina: {
		name: 'Giratina',
		onBeforeSwitchIn(pokemon) {
			pokemon.setType(pokemon.baseSpecies.types); // This will cause Antitype to trigger on switch-in as intended
		},
		onSwitchIn(pokemon) {
			if (pokemon.ability === 'antitype') {
				const item = pokemon.getItem();
				const targetForme = (item?.onPlate ? 'Giratina-' + item.onPlate : 'Giratina');
				if (targetForme !== 'Giratina') {
					if (pokemon.species.name !== targetForme) {
						pokemon.formeChange(targetForme);
					}
				}
			}
		},
	},
	raindance: {
		inherit: true,
		onFieldResidualOrder: 8,
	},
	sunnyday: {
		inherit: true,
		onFieldResidualOrder: 8,
	},
	sandstorm: {
		inherit: true,
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			let moveType = move.type;
			let item = source.getItem();
			if (move.id === 'judgment' && source.hasAbility('multitype')) {
				moveType = source.species.types[0];
			}
			if ((move.id === 'fling' || move.id === 'judgment') && item.onPlate) {
				moveType = item.onPlate;
			}
			if (source.hasAbility('normalize') && move.id !== 'judgment') {
				moveType = 'Normal';
			}
			if (move.id === 'hiddenpower') {
				moveType = source.hpType || 'Dark';
			}
			if (source.hasAbility('rockstar') && move.flags['sound']) {
				moveType = 'Rock';
			}
			if (move.id === 'weatherball') {
				switch (this.battle.weather) {
				case 'sunnyday':
				case 'desolateland':
					moveType = 'Fire';
					break;
				case 'raindance':
				case 'primordialsea':
					moveType = 'Water';
					break;
				case 'sandstorm':
					moveType = 'Rock';
					break;
				case 'hail':
				case 'snowscape':
					moveType = 'Ice';
					break;
				}
			}
				
			if (moveType === 'Rock') {
				return this.chainModify(1.1);
			}
		},
		onFieldResidualOrder: 8,
	},
	hail: {
		inherit: true,
		onFieldResidualOrder: 8,
	},
	mustrecharge: {
		inherit: true,
		onStart(pokemon) {
			if (pokemon.hasAbility('relentless'))
			{
				this.damage(pokemon.baseMaxhp / 4);
				this.hint("Relentless ignores the recharge turn, in exchange for the user recieving 1/4 Max HP damage.");
				pokemon.removeVolatile('mustrecharge');
			}
			else
			{
				this.add('-mustrecharge', pokemon);
			}
		},
	},
};
