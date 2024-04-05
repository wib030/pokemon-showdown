"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var conditions_exports = {};
__export(conditions_exports, {
  Conditions: () => Conditions
});
module.exports = __toCommonJS(conditions_exports);
const Conditions = {
  brn: {
    inherit: true,
    onResidualOrder: 10,
    onResidualSubOrder: 6
  },
  par: {
    name: "par",
    effectType: "Status",
    onStart(target, source, sourceEffect) {
      if (sourceEffect && sourceEffect.effectType === "Ability") {
        this.add("-status", target, "par", "[from] ability: " + sourceEffect.name, "[of] " + source);
      } else {
        this.add("-status", target, "par");
      }
    },
    onModifySpe(spe, pokemon) {
      spe = this.finalModify(spe);
      if (!pokemon.hasAbility("quickfeet")) {
        spe = Math.floor(spe * 50 / 100);
      }
      return spe;
    },
    onBeforeMovePriority: 1,
    onBeforeMove(pokemon) {
      if (this.randomChance(1, 4)) {
        this.add("cant", pokemon, "par");
        return false;
      }
    }
  },
  slp: {
    name: "slp",
    effectType: "Status",
    onStart(target, source, sourceEffect) {
      if (sourceEffect && sourceEffect.effectType === "Ability") {
        this.add("-status", target, "slp", "[from] ability: " + sourceEffect.name, "[of] " + source);
      } else if (sourceEffect && sourceEffect.effectType === "Move") {
        this.add("-status", target, "slp", "[from] move: " + sourceEffect.name);
      } else {
        this.add("-status", target, "slp");
      }
      this.effectState.startTime = this.random(2, 5);
      this.effectState.time = this.effectState.startTime;
      if (target.removeVolatile("nightmare")) {
        this.add("-end", target, "Nightmare", "[silent]");
      }
    },
    onBeforeMovePriority: 10,
    onBeforeMove(pokemon, target, move) {
      if (pokemon.hasAbility("earlybird")) {
        pokemon.statusState.time--;
      }
      pokemon.statusState.time--;
      if (pokemon.statusState.time <= 0) {
        pokemon.cureStatus();
        return;
      }
      this.add("cant", pokemon, "slp");
      if (move.sleepUsable) {
        return;
      }
      return false;
    }
  },
  psn: {
    inherit: true,
    onResidualOrder: 10,
    onResidualSubOrder: 6
  },
  tox: {
    inherit: true,
    onResidualOrder: 10,
    onResidualSubOrder: 6
  },
  confusion: {
    name: "confusion",
    // this is a volatile status
    onStart(target, source, sourceEffect) {
      if (sourceEffect?.id === "lockedmove") {
        this.add("-start", target, "confusion", "[fatigue]");
      } else if (sourceEffect?.effectType === "Ability") {
        this.add("-start", target, "confusion", "[from] ability: " + sourceEffect.name, "[of] " + source);
      } else {
        this.add("-start", target, "confusion");
      }
      const min = sourceEffect?.id === "axekick" ? 3 : 2;
      this.effectState.time = this.random(min, 6);
    },
    onEnd(target) {
      this.add("-end", target, "confusion");
    },
    onBeforeMovePriority: 3,
    onBeforeMove(pokemon) {
      pokemon.volatiles["confusion"].time--;
      if (!pokemon.volatiles["confusion"].time) {
        pokemon.removeVolatile("confusion");
        return;
      }
      this.add("-activate", pokemon, "confusion");
      if (!this.randomChance(33, 100)) {
        return;
      }
      this.activeTarget = pokemon;
      const damage = this.actions.getConfusionDamage(pokemon, 40);
      if (typeof damage !== "number")
        throw new Error("Confusion damage not dealt");
      const activeMove = { id: this.toID("confused"), effectType: "Move", type: "???" };
      this.damage(damage, pokemon, pokemon, activeMove);
      return false;
    }
  },
  frz: {
    name: "frz",
    effectType: "Status",
    onStart(target, source, sourceEffect) {
      if (sourceEffect && sourceEffect.effectType === "Ability") {
        this.add("-status", target, "frz", "[from] ability: " + sourceEffect.name, "[of] " + source);
      } else {
        this.add("-status", target, "frz");
      }
      if (target.species.name === "Shaymin-Sky" && target.baseSpecies.baseSpecies === "Shaymin") {
        target.formeChange("Shaymin", this.effect, true);
      }
      this.effectState.startTime = this.random(2, 5);
      this.effectState.time = this.effectState.startTime;
    },
    onBeforeMovePriority: 10,
    onBeforeMove(pokemon, target, move) {
      if (move.flags["defrost"])
        return;
      pokemon.statusState.time--;
      if (pokemon.statusState.time <= 0) {
        pokemon.cureStatus();
        return;
      }
      this.add("cant", pokemon, "frz");
      return false;
    },
    onModifyMove(move, pokemon) {
      if (move.flags["defrost"]) {
        this.add("-curestatus", pokemon, "frz", "[from] move: " + move);
        pokemon.clearStatus();
      }
    },
    onAfterMoveSecondary(target, source, move) {
      if (move.thawsTarget) {
        target.cureStatus();
      }
    },
    onDamagingHit(damage, target, source, move) {
      if (move.type === "Fire" && move.category !== "Status") {
        target.cureStatus();
      }
    }
  },
  substitutebroken: {
    noCopy: true
  },
  trapped: {
    inherit: true,
    noCopy: false
  },
  trapper: {
    inherit: true,
    noCopy: false
  },
  partiallytrapped: {
    inherit: true,
    durationCallback(target, source) {
      if (source.hasItem("gripclaw"))
        return 6;
      return this.random(3, 7);
    },
    onResidualOrder: 10,
    onResidualSubOrder: 9
  },
  choicelock: {
    inherit: true,
    onStart(pokemon) {
      if (!pokemon.lastMove)
        return false;
      this.effectState.move = pokemon.lastMove.id;
    }
  },
  futuremove: {
    inherit: true,
    onResidualOrder: 11
  },
  stall: {
    // In gen 3-4, the chance of protect succeeding does not fall below 1/8.
    // See http://upokecenter.dreamhosters.com/dex/?lang=en&move=182
    inherit: true,
    counterMax: 8
  },
  raindance: {
    name: "RainDance",
    effectType: "Weather",
    duration: 5,
    durationCallback(source, effect) {
      if (source?.hasItem("damprock")) {
        return 8;
      }
      return 5;
    },
    onWeatherModifyDamage(damage, attacker, defender, move) {
      if (defender.hasItem("utilityumbrella"))
        return;
      if (move.type === "Water") {
        this.debug("rain water boost");
        return this.chainModify(1.3);
      }
      if (move.type === "Fire") {
        this.debug("rain fire suppress");
        return this.chainModify(0.7);
      }
    },
    onFieldStart(field, source, effect) {
      if (effect?.effectType === "Ability") {
        if (this.gen <= 5)
          this.effectState.duration = 0;
        this.add("-weather", "RainDance", "[from] ability: " + effect.name, "[of] " + source);
      } else {
        this.add("-weather", "RainDance");
      }
    },
    onFieldResidualOrder: 1,
    onFieldResidual() {
      this.add("-weather", "RainDance", "[upkeep]");
      this.eachEvent("Weather");
    },
    onFieldEnd() {
      this.add("-weather", "none");
    }
  },
  sunnyday: {
    name: "SunnyDay",
    effectType: "Weather",
    duration: 5,
    durationCallback(source, effect) {
      if (source?.hasItem("heatrock")) {
        return 8;
      }
      return 5;
    },
    onWeatherModifyDamage(damage, attacker, defender, move) {
      if (move.id === "hydrosteam" && !attacker.hasItem("utilityumbrella")) {
        this.debug("Sunny Day Hydro Steam boost");
        return this.chainModify(1.5);
      }
      if (defender.hasItem("utilityumbrella"))
        return;
      if (move.type === "Fire") {
        this.debug("Sunny Day fire boost");
        return this.chainModify(1.3);
      }
      if (move.type === "Water") {
        this.debug("Sunny Day water suppress");
        return this.chainModify(0.7);
      }
    },
    onFieldStart(battle, source, effect) {
      if (effect?.effectType === "Ability") {
        if (this.gen <= 5)
          this.effectState.duration = 0;
        this.add("-weather", "SunnyDay", "[from] ability: " + effect.name, "[of] " + source);
      } else {
        this.add("-weather", "SunnyDay");
      }
    },
    onImmunity(type, pokemon) {
      if (pokemon.hasItem("utilityumbrella"))
        return;
      if (type === "frz")
        return false;
    },
    onFieldResidualOrder: 1,
    onFieldResidual() {
      this.add("-weather", "SunnyDay", "[upkeep]");
      this.eachEvent("Weather");
    },
    onFieldEnd() {
      this.add("-weather", "none");
    }
  },
  sandstorm: {
    name: "Sandstorm",
    effectType: "Weather",
    duration: 5,
    durationCallback(source, effect) {
      if (source?.hasItem("smoothrock")) {
        return 8;
      }
      return 5;
    },
    // This should be applied directly to the stat before any of the other modifiers are chained
    // So we give it increased priority.
    onModifySpDPriority: 10,
    onModifySpD(spd, pokemon) {
      if (pokemon.hasType("Rock") && this.field.isWeather("sandstorm")) {
        return this.modify(spd, 1.5);
      }
    },
    onFieldStart(field, source, effect) {
      if (effect?.effectType === "Ability") {
        if (this.gen <= 5)
          this.effectState.duration = 0;
        this.add("-weather", "Sandstorm", "[from] ability: " + effect.name, "[of] " + source);
      } else {
        this.add("-weather", "Sandstorm");
      }
    },
    onFieldResidualOrder: 1,
    onFieldResidual() {
      this.add("-weather", "Sandstorm", "[upkeep]");
      if (this.field.isWeather("sandstorm"))
        this.eachEvent("Weather");
    },
    onWeather(target) {
      this.damage(target.baseMaxhp / 16);
    },
    onFieldEnd() {
      this.add("-weather", "none");
    }
  },
  hail: {
    name: "Hail",
    effectType: "Weather",
    duration: 5,
    durationCallback(source, effect) {
      if (source?.hasItem("icyrock")) {
        return 8;
      }
      return 5;
    },
    onModifyDefPriority: 10,
    onModifyDef(def, pokemon) {
      if (pokemon.hasType("Ice") && this.field.isWeather("hail")) {
        return this.modify(def, 1.5);
      }
    },
    onFieldStart(field, source, effect) {
      if (effect?.effectType === "Ability") {
        if (this.gen <= 5)
          this.effectState.duration = 0;
        this.add("-weather", "Hail", "[from] ability: " + effect.name, "[of] " + source);
      } else {
        this.add("-weather", "Hail");
      }
    },
    onFieldResidualOrder: 1,
    onFieldResidual() {
      this.add("-weather", "Hail", "[upkeep]");
      if (this.field.isWeather("hail"))
        this.eachEvent("Weather");
    },
    onWeather(target) {
      this.damage(target.baseMaxhp / 16);
    },
    onFieldEnd() {
      this.add("-weather", "none");
    }
  },
  // Arceus's true typing for all its formes is Normal, and it's only Multitype
  // that changes its type, but its formes are specified to be their corresponding
  // type in the Pokedex, so that needs to be overridden. Without Multitype it
  // starts as Normal type, but its type can be changed by other effects.
  // This is mainly relevant for Hackmons Cup and Balanced Hackmons.
  arceus: {
    name: "Arceus",
    onBeforeSwitchIn(pokemon) {
      pokemon.setType("Normal");
    },
    onSwitchIn(pokemon) {
      if (pokemon.ability === "multitype") {
        const item = pokemon.getItem();
        const targetForme = item?.onPlate ? "Arceus-" + item.onPlate : "Arceus";
        if (pokemon.species.name !== targetForme) {
          pokemon.formeChange(targetForme);
        }
      }
    }
  }
};
//# sourceMappingURL=conditions.js.map
