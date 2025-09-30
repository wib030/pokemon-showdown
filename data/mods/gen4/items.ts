export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	adamantorb: {
		inherit: true,
		fling: {
			basePower: 130,
			effect: function() {
				this.field.addPseudoWeather('trickroom');
			},
		},
		onBasePower(basePower, user, target, move) {
			if (move && user.species.name === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	bigroot: {
		inherit: true,
		fling: {
			basePower: 30,
			volatileStatus: 'ingrain',
		},
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring'];
			if (heals.includes(effect.id)) {
				return Math.floor(damage * 1.3);
			}
		},
	},
	blacksludge: {
		inherit: true,
		fling: {
			basePower: 60,
			status: 'psn',
		},
		onResidualOrder: 10,
		onResidualSubOrder: 4,
	},
	brightpowder: {
		inherit: true,
		onModifyAccuracyPriority: 5,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy * 0.92;
		},
	},
	choiceband: {
		inherit: true,
		onStart() {},
		onModifyMove() {},
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	choicescarf: {
		inherit: true,
		onStart() {},
		onModifyMove() {},
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	choicespecs: {
		inherit: true,
		onStart() {},
		onModifyMove() {},
		onAfterMove(pokemon) {
			pokemon.addVolatile('choicelock');
		},
	},
	chopleberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.causedCrashDamage) return damage;
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	custapberry: {
		inherit: true,
		onFractionalPriority() {},
		onBeforeTurn(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.ability === 'gluttony')) {
				const action = this.queue.willMove(pokemon);
				if (!action) return;
				this.queue.insertChoice({
					choice: 'event',
					event: 'Custap',
					priority: action.priority + 0.1,
					pokemon: action.pokemon,
					move: action.move,
					targetLoc: action.targetLoc,
				});
			}
		},
		onCustap(pokemon) {
			const action = this.queue.willMove(pokemon);
			this.debug(`custap action: ${action?.moveid}`);
			if (action && pokemon.eatItem()) {
				this.queue.cancelAction(pokemon);
				this.add('-message', "Custap Berry activated.");
				this.runAction(action);
			}
		},
	},
	deepseascale: {
		inherit: true,
		fling: {
			basePower: 60,
		},
		onModifySpD(spd, pokemon) {
			if (pokemon.species.name === 'Clamperl') {
				return this.chainModify(2);
			}
		},
	},
	deepseatooth: {
		inherit: true,
		onModifySpA(spa, pokemon) {
			if (pokemon.species.name === 'Clamperl') {
				return this.chainModify(2);
			}
		},
	},
	dracoplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	dreadplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	earthplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	fastball: {
		inherit: true,
		isNonstandard: null,
	},
	fistplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	flameorb: {
		inherit: true,
		fling: {
			basePower: 70,
			status: 'brn',
		},
		onResidualOrder: 10,
		onResidualSubOrder: 20,
	},
	flameplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	griseousorb: {
		inherit: true,
		fling: {
			basePower: 130,
			volatileStatus: 'curse',
			effect: function(target, source) {
				this.directDamage(source.maxhp / 2, source, source);
			},
		},
		onBasePower(basePower, user, target, move) {
			if (user.species.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	heavyball: {
		inherit: true,
		isNonstandard: null,
	},
	icicleplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	insectplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	ironball: {
		inherit: true,
		onEffectiveness() {},
	},
	ironplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	kingsrock: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onModifyMove(move) {
			const affectedByKingsRock = [
				'aerialace', 'aeroblast', 'aircutter', 'airslash', 'aquajet', 'aquatail', 'armthrust', 'assurance', 'attackorder', 'aurasphere', 'avalanche', 'barrage', 'beatup', 'bide', 'bind', 'blastburn', 'bonerush', 'bonemerang', 'bounce', 'bravebird', 'brickbreak', 'brine', 'bugbite', 'bulletpunch', 'bulletseed', 'chargebeam', 'clamp', 'closecombat', 'cometpunch', 'crabhammer', 'crosschop', 'crosspoison', 'crushgrip', 'cut', 'darkpulse', 'dig', 'discharge', 'dive', 'doublehit', 'doublekick', 'doubleslap', 'doubleedge', 'dracometeor', 'dragonbreath', 'dragonclaw', 'dragonpulse', 'dragonrage', 'dragonrush', 'drainpunch', 'drillpeck', 'earthpower', 'earthquake', 'eggbomb', 'endeavor', 'eruption', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'firefang', 'firespin', 'flail', 'flashcannon', 'fly', 'forcepalm', 'frenzyplant', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigaimpact', 'grassknot', 'gunkshot', 'gust', 'gyroball', 'hammerarm', 'headsmash', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydrocannon', 'hydropump', 'hyperbeam', 'iceball', 'icefang', 'iceshard', 'iciclespear', 'ironhead', 'judgment', 'jumpkick', 'karatechop', 'lastresort', 'lavaplume', 'leafblade', 'leafstorm', 'lowkick', 'machpunch', 'magicalleaf', 'magmastorm', 'magnetbomb', 'magnitude', 'megakick', 'megapunch', 'megahorn', 'meteormash', 'mirrorshot', 'mudbomb', 'mudshot', 'muddywater', 'nightshade', 'nightslash', 'ominouswind', 'outrage', 'overheat', 'payday', 'payback', 'peck', 'petaldance', 'pinmissile', 'pluck', 'poisonjab', 'poisontail', 'pound', 'powergem', 'powerwhip', 'psychoboost', 'psychocut', 'psywave', 'punishment', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'revenge', 'reversal', 'roaroftime', 'rockblast', 'rockclimb', 'rockthrow', 'rockwrecker', 'rollingkick', 'rollout', 'sandtomb', 'scratch', 'seedbomb', 'seedflare', 'seismictoss', 'selfdestruct', 'shadowclaw', 'shadowforce', 'shadowpunch', 'shadowsneak', 'shockwave', 'signalbeam', 'silverwind', 'skullbash', 'skyattack', 'skyuppercut', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spacialrend', 'spikecannon', 'spitup', 'steelwing', 'stoneedge', 'strength', 'struggle', 'submission', 'suckerpunch', 'surf', 'swift', 'tackle', 'takedown', 'thrash', 'thunderfang', 'triplekick', 'trumpcard', 'twister', 'uturn', 'uproar', 'vacuumwave', 'visegrip', 'vinewhip', 'vitalthrow', 'volttackle', 'wakeupslap', 'watergun', 'waterpulse', 'waterfall', 'weatherball', 'whirlpool', 'wingattack', 'woodhammer', 'wrap', 'wringout', 'xscissor', 'zenheadbutt', 'tossandturn',
			];
			if (affectedByKingsRock.includes(move.id)) {
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
	},
	laxincense: {
		inherit: true,
		onModifyAccuracyPriority: 5,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('lax incense - decreasing accuracy');
			return accuracy * 0.9;
		},
	},
	leftovers: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 4,
	},
	levelball: {
		inherit: true,
		isNonstandard: null,
	},
	lifeorb: {
		inherit: true,
		fling: {
			basePower: 70,
		},
		onModifyDamage() {},
		onAfterMoveSecondarySelf() {},
		onBasePower(basePower, user, target) {
			if (!target.volatiles['substitute']) {
				user.addVolatile('lifeorb');
			}
			return basePower;
		},
		onModifyDamagePhase2(damage, source, target, move) {
			if (!move.flags['futuremove']) return damage * 1.3;
		},
		condition: {
			duration: 1,
			onAfterMoveSecondarySelf(source, target, move) {
				if (move && move.effectType === 'Move' && source?.volatiles['lifeorb']) {
					this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
					source.removeVolatile('lifeorb');
				}
			},
		},
	},
	lightball: {
		inherit: true,
		fling: {
			basePower: 90,
			status: 'par',
		},
		onModifyAtk() {},
		onModifySpA() {},
		onBasePower(basePower, pokemon) {
			if (pokemon.species.name === 'Pikachu') {
				return this.chainModify(2);
			}
		},
	},
	loveball: {
		inherit: true,
		isNonstandard: null,
	},
	luckypunch: {
		inherit: true,
		fling: {
			basePower: 70,
		},
		onModifyCritRatio(critRatio, user) {
			if (user.species.name === 'Chansey') {
				return critRatio + 2;
			}
		},
	},
	lureball: {
		inherit: true,
		isNonstandard: null,
	},
	lustrousorb: {
		inherit: true,
		fling: {
			basePower: 130,
			effect: function() {
				this.field.addPseudoWeather('gravity');
			},
		},
		onBasePower(basePower, user, target, move) {
			if (move && user.species.name === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	meadowplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	mentalherb: {
		name: "Mental Herb",
		spritenum: 285,
		fling: {
			basePower: 10,
			effect(pokemon) {
				const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
				for (const firstCondition of conditions) {
					if (pokemon.volatiles[firstCondition]) {
						for (const secondCondition of conditions) {
							pokemon.removeVolatile(secondCondition);
							if (firstCondition === 'attract' && secondCondition === 'attract') {
								this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
							}
						}
						return;
					}
				}
			},
		},
		onUpdate(pokemon) {
			const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
			for (const firstCondition of conditions) {
				if (pokemon.volatiles[firstCondition]) {
					if (!pokemon.useItem()) return;
					for (const secondCondition of conditions) {
						pokemon.removeVolatile(secondCondition);
						if (firstCondition === 'attract' && secondCondition === 'attract') {
							this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
						}
					}
					return;
				}
			}
		},
		num: 219,
		gen: 3,
	},
	metronome: {
		inherit: true,
		fling: {
			basePower: 70,
		},
		condition: {
			onStart(pokemon) {
				this.effectState.numConsecutive = 0;
				this.effectState.lastMove = '';
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasItem('metronome')) {
					pokemon.removeVolatile('metronome');
					return;
				}
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamagePhase2(damage, source, target, move) {
				return damage * ((100 + (15 * this.effectState.numConsecutive)) / 100);
			},
		},
	},
	micleberry: {
		inherit: true,
		condition: {
			duration: 2,
			onSourceModifyAccuracyPriority: 3,
			onSourceModifyAccuracy(accuracy, target, source) {
				this.add('-enditem', source, 'Micle Berry');
				source.removeVolatile('micleberry');
				if (typeof accuracy === 'number') {
					return accuracy * 1.2;
				}
			},
		},
	},
	mindplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	moonball: {
		inherit: true,
		isNonstandard: null,
	},
	razorfang: {
		inherit: true,
		fling: {
			basePower: 90,
			volatileStatus: 'flinch',
		},
		onModifyMove(move) {
			const affectedByRazorFang = [
				'aerialace', 'aeroblast', 'aircutter', 'airslash', 'aquajet', 'aquatail', 'armthrust', 'assurance', 'attackorder', 'aurasphere', 'avalanche', 'barrage', 'beatup', 'bide', 'bind', 'blastburn', 'bonerush', 'bonemerang', 'bounce', 'bravebird', 'brickbreak', 'brine', 'bugbite', 'bulletpunch', 'bulletseed', 'chargebeam', 'clamp', 'closecombat', 'cometpunch', 'crabhammer', 'crosschop', 'crosspoison', 'crushgrip', 'cut', 'darkpulse', 'dig', 'discharge', 'dive', 'doublehit', 'doublekick', 'doubleslap', 'doubleedge', 'dracometeor', 'dragonbreath', 'dragonclaw', 'dragonpulse', 'dragonrage', 'dragonrush', 'drainpunch', 'drillpeck', 'earthpower', 'earthquake', 'eggbomb', 'endeavor', 'eruption', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'firefang', 'firespin', 'flail', 'flashcannon', 'fly', 'forcepalm', 'frenzyplant', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigaimpact', 'grassknot', 'gunkshot', 'gust', 'gyroball', 'hammerarm', 'headsmash', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydrocannon', 'hydropump', 'hyperbeam', 'iceball', 'icefang', 'iceshard', 'iciclespear', 'ironhead', 'judgment', 'jumpkick', 'karatechop', 'lastresort', 'lavaplume', 'leafblade', 'leafstorm', 'lowkick', 'machpunch', 'magicalleaf', 'magmastorm', 'magnetbomb', 'magnitude', 'megakick', 'megapunch', 'megahorn', 'meteormash', 'mirrorshot', 'mudbomb', 'mudshot', 'muddywater', 'nightshade', 'nightslash', 'ominouswind', 'outrage', 'overheat', 'payday', 'payback', 'peck', 'petaldance', 'pinmissile', 'pluck', 'poisonjab', 'poisontail', 'pound', 'powergem', 'powerwhip', 'psychoboost', 'psychocut', 'psywave', 'punishment', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'revenge', 'reversal', 'roaroftime', 'rockblast', 'rockclimb', 'rockthrow', 'rockwrecker', 'rollingkick', 'rollout', 'sandtomb', 'scratch', 'seedbomb', 'seedflare', 'seismictoss', 'selfdestruct', 'shadowclaw', 'shadowforce', 'shadowpunch', 'shadowsneak', 'shockwave', 'signalbeam', 'silverwind', 'skullbash', 'skyattack', 'skyuppercut', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spacialrend', 'spikecannon', 'spitup', 'steelwing', 'stoneedge', 'strength', 'struggle', 'submission', 'suckerpunch', 'surf', 'swift', 'tackle', 'takedown', 'thrash', 'thunderfang', 'triplekick', 'trumpcard', 'twister', 'uturn', 'uproar', 'vacuumwave', 'visegrip', 'vinewhip', 'vitalthrow', 'volttackle', 'wakeupslap', 'watergun', 'waterpulse', 'waterfall', 'weatherball', 'whirlpool', 'wingattack', 'woodhammer', 'wrap', 'wringout', 'xscissor', 'zenheadbutt', 'tossandturn',
			];
			if (affectedByRazorFang.includes(move.id)) {
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
	},
	skyplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	splashplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	spookyplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	sportball: {
		inherit: true,
		isNonstandard: null,
	},
	stick: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onModifyCritRatio(critRatio, user) {
			if (user.species.id === 'farfetchd') {
				return critRatio + 2;
			}
		},
	},
	stickybarb: {
		inherit: true,
		fling: {
			basePower: 100,
			volatileStatus: 'stickybarbchip',
		},
		onResidualOrder: 10,
		onResidualSubOrder: 20,
	},
	stoneplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	thickclub: {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.name === 'Cubone' || pokemon.species.name === 'Marowak') {
				return this.chainModify(2);
			}
		},
	},
	toxicorb: {
		inherit: true,
		fling: {
			basePower: 70,
			status: 'tox',
		},
		onResidualOrder: 10,
		onResidualSubOrder: 20,
	},
	toxicplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	widelens: {
		inherit: true,
		fling: {
			basePower: 60,
		},
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.1;
			}
		},
	},
	zapplate: {
		inherit: true,
		fling: {
			basePower: 90,
		},
		onTakeItem: true,
	},
	zoomlens: {
		inherit: true,
		fling: {
			basePower: 60,
		},
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.3;
			}
		},
	},
	silkscarf: {
		name: "Silk Scarf",
		spritenum: 444,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return this.chainModify(1.3);
			}
		},
		num: 251,
		gen: 3,
	},
	jabocaberry: {
		name: "Jaboca Berry",
		spritenum: 230,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Dragon",
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 2 : 3), source, target);
				}
			}
		},
		onEat() { },
		num: 211,
		gen: 4,
	},
	rowapberry: {
		name: "Rowap Berry",
		spritenum: 420,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Dark",
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 2 : 3), source, target);
				}
			}
		},
		onEat() { },
		num: 212,
		gen: 4,
	},
	liechiberry: {
		inherit: true,
		onEat(pokemon) {
			this.boost({ atk: 2 });
		},
	},
	ganlonberry: {
		inherit: true,
		onEat(pokemon) {
			this.boost({ def: 2 });
		},
	},
	petayaberry: {
		inherit: true,
		onEat(pokemon) {
			this.boost({ spa: 2 });
		},
	},
	apicotberry: {
		inherit: true,
		onEat(pokemon) {
			this.boost({ spd: 2 });
		},
	},
	salacberry: {
		inherit: true,
		onEat(pokemon) {
			this.boost({ spe: 2 });
		},
	},
	starfberry: {
		inherit: true,
		onEat(pokemon) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in pokemon.boosts) {
				if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
				
				const randomStat2 = this.sample(stats);
				const boost2: SparseBoostsTable = {};
				boost2[randomStat2] = 1;
				this.boost(boost2);
			}
		},
	},
	damprock: {
		inherit: true,
		fling: {
			basePower: 80,
			effect: function() {
				this.field.setWeather('raindance');
			},
		},
	},
	heatrock: {
		inherit: true,
		fling: {
			basePower: 80,
			effect: function() {
				this.field.setWeather('sunnyday');
			},
		},
	},
	smoothrock: {
		inherit: true,
		fling: {
			basePower: 80,
			effect: function() {
				this.field.setWeather('sandstorm');
			},
		},
	},
	icyrock: {
		inherit: true,
		fling: {
			basePower: 80,
			effect: function() {
				this.field.setWeather('hail');
			},
		},
	},
	firestone: {
		inherit: true,
		fling: {
			basePower: 80,
			status: 'brn',
		},
	},
	leafstone: {
		inherit: true,
		fling: {
			basePower: 80,
			effect: function() {
				this.add('-clearallboost');
				for (const pokemon of this.getAllActive()) {
					pokemon.clearBoosts();
				}
			},
		},
	},
	thunderstone: {
		inherit: true,
		fling: {
			basePower: 80,
			status: 'par',
		},
	},
	moonstone: {
		inherit: true,
		fling: {
			basePower: 80,
			effect: function(target, source, move) {
				this.actions.useMove('defog', source);
			},
		},
	},
	dawnstone: {
		inherit: true,
		fling: {
			basePower: 80,
			effect: function(target) {
				if (target.status === 'slp') target.cureStatus();
			},
		},
	},
	duskstone: {
		inherit: true,
		fling: {
			basePower: 80,
			volatileStatus: 'nightmare',
		},
	},
	shinystone: {
		inherit: true,
		fling: {
			basePower: 80,
			volatileStatus: 'confusion',
		},
	},
	souldew: {
		inherit: true,
		fling: {
			basePower: 100,
			volatileStatus: 'attract',
		},
	},
	powerbracer: {
		inherit: true,
		fling: {
			basePower: 90,
			effect: function(target, source, move) {
				this.boost({ atk: 1 }, source);
			},
		},
	},
	powerbelt: {
		inherit: true,
		fling: {
			basePower: 90,
			effect: function(target, source, move) {
				this.boost({ def: 1 }, source);
			},
		},
	},
	powerlens: {
		inherit: true,
		fling: {
			basePower: 90,
			effect: function(target, source, move) {
				this.boost({ spa: 1 }, source);
			},
		},
	},
	powerband: {
		inherit: true,
		fling: {
			basePower: 90,
			effect: function(target, source, move) {
				this.boost({ spd: 1 }, source);
			},
		},
	},
	poweranklet: {
		inherit: true,
		fling: {
			basePower: 90,
			effect: function(target, source, move) {
				this.boost({ spe: 1 }, source);
			},
		},
	},
	shellbell: {
		inherit: true,
		fling: {
			basePower: 40,
		},
	},
	twistedspoon: {
		inherit: true,
		fling: {
			basePower: 50,
		},
	},
	scopelens: {
		inherit: true,
		fling: {
			basePower: 60,
		},
	},
	dragonscale: {
		inherit: true,
		fling: {
			basePower: 60,
		},
	},
	sharpbeak: {
		inherit: true,
		fling: {
			basePower: 60,
		},
	},
	lightclay: {
		inherit: true,
		fling: {
			basePower: 60,
		},
	},
	upgrade: {
		inherit: true,
		fling: {
			basePower: 70,
		},
	},
	dubiousdisc: {
		inherit: true,
		fling: {
			basePower: 70,
		},
	},
	sunstone: {
		inherit: true,
		fling: {
			basePower: 80,
		},
	},
	waterstone: {
		inherit: true,
		fling: {
			basePower: 80,
		},
	},
	magnet: {
		inherit: true,
		fling: {
			basePower: 80,
		},
	},
	machobrace: {
		inherit: true,
		fling: {
			basePower: 90,
		},
	},
	protector: {
		inherit: true,
		fling: {
			basePower: 90,
		},
	},
	magmarizer: {
		inherit: true,
		fling: {
			basePower: 90,
		},
	},
	electirizer: {
		inherit: true,
		fling: {
			basePower: 90,
		},
	},
	razorclaw: {
		inherit: true,
		fling: {
			basePower: 90,
			volatileStatus: 'flinch',
		},
	},
	metalcoat: {
		inherit: true,
		fling: {
			basePower: 100,
		},
	},
	laggingtail: {
		inherit: true,
		fling: {
			basePower: 130,
		},
	},
	masterball: {
		inherit: true,
		fling: {
			basePower: 130,
		},
	},
	redcard: {
		inherit: true,
		fling: {
			basePower: 60,
		},
	},
};
