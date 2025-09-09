export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	acupressure: {
		inherit: true,
		flags: { snatch: 1, metronome: 1 },
		onHit(target) {
			if (target.volatiles['substitute']) {
				return false;
			}
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
	},
	aromatherapy: {
		inherit: true,
		onHit(target, source) {
			this.add('-cureteam', source, '[from] move: Aromatherapy');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				ally.clearStatus();
			}
		},
	},
	aquaring: {
		inherit: true,
		flags: { metronome: 1 },
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
		},
		target: "adjacentAllyOrSelf",
	},
	assist: {
		inherit: true,
		onHit(target) {
			const moves = [];
			for (const pokemon of target.side.pokemon) {
				if (pokemon === target) continue;
				for (const moveSlot of pokemon.moveSlots) {
					const moveid = moveSlot.id;
					const move = this.dex.moves.get(moveid);
					if (
						move.flags['noassist'] ||
						(this.field.pseudoWeather['gravity'] && move.flags['gravity']) ||
						(target.volatiles['healblock'] && move.flags['heal'])
					) {
						continue;
					}
					moves.push(moveid);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) {
				return false;
			}
			this.actions.useMove(randomMove, target);
		},
	},
	bide: {
		inherit: true,
		condition: {
			duration: 3,
			onLockMove: 'bide',
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.add('-start', pokemon, 'move: Bide');
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move' || !source) return;
				this.effectState.totalDamage += damage;
				this.effectState.lastDamageSource = source;
			},
			onAfterSetStatus(status, pokemon) {
				if (status.id === 'slp' || status.id === 'frz') {
					pokemon.removeVolatile('bide');
				}
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					if (!this.effectState.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					target = this.effectState.lastDamageSource;
					if (!target) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						target = possibleTarget;
					}
					const moveData = {
						id: 'bide',
						name: "Bide",
						accuracy: true,
						damage: this.effectState.totalDamage * 2,
						category: "Physical",
						priority: 1,
						flags: { contact: 1, protect: 1 },
						ignoreImmunity: true,
						effectType: 'Move',
						type: 'Normal',
					} as unknown as ActiveMove;
					this.actions.tryMoveHit(target, pokemon, moveData);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
			onMoveAborted(pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
	},
	bind: {
		inherit: true,
		accuracy: 75,
	},
	bravebird: {
		inherit: true,
		recoil: [1, 3],
	},
	camouflage: {
		inherit: true,
		onHit(target) {
			if (target.hasType('Normal') || !target.setType('Normal')) return false;
			this.add('-start', target, 'typechange', 'Normal');
		},
	},
	conversion: {
		inherit: true,
		flags: { metronome: 1 },
		onHit(target) {
			const possibleTypes = target.moveSlots.map(moveSlot => {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.id !== 'conversion' && move.id !== 'curse' && !target.hasType(move.type)) {
					return move.type;
				}
				return '';
			}).filter(type => type);
			if (!possibleTypes.length) {
				return false;
			}
			const type = this.sample(possibleTypes);

			if (!target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
	},
	copycat: {
		inherit: true,
		onHit(pokemon) {
			const move: Move | ActiveMove | null = this.lastMove;
			if (!move) return;

			if (
				move.flags['failcopycat'] ||
				(this.field.pseudoWeather['gravity'] && move.flags['gravity']) ||
				(pokemon.volatiles['healblock'] && move.flags['heal'])
			) {
				return false;
			}
			this.actions.useMove(move.id, pokemon);
		},
	},
	cottonspore: {
		inherit: true,
		accuracy: 85,
	},
	curse: {
		inherit: true,
		flags: { metronome: 1 },
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = { boosts: { atk: 1, def: 1, spe: -1 } };
				move.target = move.nonGhostTarget!;
			} else if (target?.volatiles['substitute']) {
				delete move.volatileStatus;
				delete move.onHit;
			}
		},
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Curse', `[of] ${source}`);
			},
			onResidualOrder: 10,
			onResidualSubOrder: 8,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 2);
			},
		},
		type: "???",
	},
	disable: {
		inherit: true,
		accuracy: 100,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'disable',
		condition: {
			durationCallback() {
				return this.random(4, 8);
			},
			noCopy: true,
			onStart(pokemon) {
				if (!this.queue.willMove(pokemon)) {
					this.effectState.duration!++;
				}
				if (!pokemon.lastMove) {
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === pokemon.lastMove.id) {
						if (!moveSlot.pp) {
							return false;
						} else {
							this.add('-start', pokemon, 'Disable', moveSlot.move);
							this.effectState.move = pokemon.lastMove.id;
							return;
						}
					}
				}
				return false;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 13,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Disable');
			},
			onBeforeMovePriority: 7,
			onBeforeMove(attacker, defender, move) {
				if (move.id === this.effectState.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	doubleedge: {
		inherit: true,
		recoil: [1, 3],
	},
	embargo: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(pokemon) {
			if (pokemon.ability === 'multitype' || pokemon.item === 'griseousorb') {
				return false;
			}
		},
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Embargo');
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onResidualOrder: 10,
			onResidualSubOrder: 18,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Embargo');
			},
		},
	},
	encore: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1, failencore: 1 },
		volatileStatus: 'encore',
		condition: {
			durationCallback() {
				return this.random(4, 9);
			},
			onStart(target, source) {
				const moveSlot = target.lastMove ? target.getMoveData(target.lastMove.id) : null;
				if (!target.lastMove || target.lastMove.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = target.lastMove.id;
				this.add('-start', target, 'Encore');
			},
			onOverrideAction(pokemon) {
				return this.effectState.move;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 14,
			onResidual(target) {
				const moveSlot = target.getMoveData(this.effectState.move);
				if (moveSlot && moveSlot.pp <= 0) {
					// early termination if you run out of PP
					target.removeVolatile('encore');
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	endeavor: {
		inherit: true,
		onTry(pokemon, target) {
			if (pokemon.hp >= target.hp) {
				this.add('-fail', pokemon);
				return null;
			}
		},
	},
	flail: {
		inherit: true,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 64 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 6) {
				bp = 150;
			} else if (ratio < 13) {
				bp = 100;
			} else if (ratio < 22) {
				bp = 80;
			} else if (ratio < 43) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	flareblitz: {
		inherit: true,
		recoil: [1, 3],
	},
	foresight: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	gravity: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('rocheradius')) {
					return 4;
				}
				return 5;
			},
			onModifyWeight(weighthg) {
				return weighthg * 2;
			},
			onFieldStart(target, source, effect) {
				this.add('-fieldstart', 'move: Gravity');
				for (const pokemon of this.getAllActive()) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return this.chainModify([6840, 4096]);
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onFieldResidualOrder: 9,
			onFieldEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
	},
	growth: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) move.boosts = { atk: 2, spa: 2 };
		},
		boosts: {
			atk: 1,
			spa: 1,
		},
	},
	haze: {
		inherit: true,
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
				pokemon.removeVolatile('focusenergy');
			}
		},
	},
	healbell: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally.hasAbility('soundproof') && !this.suppressingAbility(ally)) {
					if (ally.isActive) this.add('-immune', ally, '[from] ability: Soundproof');
					continue;
				}
				ally.cureStatus(true);
			}
		},
	},
	healblock: {
		inherit: true,
		flags: { mirror: 1, metronome: 1 },
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (effect?.name === "Psychic Noise") {
					return 2;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
					return 7;
				}
				return 5;
			},
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Heal Block');
				source.moveThisTurnResult = true;
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['heal']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 20,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal(damage, target, source, effect) {
				if (effect && (effect.id === 'zpower' || (effect as Move).isZ)) return damage;
				if (source && target !== source && target.hp !== target.maxhp && effect.name === "Pollen Puff") {
					this.attrLastMove('[still]');
					// FIXME: Wrong error message, correct one not supported yet
					this.add('cant', source, 'move: Heal Block', effect);
					return null;
				}
				return false;
			},
			onRestart(target, source, effect) {
				if (effect?.name === 'Psychic Noise') return;

				this.add('-fail', target, 'move: Heal Block'); // Succeeds to supress downstream messages
				if (!source.moveThisTurnResult) {
					source.moveThisTurnResult = false;
				}
			},
		},
	},
	healingwish: {
		inherit: true,
		flags: { heal: 1, metronome: 1 },
		onAfterMove(pokemon) {
			pokemon.switchFlag = true;
		},
		condition: {
			duration: 1,
			onSwitchInPriority: -1,
			onSwitchIn(target) {
				if (target.hp > 0) {
					target.heal(target.maxhp);
					target.clearStatus();
					this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
					target.side.removeSlotCondition(target, 'healingwish');
					target.lastMove = this.lastMove;
				} else {
					target.switchFlag = true;
				}
			},
		},
	},
	imprison: {
		inherit: true,
		flags: { bypasssub: 1, metronome: 1 },
		onTryHit(pokemon) {
			for (const target of pokemon.foes()) {
				for (const move of pokemon.moves) {
					if (target.moves.includes(move)) return;
				}
			}
			return false;
		},
	},
	ingrain: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut(pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
	},
	jumpkick: {
		inherit: true,
		accuracy: 90,
		basePower: 100,
		pp: 10,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('Jump Kick'));
		},
	},
	lastresort: {
		inherit: true,
		basePower: 130,
	},
	leechseed: {
		inherit: true,
		accuracy: 95,
		condition: {
			onStart(target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 5,
			onResidual(pokemon) {
				const target = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				const damage = this.damage(pokemon.baseMaxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
		},
	},
	lightscreen: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamagePhase1(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (target.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Light Screen');
			},
			onSideResidualOrder: 2,
			onSideEnd(side) {
				this.add('-sideend', side, 'Light Screen');
			},
		},
	},
	lockon: {
		inherit: true,
		condition: {
			duration: 2,
			onSourceInvulnerabilityPriority: 1,
			onSourceInvulnerability(target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return 0;
			},
			onSourceAccuracy(accuracy, target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return true;
			},
		},
	},
	luckychant: {
		inherit: true,
		flags: { metronome: 1 },
		condition: {
			duration: 5,
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Lucky Chant');
			},
			onCriticalHit: false,
			onSideResidualOrder: 6,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Lucky Chant');
			},
			onModifyMove(move) {
				if (move.secondaries && move.id !== 'chatter') {
					this.debug('+10% secondary chance');
					for (const secondary of move.secondaries) {
						if (secondary.chance) secondary.chance += 10;
						if (secondary.chance > 100) secondary.chance = 100;
					}
				}
			},
		},
	},
	lunardance: {
		inherit: true,
		flags: { heal: 1, metronome: 1 },
		onAfterMove(pokemon) {
			pokemon.switchFlag = true;
		},
		condition: {
			duration: 1,
			onSideStart(side) {
				this.debug('Lunar Dance started on ' + side.name);
			},
			onSwitchInPriority: -1,
			onSwitchIn(target) {
				if (target.getSlot() !== this.effectState.sourceSlot) {
					return;
				}
				if (target.hp > 0) {
					target.heal(target.maxhp);
					target.clearStatus();
					for (const moveSlot of target.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					target.side.removeSlotCondition(target, 'lunardance');
					target.lastMove = this.lastMove;
				} else {
					target.switchFlag = true;
				}
			},
		},
	},
	magiccoat: {
		inherit: true,
		condition: {
			duration: 1,
			onTryHitPriority: 2,
			onTryHit(target, source, move) {
				if (target === source || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				target.removeVolatile('magiccoat');
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				this.actions.useMove(newMove, target, { target: source });
				return null;
			},
		},
	},
	mefirst: {
		inherit: true,
		condition: {
			duration: 1,
			onModifyDamagePhase2(damage) {
				return damage * 1.5;
			},
		},
	},
	metalburst: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	metronome: {
		inherit: true,
		flags: { noassist: 1, failcopycat: 1, nosleeptalk: 1, failmimic: 1 },
		onHit(pokemon) {
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !pokemon.moves.includes(move.id)) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome'] &&
				!(this.field.pseudoWeather['gravity'] && move.flags['gravity']) &&
				!(pokemon.volatiles['healblock'] && move.flags['heal'])
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			pokemon.side.lastSelectedMove = this.toID(randomMove);
			this.actions.useMove(randomMove, pokemon);
		},
	},
	mimic: {
		inherit: true,
		flags: {
			protect: 1, allyanim: 1, noassist: 1, failcopycat: 1, failencore: 1, failinstruct: 1, failmimic: 1,
		},
		onHit(target, source) {
			if (source.transformed || !target.lastMove || target.volatiles['substitute']) {
				return false;
			}
			if (target.lastMove.flags['failmimic'] || source.moves.includes(target.lastMove.id)) {
				return false;
			}
			const mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;
			const move = this.dex.moves.get(target.lastMove.id);
			source.moveSlots[mimicIndex] = {
				move: move.name,
				id: move.id,
				pp: 5,
				maxpp: move.pp * 8 / 5,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-activate', source, 'move: Mimic', move.name);
		},
	},
	minimize: {
		inherit: true,
		boosts: {
			evasion: 2,
		},
	},
	miracleeye: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	mirrormove: {
		inherit: true,
		onTryHit() {},
		onHit(pokemon) {
			const lastAttackedBy = pokemon.getLastAttackedBy();
			if (!lastAttackedBy?.source.lastMove || !lastAttackedBy.move) {
				return false;
			}
			const noMirror = [
				'acupressure', 'aromatherapy', 'assist', 'chatter', 'copycat', 'counter', 'curse', 'doomdesire', 'feint', 'focuspunch', 'futuresight', 'gravity', 'hail', 'haze', 'healbell', 'helpinghand', 'lightscreen', 'luckychant', 'magiccoat', 'mefirst', 'metronome', 'mimic', 'mirrorcoat', 'mirrormove', 'mist', 'mudsport', 'naturepower', 'perishsong', 'psychup', 'raindance', 'reflect', 'roleplay', 'safeguard', 'sandstorm', 'sketch', 'sleeptalk', 'snatch', 'spikes', 'spitup', 'stealthrock', 'struggle', 'sunnyday', 'tailwind', 'toxicspikes', 'transform', 'watersport', 'tossandturn',
			];
			if (noMirror.includes(lastAttackedBy.move) || !lastAttackedBy.source.hasMove(lastAttackedBy.move)) {
				return false;
			}
			this.actions.useMove(lastAttackedBy.move, pokemon);
		},
		target: "self",
	},
	mist: {
		inherit: true,
		condition: {
			duration: 5,
			onTryBoost(boost, target, source, effect) {
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (source && target !== source) {
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries) {
						this.add('-activate', target, 'move: Mist');
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Mist');
			},
			onSideResidualOrder: 3,
			onSideEnd(side) {
				this.add('-sideend', side, 'Mist');
			},
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	mudsport: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Mud Sport');
			},
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Electric') {
					this.debug('Mud Sport weaken');
					return this.chainModify(0.5);
				}
			},
		},
	},
	naturepower: {
		inherit: true,
		flags: { metronome: 1 },
		onHit(pokemon) {
			this.actions.useMove('triattack', pokemon);
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 7,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 3);
			},
		},
	},
	odorsleuth: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	outrage: {
		inherit: true,
		pp: 10,
	},
	payback: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (this.queue.willMove(target)) {
				return 50;
			}
			this.debug('BP doubled');
			return 100;
		},
	},
	payday: {
		inherit: true,
		onHit() {
			this.add('-fieldactivate', 'move: Pay Day');
		},
	},
	perishsong: {
		inherit: true,
		condition: {
			duration: 4,
			onEnd(target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
			onResidualOrder: 12,
			onResidual(pokemon) {
				const duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, `perish${duration}`);
			},
		},
		flags: { sound: 1, distance: 1, bypasssub: 1, metronome: 1 },
	},
	powertrick: {
		inherit: true,
		flags: { metronome: 1 },
	},
	psychup: {
		inherit: true,
		flags: { snatch: 1, bypasssub: 1, metronome: 1 },
	},
	pursuit: {
		inherit: true,
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				for (const source of this.effectState.sources) {
					if (!this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('pursuit', source, source.getLocOf(pokemon));
				}
			},
		},
	},
	rapidspin: {
		inherit: true,
		basePower: 50,
		self: {
			onHit(pokemon) {
				if (pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
	},
	recycle: {
		inherit: true,
		flags: { metronome: 1 },
	},
	reflect: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamagePhase1(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates && move.id !== 'focuspunch') {
						this.debug('Reflect weaken');
						if (target.alliesAndSelf().length > 1) return this.chainModify(2, 3);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onSideResidualOrder: 1,
			onSideEnd(side) {
				this.add('-sideend', side, 'Reflect');
			},
		},
	},
	reversal: {
		inherit: true,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 64 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 6) {
				bp = 150;
			} else if (ratio < 13) {
				bp = 100;
			} else if (ratio < 22) {
				bp = 80;
			} else if (ratio < 43) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	roar: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
	},
	roleplay: {
		inherit: true,
		onTryHit(target, source) {
			if (target.ability === source.ability || source.hasItem('griseousorb')) return false;
			if (target.getAbility().flags['failroleplay'] || source.ability === 'multitype') {
				return false;
			}
		},
	},
	safeguard: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Safeguard');
					return 7;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.id === 'yawn') return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (target !== source) {
					this.debug('interrupting setStatus');
					if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Safeguard');
					}
					return null;
				}
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
					return null;
				}
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-sidestart', side, 'Safeguard', '[persistent]');
				} else {
					this.add('-sidestart', side, 'Safeguard');
				}
			},
			onSideResidualOrder: 4,
			onSideEnd(side) {
				this.add('-sideend', side, 'Safeguard');
			},
		},
	},
	secretpower: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'par',
		},
	},
	sketch: {
		inherit: true,
		flags: {
			bypasssub: 1, allyanim: 1, failencore: 1, noassist: 1,
			failcopycat: 1, failinstruct: 1, failmimic: 1, nosketch: 1,
		},
		onHit(target, source) {
			if (source.transformed || !target.lastMove || target.volatiles['substitute']) {
				return false;
			}
			if (target.lastMove.flags['nosketch'] || source.moves.includes(target.lastMove.id)) {
				return false;
			}
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			const move = this.dex.moves.get(target.lastMove.id);
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				disabled: false,
				used: false,
			};
			source.moveSlots[sketchIndex] = sketchedMove;
			source.baseMoveSlots[sketchIndex] = sketchedMove;
			this.add('-activate', source, 'move: Mimic', move.name);
		},
	},
	skillswap: {
		inherit: true,
		onHit(target, source) {
			const targetAbility = target.ability;
			const sourceAbility = source.ability;
			if (targetAbility === sourceAbility || source.hasItem('griseousorb') || target.hasItem('griseousorb')) {
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap');
			source.setAbility(targetAbility);
			target.setAbility(sourceAbility);
		},
	},
	sleeptalk: {
		inherit: true,
		onTryHit(pokemon) {
			return !pokemon.volatiles['choicelock'] && !pokemon.volatiles['encore'];
		},
	},
	snatch: {
		inherit: true,
		flags: { bypasssub: 1, noassist: 1, failcopycat: 1 },
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'Snatch');
			},
			onAnyPrepareHitPriority: -1,
			onAnyPrepareHit(source, target, move) {
				const snatchUser = this.effectState.source;
				if (snatchUser.isSkyDropped()) return;
				if (!move || move.isZ || move.isMax || !move.flags['snatch']) {
					return;
				}
				snatchUser.removeVolatile('snatch');
				this.add('-activate', snatchUser, 'move: Snatch', `[of] ${source}`);
				if (this.actions.useMove(move.id, snatchUser)) {
					snatchUser.deductPP('snatch');
				}
				return null;
			},
		},
	},
	spikes: {
		inherit: true,
		flags: { metronome: 1, mustpressure: 1 },
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	stealthrock: {
		inherit: true,
		flags: { metronome: 1, mustpressure: 1 },
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				let rockDamage = pokemon.maxhp * 2 ** typeMod / 8;
				rockDamage = rockDamage * 3 / 4;
				this.damage(rockDamage);
			},
		},
	},
	struggle: {
		inherit: true,
		flags: {
			contact: 1, protect: 1, failencore: 1, failmefirst: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1, nosketch: 1,
		},
		onModifyMove(move) {
			move.type = '???';
		},
	},
	substitute: {
		inherit: true,
		condition: {
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectState.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub']) {
					return;
				}
				let damage = this.actions.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp as number;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.addVolatile('substitutebroken');
					if (target.volatiles['substitutebroken']) target.volatiles['substitutebroken'].move = move.id;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.ohko) this.add('-ohko');
				if (move.recoil && damage) {
					this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return this.HIT_SUBSTITUTE;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
	},
	suckerpunch: {
		inherit: true,
		onTry(source, target) {
			const action = this.queue.willMove(target);
			if (!action || action.choice !== 'move' || action.move.category === 'Status' || target.volatiles['mustrecharge']) {
				this.add('-fail', source);
				return null;
			}
		},
	},
	switcheroo: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target.hasAbility('multitype') || source.hasAbility('multitype')) return false;
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(pokemon.maxhp * 2 / 3);
			} else if (this.field.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(pokemon.baseMaxhp / 4);
			} else {
				this.heal(pokemon.baseMaxhp / 2);
			}
		},
	},
	tailglow: {
		inherit: true,
		boosts: {
			spa: 2,
		},
	},
	torment: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	toxicspikes: {
		inherit: true,
		flags: { metronome: 1, mustpressure: 1 },
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.volatiles['substitute'] || pokemon.hasType('Steel')) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	transform: {
		inherit: true,
		flags: { bypasssub: 1, metronome: 1, failencore: 1 },
	},
	trick: {
		inherit: true,
		onTryHit(target, source, move) {
			if (target.hasAbility('multitype') || source.hasAbility('multitype')) return false;
		},
	},
	trickroom: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('trickroom');
			},
			// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
			onFieldResidualOrder: 13,
			onFieldEnd() {
				this.add('-fieldend', 'move: Trick Room');
			},
		},
	},
	volttackle: {
		inherit: true,
		recoil: [1, 3],
	},
	watersport: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Water Sport');
			},
			onAnyBasePowerPriority: 3,
			onAnyBasePower(basePower, user, target, move) {
				if (move.type === 'Fire') {
					this.debug('Water Sport weaken');
					return this.chainModify(0.5);
				}
			},
		},
	},
	whirlwind: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
	wish: {
		inherit: true,
		flags: { heal: 1, metronome: 1 },
		slotCondition: 'Wish',
		condition: {
			duration: 2,
			onResidualOrder: 7,
			onEnd(target) {
				if (!target.fainted) {
					const source = this.effectState.source;
					const damage = this.heal(target.baseMaxhp / 2, target, target);
					if (damage) this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + source.name);
				}
			},
		},
	},
	woodhammer: {
		inherit: true,
		recoil: [1, 3],
	},
	worryseed: {
		inherit: true,
		onTryHit(pokemon) {
			const bannedAbilities = ['multitype', 'truant'];
			if (bannedAbilities.includes(pokemon.ability) || pokemon.hasItem('griseousorb')) {
				return false;
			}
		},
		target: "allAdjacent",
	},
	wringout: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const bp = Math.floor(target.hp * 120 / target.maxhp) + 1;
			this.debug(`BP for ${target.hp}/${target.maxhp} HP: ${bp}`);
			return bp;
		},
	},
	yawn: {
		inherit: true,
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onStart(target, source) {
				this.add('-start', target, 'move: Yawn', `[of] ${source}`);
			},
			onResidualOrder: 10,
			onResidualSubOrder: 19,
			onEnd(target) {
				this.add('-end', target, 'move: Yawn', '[silent]');
				target.trySetStatus('slp', this.effectState.source);
			},
		},
	},
	defog: {
		num: 432,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Defog",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ evasion: -1 });
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cool",
	},
	knockoff: {
		num: 282,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Knock Off",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!target.item || target.itemState.knockedOff) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source, move) {
			if (!target.item || target.itemState.knockedOff) return;
			if (target.ability === 'multitype') return;
			const item = target.getItem();
			
			if (item.id === 'toxicorb' && target.status === 'tox') {
				this.add('-curestatus', target, 'tox', `[from] move: ${move}`);
				target.clearStatus();
				this.hint("In Flucient Platinum, knocking off a Toxic Orb cures their status.", true);
			}
			
			if (this.runEvent('TakeItem', target, source, move, item)) {
				target.itemState.knockedOff = true;
				this.add('-enditem', target, item.name, '[from] move: Knock Off', `[of] ${source}`);
				this.hint("In Gens 3-4, Knock Off only makes the target's item unusable; it cannot obtain a new item.", true);
			}
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	rest: {
		inherit: true,
		onHit(target, source, move) {
			const result = target.setStatus('slp', source, move);
			if (!result) return result;
			target.statusState.time = 3;
			target.statusState.startTime = 3;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
			target.addVolatile("restflag");
		},
	},
	doubleslap: {
		inherit: true,
		accuracy: 90,
		basePower: 20,
	},
	poisonsting: {
		inherit: true,
		basePower: 35,
		pp: 20,
	},
	pinmissile: {
		inherit: true,
		accuracy: 90,
		basePower: 25,
	},
	flamethrower: {
		inherit: true,
		basePower: 90,
	},
	vinewhip: {
		inherit: true,
		basePower: 45,
		pp: 25,
	},
	tackle: {
		inherit: true,
		accuracy: 100,
		basePower: 40,
	},
	wrap: {
		inherit: true,
		accuracy: 90,
		basePower: 35,
	},
	thrash: {
		inherit: true,
		basePower: 120,
		pp: 10,
	},
	hydropump: {
		inherit: true,
		basePower: 110,
	},
	surf: {
		inherit: true,
		basePower: 90,
	},
	icebeam: {
		inherit: true,
		basePower: 90,
	},
	submission: {
		inherit: true,
		pp: 20,
	},
	absorb: {
		inherit: true,
		basePower: 30,
	},
	megadrain: {
		inherit: true,
		basePower: 60,
		pp: 10,
	},
	petaldance: {
		inherit: true,
		basePower: 120,
		pp: 10,
	},
	firespin: {
		inherit: true,
		accuracy: 85,
		basePower: 35,
	},
	thunderbolt: {
		inherit: true,
		basePower: 90,
	},
	toxic: {
		inherit: true,
		accuracy: 90,
	},
	fireblast: {
		inherit: true,
		basePower: 110,
	},
	clamp: {
		inherit: true,
		accuracy: 85,
		pp: 15,
	},
	skullbash: {
		inherit: true,
		basePower: 130,
		pp: 10,
	},
	highjumpkick: {
		inherit: true,
		accuracy: 85,
		basePower: 130,
		pp: 10,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
		},
	},
	glare: {
		inherit: true,
		accuracy: 100,
	},
	poisongas: {
		inherit: true,
		accuracy: 90,
		target: "allAdjacentFoes",
	},
	leechlife: {
		inherit: true,
		basePower: 80,
		pp: 10,
	},
	crabhammer: {
		inherit: true,
		accuracy: 90,
		basePower: 100,
	},
	snore: {
		inherit: true,
		basePower: 60,
		flags: { protect: 1, mirror: 1, sound: 1, metronome: 1 },
	},
	octazooka: {
		inherit: true,
		accuracy: 90,
		basePower: 100,
		critRatio: 2,
		secondary: {},
	},
	bonerush: {
		inherit: true,
		accuracy: 90,
	},
	gigadrain: {
		inherit: true,
		basePower: 80,
	},
	endure: {
		inherit: true,
		priority: 4,
	},
	falseswipe: {
		inherit: true,
		basePower: 60,
	},
	furycutter: {
		inherit: true,
		accuracy: 90,
		basePower: 30,
		condition: {
			duration: 2,
			onStart() {
				this.effectState.multiplier = 1;
			},
			onRestart() {
				if (this.effectState.multiplier < 16) {
					this.effectState.multiplier <<= 1;
				}
				this.effectState.duration = 2;
			},
		},
	},
	present: {
		inherit: true,
		accuracy: 100,
		onModifyMove(move, pokemon, target) {
			const rand = this.random(10);
			if (rand < 2) {
				move.heal = [1, 4];
				move.infiltrates = true;
			} else if (rand < 6) {
				move.basePower = 40;
			} else if (rand < 9) {
				move.basePower = 80;
			} else {
				move.basePower = 150;
			}
		},
		type: "Ice",
	},
	extremespeed: {
		inherit: true,
		priority: 2,
	},
	futuresight: {
		inherit: true,
		accuracy: 100,
		basePower: 120,
		pp: 10,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'futuresight',
				source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 100,
					basePower: 120,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, metronome: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Psychic',
				},
			});
			this.add('-start', source, 'move: Future Sight');
			return this.NOT_FAIL;
		},
	},
	beatup: {
		inherit: true,
		basePower: 15,
		pp: 5,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1, punch: 1 },
		basePowerCallback(pokemon, target, move) {
			if (!move.allies?.length) return null;
			return 15;
		},
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('beatup');
			move.type = 'Dark';
			move.category = 'Physical';
			move.allies = pokemon.side.pokemon.filter(ally => !ally.fainted && !ally.status);
			move.multihit = move.allies.length;
		},
		condition: {
			duration: 1,
			onModifyAtkPriority: -101,
			onModifyAtk(atk, pokemon, defender, move) {
				// https://www.smogon.com/forums/posts/8992145/
				// this.add('-activate', pokemon, 'move: Beat Up', '[of] ' + move.allies![0].name);
				this.event.modifier = 1;
				const attacker = move.allies!.shift()!;
				let attackStat = attacker.getStat('atk', false, true);
				const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
				let boost = pokemon.boosts['atk'];
				if (boost > 6) boost = 6;
				if (boost < -6) boost = -6;
				if (boost >= 0) {
					attackStat = Math.floor(attackStat * boostTable[boost]);
				} else {
					attackStat = Math.floor(attackStat / boostTable[-boost]);
				}
				
				switch (attacker.ability) {
				case 'hugepower':
				case 'purepower':
					attackStat *= 2;
					break;
				case 'hustle':
				case 'technician':
					attackStat = attackStat * 3 / 2;
					break;
				case 'guts':
					if (ally.status === 'brn') {
						attackStat = attackStat * 3 / 2;
					}
					break;
				case 'rivalry':
					if (attacker.gender && defender.gender) {
						if (attacker.gender === defender.gender) {
							attackStat = attackStat * 3 / 2;
						}
					}
					break;
				case 'ironfist':
					attackStat = attackStat * 13 / 10;
					break;
				}
				
				switch (attacker.item.id) {
				case 'loadedgloves':
					attackStat = attackStat * 6 / 5;
					break;
				case 'choiceband':
					attackStat = attackStat * 3 / 2;
					break;
				case 'blackglasses':
				case 'dreadplate':
					attackStat = attackStat * 12 / 10;
					break;
				case 'muscleband':
					attackStat = attackStat * 11 / 10;
					break;
				}
				return attackStat;
			},
		},
	},
	uproar: {
		inherit: true,
		basePower: 60,
		condition: {
			onStart(target) {
				this.add('-start', target, 'Uproar');
				// 3-6 turns
				this.effectState.duration = this.random(3, 7);
			},
			onResidual(target) {
				if (target.volatiles['throatchop']) {
					target.removeVolatile('uproar');
					return;
				}
				if (target.lastMove && target.lastMove.id === 'struggle' && target.lastMove.id === 'tossandturn') {
					// don't lock
					delete target.volatiles['uproar'];
				}
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 11,
			onEnd(target) {
				this.add('-end', target, 'Uproar');
			},
			onLockMove: 'uproar',
			onAnySetStatus(status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectState.target) {
						this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
					} else {
						this.add('-fail', pokemon, 'slp', '[from] Uproar');
					}
					return null;
				}
			},
		},
	},
	heatwave: {
		inherit: true,
		basePower: 95,
	},
	willowisp: {
		inherit: true,
		accuracy: 85,
	},
	whirlpool: {
		inherit: true,
		accuracy: 85,
		basePower: 35,
	},
	followme: {
		inherit: true,
		priority: 2,
	},
	armthrust: {
		inherit: true,
		basePower: 25,
	},
	lusterpurge: {
		inherit: true,
		basePower: 95,
	},
	mistball: {
		inherit: true,
		basePower: 95,
	},
	meteormash: {
		inherit: true,
		accuracy: 90,
		basePower: 90,
	},
	astonish: {
		inherit: true,
		basePower: 40,
	},
	aircutter: {
		inherit: true,
		basePower: 60,
	},
	overheat: {
		inherit: true,
		basePower: 130,
	},
	rocktomb: {
		inherit: true,
		accuracy: 95,
		basePower: 60,
		pp: 15,
	},
	sandtomb: {
		inherit: true,
		accuracy: 85,
		basePower: 35,
	},
	muddywater: {
		inherit: true,
		basePower: 90,
	},
	bulletseed: {
		inherit: true,
		basePower: 25,
	},
	iciclespear: {
		inherit: true,
		basePower: 25,
	},
	bounce: {
		inherit: true,
		accuracy: 90,
		basePower: 95,
	},
	poisontail: {
		num: 342,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Poison Tail",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'tox',
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	covet: {
		inherit: true,
		basePower: 60,
		pp: 25,
	},
	doomdesire: {
		inherit: true,
		accuracy: 100,
		basePower: 160,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'doomdesire',
				source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 100,
					basePower: 140,
					category: "Special",
					priority: 0,
					flags: { metronome: 1, futuremove: 1 },
					effectType: 'Move',
					type: 'Steel',
				},
			});
			this.add('-start', source, 'Doom Desire');
			return this.NOT_FAIL;
		},
	},
	wakeupslap: {
		inherit: true,
		basePower: 70,
	},
	aurasphere: {
		inherit: true,
		basePower: 95,
		pp: 10,
	},
	wavecrash: {
		inherit: true,
		basePower: 110,
	},
	airslash: {
		inherit: true,
		accuracy: 100,
		pp: 15,
	},
	powergem: {
		inherit: true,
		basePower: 80,
	},
	drainpunch: {
		inherit: true,
		basePower: 75,
		pp: 10,
	},
	energyball: {
		inherit: true,
		basePower: 90,
	},
	rockclimb: {
		inherit: true,
		basePower: 70,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		type: "Rock",
	},
	dracometeor: {
		inherit: true,
		basePower: 130,
	},
	leafstorm: {
		inherit: true,
		basePower: 130,
	},
	chatter: {
		inherit: true,
		basePower: 70,
		secondary: {
			chance: 31,
			volatileStatus: 'confusion',
		},
	},
	darkvoid: {
		inherit: true,
		accuracy: 50,
	},
	rocksmash: {
		inherit: true,
		basePower: 60,
	},
	aeroblast: {
		num: 177,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Aeroblast",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
		drain: [1, 2],
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	spiderweb: {
		num: 169,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Spider Web",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	chargebeam: {
		inherit: true,
		accuracy: 85,
		basePower: 60,
		pp: 15,
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
	},
	gunkshot: {
		inherit: true,
		accuracy: 80,
	},
	poisonfang: {
		inherit: true,
		basePower: 60,
		secondary: {
			chance: 50,
			status: 'tox',
		},
	},
	magmastorm: {
		inherit: true,
		accuracy: 75,
		basePower: 100,
	},
	facade: {
		inherit: true,
		onBasePower(basePower, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2);
			}
		},
	},
	stringshot: {
		inherit: true,
		boosts: {
			spe: -2,
		},
	},
	teleport: {
		num: 100,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Teleport",
		pp: 20,
		priority: 0,
		flags: { metronome: 1 },
		onTry(source) {
			return !!this.canSwitch(source.side);
		},
		selfSwitch: true,
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'heal' },
		contestType: "Cool",
	},
	roaroftime: {
		inherit: true,
		basePower: 200,
	},
	focuspunch: {
		inherit: true,
		accuracy: true,
		basePower: 160,
		priorityChargeCallback() {},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback() {},
		onTry(pokemon) {
			if (pokemon.volatiles['focuspunch']?.lostFocus) {
				this.attrLastMove('[still]');
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return null;
			}
		},
	},
	spore: {
		inherit: true,
		accuracy: 90,
	},
	hiddenpower: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		isNonstandard: "Past",
		name: "Hidden Power",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	selfdestruct: {
		num: 120,
		accuracy: 100,
		basePower: 200,
		category: "Physical",
		name: "Self-Destruct",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		selfdestruct: "always",
		secondary: null,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Beautiful",
	},
	explosion: {
		num: 153,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		name: "Explosion",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		selfdestruct: "always",
		secondary: null,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Beautiful",
	},
	roost: {
		inherit: true,
		pp: 5,
	},
	slackoff: {
		inherit: true,
		pp: 5,
	},
	weatherball: {
		inherit: true,
		basePower: 60,
		type: "Flying",
	},
	magnetrise: {
		inherit: true,
		flags: { gravity: 1, metronome: 1 },
		volatileStatus: 'magnetrise',
		onModifyPriority(priority, pokemon, target, move) {
			if (pokemon.hasAbility('magnetpull')) {
				this.add('-activate', pokemon, 'ability: Magnet Pull');
				return priority + 1;
			}
		},
		condition: {
			duration: 5,
			onStart(target) {
				const source = this.effectState.source;
				if (source !== target && !(target.hasType('Rock') || target.hasType('Electric') || target.hasType('Steel'))) return false;
				if (target.volatiles['ingrain'] || target.ability === 'levitate') return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 10,
			onResidualSubOrder: 16,
			onEnd(target) {
				this.add('-end', target, 'Magnet Rise');
			},
		},
		target: "allies",
	},
	meditate: {
		inherit: true,
		volatileStatus: 'meditate',
		condition: {
			onStart(target, source, effect) {
				if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', target, 'move: Meditate', '[silent]');
				} else {
					this.add('-start', target, 'move: Meditate');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + 1;
			},
		},
	},
	crosspoison: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'psn',
		},
	},
	spikecannon: {
		inherit: true,
		basePower: 15,
		pp: 10,
		onAfterMove(pokemon, target, move) {
			if (!move.hasSheerForce && pokemon.hp) {
				for (const side of pokemon.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
					if (move.multihit === 5) {
						side.addSideCondition('spikes');
					}
				}
			}
		},
	},
	judgment: {
		inherit: true,
		basePower: 120,
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
				move.category = 'Physical';
			}
		},
	},
	howl: {
		inherit: true,
		flags: { snatch: 1, sound: 1, metronome: 1 },
		boosts: {
			atk: 1,
		},
		target: "allies",
	},
	solarbeam: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			this.boost({ spa: 1 }, attacker);
			return null;
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('webmaster')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	tailwind: {
		inherit: true,
		pp: 15,
		condition: {
			duration: 4,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
					return 5;
				}
				return 4;
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-sidestart', side, 'move: Tailwind', '[persistent]');
				} else {
					this.add('-sidestart', side, 'move: Tailwind');
				}
			},
			onModifySpe(spe) {
				return spe * 2;
			},
			onSideResidualOrder: 5,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Tailwind');
			},
		},
	},
	fakeout: {
		inherit: true,
		priority: 3,
	},
	batonpass: {
		inherit: true,
		pp: 20,
	},
	triplekick: {
		inherit: true,
		pp: 20,
	},
	sacredfire: {
		inherit: true,
		accuracy: 90,
	},
	detect: {
		inherit: true,
		priority: 4,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is NOT reset
					if (source.volatiles['lockedmove'].trueDuration >= 2) {
						source.volatiles['lockedmove'].duration = 2;
					}
				}
				return null;
			},
		},
	},
	protect: {
		inherit: true,
		priority: 4,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is NOT reset
					if (source.volatiles['lockedmove'].trueDuration >= 2) {
						source.volatiles['lockedmove'].duration = 2;
					}
				}
				return null;
			},
		},
	},
	block: {
		inherit: true,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
	},
	waterspout: {
		inherit: true,
		basePower: 140,
	},
	rockblast: {
		inherit: true,
		accuracy: 90,
	},
	destinybond: {
		inherit: true,
		onPrepareHit(pokemon) {
			return !pokemon.removeVolatile('destinybond');
		},
	},
	feint: {
		num: 364,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Feint",
		pp: 10,
		priority: 2,
		flags: { mirror: 1, noassist: 1, failcopycat: 1 },
		onBasePower(basePower, pokemon) {
			if (target.volatiles['protect']) {
				this.debug('double power');
				return this.chainModify(2);
			}
		},
		breaksProtect: true,
		// Breaking protection implemented in scripts.js
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	assurance: {
		inherit: true,
		basePower: 60,
	},
	taunt: {
		inherit: true,
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		condition: {
			durationCallback() {
				return 4;
			},
			onStart(target) {
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 10,
			onResidualSubOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).category === 'Status') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove(attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
	},
	crushgrip: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const bp = Math.floor(target.hp * 160 / target.maxhp) + 1;
			this.debug(`BP for ${target.hp}/${target.maxhp} HP: ${bp}`);
			return bp;
		},
	},
	scaryface: {
		inherit: true,
		accuracy: 100,
	},
	lowkick: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			let bp;
			if (targetWeight >= 2000) {
				bp = 150;
			} else if (targetWeight >= 1000) {
				bp = 100;
			} else if (targetWeight >= 500) {
				bp = 80;
			} else if (targetWeight >= 250) {
				bp = 60;
			} else if (targetWeight >= 100) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	grassknot: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			let bp;
			if (targetWeight >= 2000) {
				bp = 150;
			} else if (targetWeight >= 1000) {
				bp = 100;
			} else if (targetWeight >= 500) {
				bp = 80;
			} else if (targetWeight >= 250) {
				bp = 60;
			} else if (targetWeight >= 100) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
	},
	steelwing: {
		inherit: true,
		accuracy: 95,
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	spitup: {
		inherit: true,
		basePowerCallback(pokemon) {
			if (!pokemon.volatiles['stockpile']?.layers) return false;
			return pokemon.volatiles['stockpile'].layers * 120;
		},
		onAfterMove(pokemon) {
			this.boost({ def: -1, spd: -1 }, pokemon, pokemon);
			pokemon.volatiles['stockpile'].layers -= 2;
			if (pokemon.volatiles['stockpile']?.layers <= 0) pokemon.removeVolatile('stockpile');
			this.add('-start', target, 'stockpile' + pokemon.volatiles['stockpile'].layers);
		},
	},
	swallow: {
		inherit: true,
		onTry(source) {
			return !!source.volatiles['stockpile'];
		},
		onHit(pokemon) {
			const layers = pokemon.volatiles['stockpile']?.layers || 1;
			const healAmount = [0.25, 0.5, 1];
			const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[layers - 1]));
			if (!success) this.add('-fail', pokemon, 'heal');
			pokemon.volatiles['stockpile'].layers -= 2;
			if (pokemon.volatiles['stockpile']?.layers <= 0) pokemon.removeVolatile('stockpile');
			this.add('-start', target, 'stockpile' + pokemon.volatiles['stockpile'].layers);
			return success || this.NOT_FAIL;
		},
	},
	stockpile: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(target) {
				this.effectState.layers = 1;
				this.effectState.def = 0;
				this.effectState.spd = 0;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onRestart(target) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const curDef = target.boosts.def;
				const curSpD = target.boosts.spd;
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onEnd(target) {
				this.add('-end', target, 'Stockpile');
			},
		},
	},
	brickbreak: {
		inherit: true,
		onTryHit(pokemon, target, move) {
			// will shatter screens through sub, before you hit
			move.basePower = move.basePower * 3 / 2;
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
	},
	eggbomb: {
		inherit: true,
		accuracy: 85,
	},
	dig: {
		inherit: true,
		accuracy: 95,
		basePower: 100,
	},
	dive: {
		inherit: true,
		accuracy: 95,
		basePower: 100,
	},
	fly: {
		inherit: true,
		basePower: 110,
	},
	shadowforce: {
		inherit: true,
		accuracy: 95,
		basePower: 130,
	},
	dreameater: {
		inherit: true,
		basePower: 160,
		onTryImmunity(target) {
			return target.status === 'slp' && !target.volatiles['substitute'];
		},
	},
	spite: {
		inherit: true,
		onHit(target) {
			let move: Move | ActiveMove | null = target.lastMove;
			if (!move || move.isZ) return false;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

			const ppDeducted = target.deductPP(move.id, this.random(4, 7));
			if (!ppDeducted) return false;
			this.add("-activate", target, 'move: Spite', move.name, ppDeducted);
		},
		flags: { protect: 1, mirror: 1, bypasssub: 1, metronome: 1 },
	},
};
