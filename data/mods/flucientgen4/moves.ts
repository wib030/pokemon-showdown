export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	inherit: 'gen4',
	knockoff: {
		inherit: true,
		basePower: 65,
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
			if (item === 'toxicorb' && (target.status === 'psn' || target.status === 'tox'))
			{
				target.cureStatus();
			}
			
			if (this.runEvent('TakeItem', target, source, move, item)) {
				target.itemState.knockedOff = true;
				this.add('-enditem', target, item.name, '[from] move: Knock Off', `[of] ${source}`);
				this.hint("In Gens 3-4, Knock Off only makes the target's item unusable; it cannot obtain a new item.", true);
			}
		},
	},
};
