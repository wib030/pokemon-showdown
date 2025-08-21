export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	inherit: 'gen4',
	quickclaw: {
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === "Status" && pokemon.hasAbility("myceliummight")) return;
			if (priority <= 0 && this.randomChance(1, 10)) {
				this.add('-activate', pokemon, 'item: Quick Claw');
				return 0.1;
			}
		},
		name: "Quick Claw",
		spritenum: 373,
		fling: {
			basePower: 80,
		},
		num: 217,
		gen: 2,
	},
	zoomlens: {
		inherit: true,
		onSourceModifyAccuracyPriority: 4,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.3;
			}
		},
	},
	metronome: {
		inherit: true,
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
	griseousorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.species.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	adamantorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && user.species.name === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	lustrousorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && user.species.name === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
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
	brightpowder: {
		inherit: true,
		onModifyAccuracyPriority: 5,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy * 0.92;
		},
	},
};
