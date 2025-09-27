export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	airlock: {
		inherit: true,
		onSwitchIn() {},
		onStart(pokemon) {
			pokemon.abilityState.ending = false;
		},
	},
	angerpoint: {
		inherit: true,
		onHit(target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && target.getMoveHitData(move).crit && target.boosts['atk'] < 3) {
				target.setBoost({ atk: 3 });
				this.add('-setboost', target, 'atk', 3, '[from] ability: Anger Point');
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && target.getMoveHitData(move).crit && target.boosts['atk'] < 3) {
				target.setBoost({ atk: 3 });
				this.add('-setboost', target, 'atk', 3, '[from] ability: Anger Point');
			}
		},
		rating: 1.5,
	},
	baddreams: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 10,
	},
	blaze: {
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			let moveType = move.type;
			let item = attacker.getItem();
			if (move.id === 'judgment' && attacker.hasAbility('multitype')) {
				moveType = attacker.species.types[0];
			}
			if ((move.id === 'fling' || move.id === 'judgment') && item.onPlate) {
				moveType = item.onPlate;
			}
			if (attacker.hasAbility('normalize') && move.id !== 'judgment') {
				moveType = 'Normal';
			}
			if (move.id === 'hiddenpower') {
				moveType = attacker.hpType || 'Dark';
			}
			if (attacker.hasAbility('rockstar') && move.flags['sound']) {
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
			
			if (moveType === 'Fire' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		flags: { rollable: 1 },
		name: "Blaze",
		rating: 2,
		num: 66,
	},
	cloudnine: {
		inherit: true,
		onSwitchIn() {},
		onStart(pokemon) {
			pokemon.abilityState.ending = false;
		},
	},
	colorchange: {
		inherit: true,
		onTryHit(target, source, move) {
			const type = move.type;
			if (source !== target && target.isActive && type !== '???' && !target.hasType(type)) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');
			}
		},
		onFoeBeforeMove(attacker, defender, move) {
			let type = move.type;
			let item = attacker.getItem();
			if (move.id === 'judgment' && attacker.hasAbility('multitype')) {
				type = attacker.species.types[0];
			}
			if ((move.id === 'fling' || move.id === 'judgment') && item.onPlate) {
				type = item.onPlate;
			}
			if (attacker.hasAbility('normalize') && move.id !== 'judgment') {
				type = 'Normal';
			}
			if (move.id === 'hiddenpower') {
				type = attacker.hpType || 'Dark';
			}
			if (attacker.hasAbility('rockstar') && move.flags['sound']) {
				type = 'Rock';
			}
			if (move.id === 'weatherball') {
				switch (this.battle.weather) {
				case 'sunnyday':
				case 'desolateland':
					type = 'Fire';
					break;
				case 'raindance':
				case 'primordialsea':
					type = 'Water';
					break;
				case 'sandstorm':
					type = 'Rock';
					break;
				case 'hail':
				case 'snowscape':
					type = 'Ice';
					break;
				}
			}
			
			if (attacker !== defender && defender.isActive && type !== '???' && !defender.hasType(type)) {
				if (!defender.setType(type)) return false;
				this.add('-start', defender, 'typechange', type, '[from] ability: Color Change');
			}
		},
		onAfterMoveSecondary() {},
	},
	compoundeyes: {
		onSourceModifyAccuracyPriority: 9,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return accuracy * 1.3;
		},
		inherit: true,
	},
	cutecharm: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.addVolatile('attract', this.effectState.target);
				}
			}
		},
	},
	download: {
		inherit: true,
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.foes()) {
				if (target.volatiles.substitute) continue;
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({ spa: 1 });
			} else if (totalspd) {
				this.boost({ atk: 1 });
			}
		},
	},
	effectspore: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (damage && move.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
				const r = this.random(100);
				if (r < 10) {
					source.setStatus('slp', target);
				} else if (r < 20) {
					source.setStatus('par', target);
				} else if (r < 30) {
					source.setStatus('psn', target);
				}
			}
		},
	},
	flamebody: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('brn', target);
				}
			}
		},
	},
	flashfire: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (target.status === 'frz') {
					return;
				}
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyDamagePhase1(atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
	},
	flowergift: {
		inherit: true,
		onAllyModifyAtk(atk, pokemon) {
			if (!pokemon.hasAbility('flowergift') && this.field.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifyDef(def, pokemon) {
			if (pokemon.hasAbility('flowergift') && this.field.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpA(spa, pokemon) {
			if (!pokemon.hasAbility('flowergift') && this.field.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpD(spd, pokemon) {
			if (pokemon.hasAbility('flowergift') && this.field.isWeather('sunnyday')) {
				return this.chainModify(1.5);
			}
		},
		flags: { breakable: 1 },
	},
	forecast: {
		inherit: true,
		onStart(pokemon) {
			const item = pokemon.getItem();
			switch (item.id) {
			case 'damprock':
				this.field.setWeather('raindance');
				break;
				
			case 'heatrock':
				this.field.setWeather('sunnyday');
				break;
				
			case 'icyrock':
				this.field.setWeather('hail');
				break;
				
			case 'smoothrock':
				this.field.setWeather('sandstorm');
				break;
			}
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		flags: { notrace: 1 },
	},
	forewarn: {
		inherit: true,
		onStart(pokemon) {
			let warnMoves: Move[] = [];
			let warnBp = 1;
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 160;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [move];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push(move);
					}
				}
			}
			if (!warnMoves.length) return;
			const warnMove = this.sample(warnMoves);
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove);
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Forewarn', `[of] ${target}`);
			}
		},
	},
	frisk: {
		inherit: true,
		onStart(pokemon) {
			const target = pokemon.side.randomFoe();
			if (target?.item && !target.itemState.knockedOff) {
				this.add('-item', '', target.getItem().name, '[from] ability: Frisk', `[of] ${pokemon}`);
			}
		},
	},
	hustle: {
		inherit: true,
		onSourceModifyAccuracyPriority: 7,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return accuracy * 0.8;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Hustle', `[of] ${target}`);
			}
		},
	},
	hydration: {
		onWeather(target, source, effect) {
			if (effect.id === 'raindance' && target.status) {
				this.add('-activate', target, 'ability: Hydration');
				target.cureStatus();
			}
		},
		flags: { rollable: 1 },
		name: "Hydration",
		rating: 1.5,
		num: 93,
	},
	insomnia: {
		inherit: true,
		rating: 2.5,
	},
	intimidate: {
		inherit: true,
		onStart(pokemon) {
			const activated = pokemon.adjacentFoes().some(target => (
				!(target.volatiles['substitute'] || target.volatiles['substitutebroken']?.move === 'uturn')
			));

			if (!activated) {
				this.hint("In Gen 4, Intimidate does not activate if every target has a Substitute (or the Substitute was just broken by U-turn).", false, pokemon.side);
				return;
			}
			this.add('-ability', pokemon, 'Intimidate', 'boost');

			for (const target of pokemon.adjacentFoes()) {
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else if (target.volatiles['substitutebroken']?.move === 'uturn') {
					this.hint("In Gen 4, if U-turn breaks Substitute the incoming Intimidate does nothing.");
				} else {
					this.boost({ atk: -1 }, target, pokemon, null, true);
				}
			}
		},
	},
	leafguard: {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (effect && effect.id === 'rest') {
				// do nothing
			} else if (this.field.isWeather('sunnyday')) {
				return false;
			}
		},
	},
	liquidooze: {
		inherit: true,
		onSourceTryHeal(damage, target, source, effect) {
			let multDamage = damage * 3;
			this.debug(`Heal is occurring: ${target} <- ${source} :: ${effect.id}`);
			const canOoze = ['drain', 'leechseed', 'strengthsap'];
			if (canOoze.includes(effect.id) && this.activeMove?.id !== 'dreameater') {
				this.damage(multDamage);
				return 0;
			}
		},
	},
	magicguard: {
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (effect && effect.id === 'toxicspikes') {
				return false;
			}
		},
		flags: { rollable: 1 },
		name: "Magic Guard",
		rating: 4.5,
		num: 98,
	},
	minus: {
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('plus')) {
					return this.chainModify(1.5);
				}
			}
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('plus')) {
					return this.chainModify(1.5);
				}
			}
		},
		flags: { rollable: 1 },
		name: "Minus",
		rating: 0,
		num: 58,
	},
	naturalcure: {
		inherit: true,
		onCheckShow(pokemon) {},
		onSwitchOut(pokemon) {
			if (!pokemon.status || pokemon.status === 'fnt') return;

			// Because statused/unstatused pokemon are shown after every switch
			// in gen 3-4, Natural Cure's curing is always known to both players

			this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.clearStatus();
		},
	},
	overgrow: {
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			let moveType = move.type;
			let item = attacker.getItem();
			if (move.id === 'judgment' && attacker.hasAbility('multitype')) {
				moveType = attacker.species.types[0];
			}
			if ((move.id === 'fling' || move.id === 'judgment') && item.onPlate) {
				moveType = item.onPlate;
			}
			if (attacker.hasAbility('normalize') && move.id !== 'judgment') {
				moveType = 'Normal';
			}
			if (move.id === 'hiddenpower') {
				moveType = attacker.hpType || 'Dark';
			}
			if (attacker.hasAbility('rockstar') && move.flags['sound']) {
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
			
			if (moveType === 'Grass' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		flags: { rollable: 1 },
		name: "Overgrow",
		rating: 2,
		num: 65,
	},
	pickup: {
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move || source.switchFlag === true || !move.hitTargets || source.item || source.volatiles['gem'] ||
				move.id === 'fling' || move.category === 'Status') return;
			const hitTargets = move.hitTargets;
			this.speedSort(hitTargets);
			for (const pokemon of hitTargets) {
				if (pokemon !== source && move.flags['contact']) {
					const yourItem = pokemon.takeItem(source);
					if (!yourItem) continue;
					if (!source.setItem(yourItem)) {
						pokemon.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
						continue;
					}
					this.add('-item', source, yourItem, '[from] ability: Pickup', `[of] ${pokemon}`);
					return;
				}
			}
		},
		flags: { rollable: 1 },
		name: "Pickup",
		rating: 0,
		num: 53,
	},
	plus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('minus')) {
					return this.chainModify(1.5);
				}
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('minus')) {
					return this.chainModify(1.5);
				}
			}
		},
		flags: { rollable: 1 },
		name: "Plus",
		rating: 0,
		num: 57,
	},
	poisonpoint: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('psn', target);
				}
			}
		},
	},
	pressure: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP(target, source) {
			if (target === source) return;
			return 1;
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Pressure', `[of] ${target}`);
			}
		},
		flags: { rollable: 1 },
		name: "Pressure",
		rating: 1.5,
		num: 46,
	},
	roughskin: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (damage && move.flags['contact']) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
	},
	sandveil: {
		inherit: true,
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
	},
	serenegrace: {
		inherit: true,
		onModifyMove(move) {
			if (move.secondaries && move.id !== 'chatter') {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
					if (secondary.chance > 100) secondary.chance = 100;
				}
			}
		},
	},
	shedskin: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.status && this.randomChance(40, 100)) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
	},
	simple: {
		onModifyBoost(boosts) {
			let key: BoostID;
			for (key in boosts) {
				boosts[key]! *= 2;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Simple', `[of] ${target}`);
			}
		},
		flags: { breakable: 1, rollable: 1 },
		name: "Simple",
		rating: 4,
		num: 86,
	},
	snowcloak: {
		inherit: true,
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('hail')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
	},
	speedboost: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 3,
	},
	static: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('par', target);
				}
			}
		},
	},
	stickyhold: {
		inherit: true,
		onTakeItem(item, pokemon, source) {
			if ((source && source !== pokemon) || (this.activeMove && this.activeMove.id === 'knockoff')) {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
	},
	swarm: {
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			let moveType = move.type;
			let item = attacker.getItem();
			if (move.id === 'judgment' && attacker.hasAbility('multitype')) {
				moveType = attacker.species.types[0];
			}
			if ((move.id === 'fling' || move.id === 'judgment') && item.onPlate) {
				moveType = item.onPlate;
			}
			if (attacker.hasAbility('normalize') && move.id !== 'judgment') {
				moveType = 'Normal';
			}
			if (move.id === 'hiddenpower') {
				moveType = attacker.hpType || 'Dark';
			}
			if (attacker.hasAbility('rockstar') && move.flags['sound']) {
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
			
			if (moveType === 'Bug' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		flags: { rollable: 1 },
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	synchronize: {
		inherit: true,
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			let id: string = status.id;
			if (id === 'tox') id = 'tox';
			source.trySetStatus(id, target);
		},
	},
	tangledfeet: {
		inherit: true,
		onModifyAccuracyPriority: 6,
		onModifyAccuracy(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target?.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return accuracy * 0.5;
			}
		},
	},
	thickfat: {
		onSourceBasePowerPriority: 1,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1, rollable: 1 },
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	torrent: {
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			let moveType = move.type;
			let item = attacker.getItem();
			if (move.id === 'judgment' && attacker.hasAbility('multitype')) {
				moveType = attacker.species.types[0];
			}
			if ((move.id === 'fling' || move.id === 'judgment') && item.onPlate) {
				moveType = item.onPlate;
			}
			if (attacker.hasAbility('normalize') && move.id !== 'judgment') {
				moveType = 'Normal';
			}
			if (move.id === 'hiddenpower') {
				moveType = attacker.hpType || 'Dark';
			}
			if (attacker.hasAbility('rockstar') && move.flags['sound']) {
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
			
			if (moveType === 'Water' && attacker.hp <= attacker.maxhp / 2) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		flags: { rollable: 1 },
		name: "Torrent",
		rating: 2,
		num: 67,
	},
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;
			const target = pokemon.side.randomFoe();
			if (!target || target.fainted) return;
			const ability = target.getAbility();
			const bannedAbilities = ['forecast', 'multitype', 'trace'];
			if (bannedAbilities.includes(target.ability)) {
				return;
			}
			pokemon.setAbility(ability, target);
		},
		flags: { notrace: 1 },
	},
	unburden: {
		inherit: true,
		condition: {
			onModifySpe(spe, pokemon) {
				if ((!pokemon.item || pokemon.itemState.knockedOff) && !pokemon.ignoringAbility()) {
					return this.chainModify(2);
				}
			},
		},
	},
	vitalspirit: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Vital Spirit', `[of] ${target}`);
			}
		},
		rating: 2.5,
	},
	wonderguard: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle' || move.id === 'tossandturn') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0 || !target.runImmunity(move)) {
				this.add('-immune', target, '[from] ability: Wonder Guard');
				return null;
			}
		},
	},
	rebound: {
		inherit: true,
		onTryHitSide() {},
	},
	quickfeet: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (pokemon.status === 'par') {
				return this.chainModify(2);
			} else if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
	},
	ironfist: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify(1.3);
			}
		},
	},
	rivalry: {
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.5);
				}
			}
		},
		onSourceDamagingHit(damage, target, source, move) {
			if (this.randomChance(3, 10)) {
				source.addVolatile('attract', target);
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Rivalry', `[of] ${target}`);
			}
		},
		flags: { rollable: 1 },
		name: "Rivalry",
		rating: 0,
		num: 79,
	},
	guts: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Guts', `[of] ${target}`);
			}
		},
	},
	unaware: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Unaware', `[of] ${target}`);
			}
		},
	},
	anticipation: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Anticipation', `[of] ${target}`);
			}
		},
	},
	hugepower: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Huge Power', `[of] ${target}`);
			}
		},
	},
	purepower: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Pure Power', `[of] ${target}`);
			}
		},
	},
	rattled: {
		onDamagingHit(damage, target, source, move) {
			if (['Dark', 'Bug', 'Ghost'].includes(move.type)) {
				this.boost({ spe: 1 });
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Rattled', `[of] ${target}`);
				this.boost({ spe: 1 });
			}
		},
		flags: { rollable: 1 },
		name: "Rattled",
		rating: 1,
		num: -113,
	},
	truant: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Truant', `[of] ${target}`);
			}
		},
	},
	scrappy: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', `[of] ${target}`);
			}
		},
	},
	oblivious: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', `[of] ${target}`);
			}
		},
	},
	owntempo: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Own Tempo', `[of] ${target}`);
			}
		},
	},
	innerfocus: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', `[of] ${target}`);
			}
		},
	},
	reckless: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Reckless', `[of] ${target}`);
			}
		},
	},
	solarpower: {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
	},
	aftermath: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				this.damage(source.baseMaxhp / 4, source, target);
			}
		},
	},
	illuminate: {
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) {
			if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') {
				return this.chainModify(1.2);
			}
		},
		flags: { rollable: 1 },
		name: "Illuminate",
		rating: 0.5,
		num: 35,
	},
	steadfast: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.boost({ spe: 1 });
			}
		},
	},
	swiftswim: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.66);
			}
		},
	},
	chlorophyll: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.66);
			}
		},
	},
	suctioncups: {
		inherit: true,
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
	},
	slushrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				return this.chainModify(1.66);
			}
		},
		num: -100,
	},
	corrosion: {
		inherit: true,
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		num: -105,
	},
	sandforce: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.3);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.3);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		flags: { rollable: 1 },
		name: "Sand Force",
		rating: 2,
		num: -107,
	},
	flareboost: {
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) { 
			if (attacker.status === 'brn') {
				return this.chainModify(1.5);
			}
		},
		flags: { rollable: 1 },
		name: "Flare Boost",
		rating: 2,
		num: -111,
	},
	multiscale: {
		inherit: true,
		num: -101,
	},
	poisontouch: {
		inherit: true,
		num: -102,
	},
	defiant: {
		inherit: true,
		num: -103,
	},
	competitive: {
		inherit: true,
		num: -103,
	},
	sheerforce: {
		inherit: true,
		num: -104,
	},
	strongjaw: {
		inherit: true,
		num: -106,
	},
	magicbounce: {
		inherit: true,
		num: -108,
	},
	imposter: {
		inherit: true,
		num: -109,
	},
	megalauncher: {
		inherit: true,
		num: -110,
	},
	sharpness: {
		inherit: true,
		num: -112,
	},
	neutralizinggas: {
		inherit: true,
		num: -114,
	},
	drought: {
		inherit: true,
		onStart(source) {
			if (source.species.id === 'groudon' && source.item === 'redorb') return;
			let baseCastformActive = false;
			for (const mon of this.getAllActive()) {
				if (mon.isAlly(source)) continue;
				if (mon.species.id === 'castform') {
					baseCastformActive = true;
					break;
				}
			}
			if (baseCastformActive === false) {
				this.field.setWeather('sunnyday');
			} else {
				this.hint("Base form Castform prevents weather abilities from activating", true);
			}
		},
	},
	drizzle: {
		inherit: true,
		onStart(source) {
			if (source.species.id === 'kyogre' && source.item === 'blueorb') return;
			let baseCastformActive = false;
			for (const mon of this.getAllActive()) {
				if (mon.isAlly(source)) continue;
				if (mon.species.id === 'castform') {
					baseCastformActive = true;
					break;
				}
			}
			if (baseCastformActive === false) {
				this.field.setWeather('raindance');
			} else {
				this.hint("Base form Castform prevents weather abilities from activating", true);
			}
		},
	},
	sandstream: {
		inherit: true,
		onStart(source) {
			let baseCastformActive = false;
			for (const mon of this.getAllActive()) {
				if (mon.isAlly(source)) continue;
				if (mon.species.id === 'castform') {
					baseCastformActive = true;
					break;
				}
			}
			if (baseCastformActive === false) {
				this.field.setWeather('sandstorm');
			} else {
				this.hint("Base form Castform prevents weather abilities from activating", true);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
	},
	snowwarning: {
		inherit: true,
		onStart(source) {
			let baseCastformActive = false;
			for (const mon of this.getAllActive()) {
				if (mon.isAlly(source)) continue;
				if (mon.species.id === 'castform') {
					baseCastformActive = true;
					break;
				}
			}
			if (baseCastformActive === false) {
				this.field.setWeather('hail');
			} else {
				this.hint("Base form Castform prevents weather abilities from activating", true);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
	},
	slowstart: {
		inherit: true,
		condition: {
			duration: 5,
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
		flags: { rollable: 1 },
		name: "Slow Start",
		rating: -1,
		num: 112,
	},
};
