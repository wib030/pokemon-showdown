export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	milotic: {
		inherit: true,
		baseStats: {hp: 95, atk: 60, def: 79, spa: 110, spd: 125, spe: 81},
		evoType: 'levelExtra',
		evoCondition: 'with high Beauty',
	},
	rotomheat: {
		inherit: true,
		types: ["Electric", "Fire"],
		baseStats: {hp: 50, atk: 65, def: 107, spa: 115, spd: 107, spe: 96},
	},
	rotomwash: {
		inherit: true,
		types: ["Electric", "Water"],
		baseStats: {hp: 55, atk: 65, def: 117, spa: 105, spd: 107, spe: 91},
	},
	rotomfrost: {
		inherit: true,
		types: ["Electric", "Ice"],
		baseStats: {hp: 75, atk: 65, def: 117, spa: 120, spd: 107, spe: 91},
	},
	rotomfan: {
		inherit: true,
		types: ["Electric", "Flying"],
		baseStats: {hp: 50, atk: 65, def: 107, spa: 115, spd: 107, spe: 111},
	},
	rotommow: {
		inherit: true,
		types: ["Electric", "Grass"],
		baseStats: {hp: 50, atk: 65, def: 107, spa: 125, spd: 107, spe: 96},
	},
	crobat: {
		inherit: true,
		abilities: {0: "Speed Boost"},
	},
	dodrio: {
		inherit: true,
		baseStats: {hp: 80, atk: 110, def: 80, spa: 60, spd: 90, spe: 110},
		abilities: {0: "Adaptability", 1: "Early Bird"},
	},
	delibird: {
		inherit: true,
		baseStats: {hp: 45, atk: 55, def: 45, spa: 105, spd: 45, spe: 105},
	},
	electrode: {
		inherit: true,
		baseStats: {hp: 60, atk: 75, def: 70, spa: 80, spd: 80, spe: 150},
	},
	entei: {
		inherit: true,
		baseStats: {hp: 115, atk: 115, def: 105, spa: 90, spd: 95, spe: 100},
		abilities: {0: "Solar Power"},
	},
	espeon: {
		inherit: true,
		abilities: {0: "Solar Power"},
	},
	farfetchd: {
		inherit: true,
		baseStats: {hp: 52, atk: 145, def: 55, spa: 58, spd: 62, spe: 60},
		abilities: {0: "Huge Power"},
	},
	fearow: {
		inherit: true,
		types: ["Dark", "Flying"],
		baseStats: {hp: 95, atk: 110, def: 95, spa: 61, spd: 103, spe: 100},
		abilities: {0: "Intimidate"},
	},
	feraligatr: {
		inherit: true,
		baseStats: {hp: 85, atk: 115, def: 100, spa: 79, spd: 93, spe: 78},
	},
	flareon: {
		inherit: true,
		baseStats: {hp: 65, atk: 130, def: 60, spa: 95, spd: 110, spe: 85},
		abilities: {0: "Fluffy Head"},
	},
	floatzel: {
		inherit: true,
		baseStats: {hp: 85, atk: 115, def: 75, spa: 85, spd: 70, spe: 115},
	},
	flygon: {
		inherit: true,
		baseStats: {hp: 80, atk: 125, def: 80, spa: 80, spd: 80, spe: 115},
		abilities: {0: "Levitate", 1: "Thick Fat"},
	},
	froslass: {
		inherit: true,
		baseStats: {hp: 70, atk: 80, def: 70, spa: 95, spd: 70, spe: 110},
	},
	furret: {
		inherit: true,
		baseStats: {hp: 85, atk: 106, def: 64, spa: 45, spd: 55, spe: 90},
		abilities: {0: "Unburden"},
	},
	gallade: {
		inherit: true,
		baseStats: {hp: 68, atk: 150, def: 65, spa: 65, spd: 115, spe: 85},
	},
	ralts: {
		inherit: true,
		types: ["Psychic"],
	},
	kirlia: {
		inherit: true,
		types: ["Psychic"],
	},
	gardevoir: {
		inherit: true,
		types: ["Psychic"],
		baseStats: {hp: 68, atk: 65, def: 65, spa: 125, spd: 115, spe: 90},
		abilities: {0: "Rivalry"},
	},
	gastrodon: {
		inherit: true,
		baseStats: {hp: 111, atk: 83, def: 78, spa: 92, spd: 92, spe: 39},
		abilities: {0: "Water Absorb"},
	},
	gengar: {
		inherit: true,
		baseStats: {hp: 60, atk: 65, def: 60, spa: 130, spd: 75, spe: 122},
	},
	girafarig: {
		inherit: true,
		baseStats: {hp: 95, atk: 80, def: 105, spa: 90, spd: 105, spe: 85},
		abilities: {0: "Gluttony", 1: "Early Bird"},
	},
	glaceon: {
		inherit: true,
		baseStats: {hp: 65, atk: 60, def: 120, spa: 130, spd: 95, spe: 85},
		abilities: {0: "Technician"},
	},
	glalie: {
		inherit: true,
		baseStats: {hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 150},
	},
	golduck: {
		inherit: true,
		baseStats: {hp: 80, atk: 82, def: 78, spa: 115, spd: 80, spe: 95},
		abilities: {0: "Tinted Lens", 1: "Air Lock"},
	},
	golem: {
		inherit: true,
		baseStats: {hp: 90, atk: 130, def: 160, spa: 55, spd: 65, spe: 65},
		abilities: {0: "Rock Head", 1: "No Guard"},
	},
	gorebyss: {
		inherit: true,
		baseStats: {hp: 65, atk: 84, def: 105, spa: 124, spd: 75, spe: 52},
	},
	snubbull: {
		inherit: true,
		types: ["Normal"],
	},
	granbull: {
		inherit: true,
		types: ["Normal"],
		baseStats: {hp: 100, atk: 120, def: 75, spa: 60, spd: 90, spe: 45},
		abilities: {0: "Intimidate", 1: "Guts"},
	},
	groudon: {
		inherit: true,
		baseStats: {hp: 100, atk: 170, def: 140, spa: 100, spd: 90, spe: 95},
	},
	grumpig: {
		inherit: true,
		baseStats: {hp: 100, atk: 45, def: 80, spa: 90, spd: 110, spe: 80},
		abilities: {0: "Thick Fat", 1: "Scrappy"},
	},
	hariyama: {
		inherit: true,
		baseStats: {hp: 144, atk: 120, def: 60, spa: 40, spd: 85, spe: 75},
		abilities: {0: "Gluttony", 1: "Guts"},
	},
	heracross: {
		inherit: true,
		baseStats: {hp: 80, atk: 135, def: 85, spa: 40, spd: 95, spe: 95},
		abilities: {0: "Compound Eyes", 1: "Guts"},
	},
	hitmonchan: {
		inherit: true,
		baseStats: {hp: 50, atk: 135, def: 99, spa: 35, spd: 110, spe: 76},
		abilities: {0: "Technician", 1: "Iron Fist"},
	},
	hitmonlee: {
		inherit: true,
		baseStats: {hp: 50, atk: 120, def: 53, spa: 35, spd: 110, spe: 97},
		abilities: {0: "Limber", 1: "Unburden"},
	},
	hitmontop: {
		inherit: true,
		baseStats: {hp: 50, atk: 105, def: 105, spa: 35, spd: 110, spe: 70},
	},
	hooh: {
		inherit: true,
		abilities: {0: "Magic Guard"},
	},
	honchkrow: {
		inherit: true,
		baseStats: {hp: 100, atk: 125, def: 72, spa: 105, spd: 72, spe: 81},
	},
	houndoom: {
		inherit: true,
		baseStats: {hp: 75, atk: 110, def: 50, spa: 120, spd: 80, spe: 105},
		abilities: {0: "Solar Power", 1: "Flash Fire"},
	},
	beedrill: {
		inherit: true,
		baseStats: {hp: 60, atk: 124, def: 35, spa: 15, spd: 90, spe: 132},
		abilities: {0: "Adaptability"},
	},
	illumise: {
		inherit: true,
		baseStats: {hp: 65, atk: 47, def: 65, spa: 73, spd: 85, spe: 155},
		abilities: {0: "Poison Heal", 1: "Tinted Lens"},
	},
	infernape: {
		inherit: true,
		baseStats: {hp: 76, atk: 104, def: 71, spa: 114, spd: 71, spe: 113},
	},
	jolteon: {
		inherit: true,
		baseStats: {hp: 65, atk: 65, def: 60, spa: 120, spd: 95, spe: 130},
	},
	jumpluff: {
		inherit: true,
		baseStats: {hp: 75, atk: 55, def: 70, spa: 75, spd: 95, spe: 121},
	},
	kabutops: {
		inherit: true,
		baseStats: {hp: 60, atk: 135, def: 105, spa: 95, spd: 70, spe: 90},
	},
	kangaskhan: {
		inherit: true,
		baseStats: {hp: 135, atk: 105, def: 80, spa: 40, spd: 80, spe: 90},
	},
	kecleon: {
		inherit: true,
		baseStats: {hp: 100, atk: 90, def: 70, spa: 60, spd: 120, spe: 40},
	},
	kingdra: {
		inherit: true,
		baseStats: {hp: 75, atk: 95, def: 95, spa: 95, spd: 95, spe: 90},
	},
	kingler: {
		inherit: true,
		baseStats: {hp: 70, atk: 130, def: 115, spa: 50, spd: 50, spe: 75},
		abilities: {0: "Adaptability"},
	},
	lanturn: {
		inherit: true,
		baseStats: {hp: 125, atk: 58, def: 68, spa: 76, spd: 86, spe: 77},
		abilities: {0: "Volt Absorb", 1: "Rain Dish"},
	},
	lapras: {
		inherit: true,
		baseStats: {hp: 130, atk: 85, def: 90, spa: 115, spd: 105, spe: 60},
		abilities: {0: "Water Absorb", 1: "Ice Body"},
	},
	leafeon: {
		inherit: true,
		baseStats: {hp: 65, atk: 130, def: 130, spa: 60, spd: 65, spe: 95},
		abilities: {0: "Chlorophyll"},
	},
	ledian: {
		inherit: true,
		types: ["Bug", "Ground"],
		baseStats: {hp: 95, atk: 35, def: 70, spa: 55, spd: 150, spe: 85},
		abilities: {0: "Early Bird"},
	},
	lickilicky: {
		inherit: true,
		baseStats: {hp: 110, atk: 105, def: 95, spa: 80, spd: 95, spe: 50},
		abilities: {0: "Aftermath", 1: "Thick Fat"},
	},
	linoone: {
		inherit: true,
		baseStats: {hp: 78, atk: 90, def: 61, spa: 50, spd: 61, spe: 100},
	},
	lopunny: {
		inherit: true,
		types: ["Normal", "Fighting"],
		baseStats: {hp: 65, atk: 116, def: 74, spa: 54, spd: 96, spe: 122},
		abilities: {0: "Scrappy"},
	},
	lucario: {
		inherit: true,
		baseStats: {hp: 60, atk: 110, def: 70, spa: 125, spd: 55, spe: 99},
		abilities: {0: "Scrappy", 1: "Iron Fist"},
	},
	ludicolo: {
		inherit: true,
		baseStats: {hp: 80, atk: 70, def: 70, spa: 110, spd: 100, spe: 70},
	},
	lumineon: {
		inherit: true,
		baseStats: {hp: 109, atk: 69, def: 76, spa: 69, spd: 86, spe: 91},
	},
	lunatone: {
		inherit: true,
		baseStats: {hp: 90, atk: 55, def: 85, spa: 116, spd: 115, spe: 70},
		abilities: {0: "Levitate", 1: "Orbit"},
		
	},
	luvdisc: {
		inherit: true,
		baseStats: {hp: 43, atk: 30, def: 55, spa: 105, spd: 65, spe: 97},
	},
	luxio: {
		inherit: true,
		types: ["Electric", "Dark"],
	},
	luxray: {
		inherit: true,
		types: ["Electric", "Dark"],
		baseStats: {hp: 100, atk: 120, def: 79, spa: 95, spd: 79, spe: 87},
		abilities: {0: "Guts", 1: "Intimidate"},
	},
	machamp: {
		inherit: true,
		baseStats: {hp: 90, atk: 135, def: 80, spa: 108, spd: 85, spe: 55},
	},
	slugma: {
		inherit: true,
		abilities: {0: "Water Absorb", 1: "Flame Body"},
	},
	magcargo: {
		inherit: true,
		baseStats: {hp: 70, atk: 95, def: 120, spa: 95, spd: 80, spe: 30},
		abilities: {0: "Water Absorb", 1: "Flame Body"},
	},
	magmortar: {
		inherit: true,
		baseStats: {hp: 75, atk: 95, def: 67, spa: 155, spd: 95, spe: 93},
	},
	magneton: {
		inherit: true,
		baseStats: {hp: 50, atk: 60, def: 95, spa: 120, spd: 70, spe: 80},
	},
	magnezone: {
		inherit: true,
		baseStats: {hp: 70, atk: 70, def: 115, spa: 130, spd: 90, spe: 70},
	},
	mamoswine: {
		inherit: true,
		baseStats: {hp: 110, atk: 130, def: 80, spa: 100, spd: 60, spe: 80},
		abilities: {0: "Thick Fat"},
	},
	electrike: {
		inherit: true,
		abilities: {0: "Motor Drive", 1: "Lightning Rod"},
	},
	manectric: {
		inherit: true,
		baseStats: {hp: 70, atk: 95, def: 60, spa: 115, spd: 60, spe: 115},
		abilities: {0: "Motor Drive", 1: "Lightning Rod"},
	},
	mantyke: {
		inherit: true,
		abilities: {0: "Rain Dish", 1: "Water Absorb"},
	},
	mantine: {
		inherit: true,
		baseStats: {hp: 85, atk: 40, def: 70, spa: 85, spd: 140, spe: 70},
		abilities: {0: "Rain Dish", 1: "Water Absorb"},
	},
	masquerain: {
		inherit: true,
		types: ["Bug", "Water"],
		baseStats: {hp: 80, atk: 70, def: 72, spa: 105, spd: 102, spe: 80},
	},
	mawile: {
		inherit: true,
		types: ["Steel"],
		baseStats: {hp: 50, atk: 95, def: 85, spa: 55, spd: 55, spe: 40},
		abilities: {0: "Huge Power"},
	},
	medicham: {
		inherit: true,
		baseStats: {hp: 70, atk: 80, def: 75, spa: 90, spd: 75, spe: 85},
	},
	meganium: {
		inherit: true,
		baseStats: {hp: 110, atk: 82, def: 110, spa: 83, spd: 110, spe: 75},
		abilities: {0: "Drought"},
	},
	mesprit: {
		inherit: true,
		baseStats: {hp: 105, atk: 105, def: 80, spa: 105, spd: 80, spe: 105},
	},
	metagross: {
		inherit: true,
		baseStats: {hp: 80, atk: 135, def: 130, spa: 95, spd: 90, spe: 75},
	},
	mewtwo: {
		inherit: true,
		baseStats: {hp: 106, atk: 110, def: 90, spa: 204, spd: 90, spe: 130},
	},
	mightyena: {
		inherit: true,
		baseStats: {hp: 90, atk: 110, def: 90, spa: 60, spd: 60, spe: 80},
		abilities: {0: "Intimidate"},
	},
	miltank: {
		inherit: true,
		baseStats: {hp: 115, atk: 95, def: 105, spa: 40, spd: 70, spe: 100},
	},
	mismagius: {
		inherit: true,
		baseStats: {hp: 60, atk: 60, def: 60, spa: 115, spd: 115, spe: 115},
	},
	moltres: {
		inherit: true,
		abilities: {0: "Magic Guard"},
	},
	mothim: {
		inherit: true,
		baseStats: {hp: 70, atk: 124, def: 50, spa: 124, spd: 50, spe: 86},
		abilities: {0: "Tinted Lens"},
	},
	mimejr: {
		inherit: true,
		types: ["Psychic"],
	},
	mrmime: {
		inherit: true,
		types: ["Psychic"],
		baseStats: {hp: 75, atk: 45, def: 65, spa: 105, spd: 130, spe: 115},
	},
	muk: {
		inherit: true,
		baseStats: {hp: 145, atk: 105, def: 75, spa: 65, spd: 140, spe: 50},
		abilities: {0: "Poison Point", 1: "Sticky Hold"},
	},
	nidoking: {
		inherit: true,
		baseStats: {hp: 81, atk: 122, def: 77, spa: 115, spd: 75, spe: 105},
	},
	nidoqueen: {
		inherit: true,
		baseStats: {hp: 110, atk: 92, def: 117, spa: 75, spd: 115, spe: 76},
	},
	ninetales: {
		inherit: true,
		baseStats: {hp: 73, atk: 76, def: 75, spa: 91, spd: 100, spe: 111},
		abilities: {0: "Drought"},
	},
	noctowl: {
		inherit: true,
		baseStats: {hp: 130, atk: 50, def: 50, spa: 86, spd: 126, spe: 70},
		abilities: {0: "Insomnia", 1: "Intimidate"},
	},
	octillery: {
		inherit: true,
		baseStats: {hp: 95, atk: 105, def: 75, spa: 155, spd: 75, spe: 45},
	},
	omastar: {
		inherit: true,
		baseStats: {hp: 90, atk: 60, def: 125, spa: 125, spd: 70, spe: 75},
	},
	pachirisu: {
		inherit: true,
		baseStats: {hp: 80, atk: 45, def: 70, spa: 75, spd: 110, spe: 95},
		abilities: {0: "Serene Grace"},
	},
	parasect: {
		inherit: true,
		baseStats: {hp: 60, atk: 115, def: 80, spa: 90, spd: 80, spe: 50},
		abilities: {0: "Chlorophyll", 1: "Dry Skin"},
	},
	pelipper: {
		inherit: true,
		abilities: {0: "Drizzle"},
	},
	persian: {
		inherit: true,
		baseStats: {hp: 65, atk: 100, def: 60, spa: 95, spd: 65, spe: 135},
	},
	phione: {
		inherit: true,
		baseStats: {hp: 1, atk: 80, def: 80, spa: 80, spd: 80, spe: 80},
		abilities: {0: "Reckless"},
	},
	pidgeot: {
		inherit: true,
		baseStats: {hp: 83, atk: 80, def: 75, spa: 108, spd: 70, spe: 116},
		abilities: {0: "No Guard"},
	},
	pinsir: {
		inherit: true,
		baseStats: {hp: 85, atk: 135, def: 100, spa: 55, spd: 70, spe: 90},
	},
	politoed: {
		inherit: true,
		baseStats: {hp: 100, atk: 75, def: 85, spa: 90, spd: 110, spe: 70},
		abilities: {0: "Water Absorb", 1: "Drizzle"},
	},
	poliwrath: {
		inherit: true,
		baseStats: {hp: 90, atk: 105, def: 95, spa: 70, spd: 90, spe: 90},
		abilities: {0: "Water Absorb", 1: "Technician"},
	},
	porygonz: {
		inherit: true,
		baseStats: {hp: 85, atk: 80, def: 70, spa: 145, spd: 75, spe: 95},
	},
	//porygon2: {
		//inherit: true,
		//baseStats: {hp: 85, atk: 80, def: 125, spa: 105, spd: 130, spe: 60},
	//},
	primeape: {
		inherit: true,
		baseStats: {hp: 65, atk: 115, def: 60, spa: 60, spd: 70, spe: 105},
	},
	probopass: {
		inherit: true,
		baseStats: {hp: 70, atk: 55, def: 145, spa: 75, spd: 150, spe: 40},
		abilities: {0: "Sand Stream", 1: "Magnet Pull"},
	},
	qwilfish: {
		inherit: true,
		baseStats: {hp: 65, atk: 115, def: 85, spa: 85, spd: 55, spe: 90},
	},
	raikou: {
		inherit: true,
		baseStats: {hp: 100, atk: 95, def: 85, spa: 125, spd: 110, spe: 120},
	},
	rampardos: {
		inherit: true,
		baseStats: {hp: 97, atk: 165, def: 60, spa: 65, spd: 65, spe: 63},
		abilities: {0: "Chlorophyll"},
	},
	rapidash: {
		inherit: true,
		baseStats: {hp: 65, atk: 100, def: 70, spa: 80, spd: 80, spe: 155},
		abilities: {0: "Flash Fire"},
	},
	raticate: {
		inherit: true,
		baseStats: {hp: 55, atk: 101, def: 60, spa: 80, spd: 70, spe: 102},
		abilities: {0: "Simple", 1: "Guts"},
	},
	regice: {
		inherit: true,
		baseStats: {hp: 120, atk: 50, def: 100, spa: 100, spd: 200, spe: 50},
		abilities: {0: "Ice Body"},
	},
	regirock: {
		inherit: true,
		baseStats: {hp: 120, atk: 100, def: 200, spa: 50, spd: 100, spe: 50},
		abilities: {0: "Rough Skin"},
	},
	registeel: {
		inherit: true,
		baseStats: {hp: 120, atk: 75, def: 150, spa: 75, spd: 150, spe: 50},
		abilities: {0: "Scrappy"},
	},
	relicanth: {
		inherit: true,
		baseStats: {hp: 100, atk: 120, def: 130, spa: 85, spd: 65, spe: 64},
	},
	rhyperior: {
		inherit: true,
		types: ["Fighting", "Rock"],
		baseStats: {hp: 115, atk: 140, def: 130, spa: 55, spd: 55, spe: 50},
		abilities: {0: "Lightning Rod", 1: "Technician"},
	},
	roserade: {
		inherit: true,
		baseStats: {hp: 75, atk: 70, def: 65, spa: 130, spd: 115, spe: 101},
		abilities: {0: "Natural Cure", 1: "Technician"},
	},
	rotom: {
		inherit: true,
		baseStats: {hp: 50, atk: 50, def: 77, spa: 105, spd: 77, spe: 106},
	},
	sableye: {
		inherit: true,
		baseStats: {hp: 70, atk: 75, def: 95, spa: 65, spd: 85, spe: 65},
		abilities: {0: "Magic Guard"},
	},
	sandslash: {
		inherit: true,
		baseStats: {hp: 90, atk: 115, def: 130, spa: 45, spd: 70, spe: 70},
		abilities: {0: "Rough Skin"},
	},
	scizor: {
		inherit: true,
		baseStats: {hp: 70, atk: 135, def: 100, spa: 55, spd: 80, spe: 70},
		abilities: {0: "Technician"},
	},
	sceptile: {
		inherit: true,
		types: ["Grass", "Dragon"],
		baseStats: {hp: 70, atk: 85, def: 65, spa: 115, spd: 85, spe: 120},
		abilities: {0: "Unburden"},
	},
	seaking: {
		inherit: true,
		baseStats: {hp: 110, atk: 92, def: 95, spa: 65, spd: 110, spe: 78},
		abilities: {0: "Swift Swim", 1: "Volt Absorb"},
	},
	seviper: {
		inherit: true,
		baseStats: {hp: 73, atk: 135, def: 60, spa: 135, spd: 60, spe: 75},
	},
	sharpedo: {
		inherit: true,
		baseStats: {hp: 80, atk: 130, def: 40, spa: 125, spd: 40, spe: 105},
	},
	shedinja: {
		inherit: true,
		baseStats: {hp: 1, atk: 110, def: 45, spa: 65, spd: 30, spe: 65},
	},
	shiftry: {
		inherit: true,
		baseStats: {hp: 90, atk: 120, def: 60, spa: 110, spd: 60, spe: 90},
		abilities: {0: "Chlorophyll", 1: "Solar Power"},
	},
	shuckle: {
		inherit: true,
		baseStats: {hp: 30, atk: 10, def: 230, spa: 10, spd: 230, spe: 5},
		abilities: {0: "Shield Dust", 1: "Gluttony"},
	},
	skarmory: {
		inherit: true,
		baseStats: {hp: 65, atk: 80, def: 140, spa: 55, spd: 70, spe: 70},
		abilities: {0: "Plus", 1: "Sturdy"},
	},
	skuntank: {
		inherit: true,
		baseStats: {hp: 163, atk: 93, def: 67, spa: 71, spd: 61, spe: 84},
	},
	snorlax: {
		inherit: true,
		baseStats: {hp: 160, atk: 110, def: 70, spa: 65, spd: 110, spe: 25},
	},
	slowbro: {
		inherit: true,
		baseStats: {hp: 105, atk: 75, def: 110, spa: 100, spd: 80, spe: 30},
		abilities: {0: "Magic Guard"},
	},
	slowking: {
		inherit: true,
		baseStats: {hp: 105, atk: 75, def: 80, spa: 100, spd: 110, spe: 30},
		abilities: {0: "Magic Guard"},
	},
	smeargle: {
		inherit: true,
		baseStats: {hp: 55, atk: 20, def: 45, spa: 20, spd: 45, spe: 85},
	},
	solrock: {
		inherit: true,
		baseStats: {hp: 120, atk: 95, def: 95, spa: 55, spd: 65, spe: 70},
		abilities: {0: "Drought", 1: "Orbit"},
	},
	spinda: {
		inherit: true,
		baseStats: {hp: 100, atk: 65, def: 100, spa: 65, spd: 95, spe: 65},
		abilities: {0: "Cute Charm", 1: "Tangled Feet"},
	},
	spiritomb: {
		inherit: true,
		baseStats: {hp: 60, atk: 97, def: 108, spa: 97, spd: 108, spe: 35},
	},
	stantler: {
		inherit: true,
		types: ["Normal", "Ice"],
		baseStats: {hp: 93, atk: 105, def: 82, spa: 105, spd: 85, spe: 109},
		abilities: {0: "Intimidate", 1: "Snow Warning"},
	},
	staraptor: {
		inherit: true,
		types: ["Fighting", "Flying"],
		baseStats: {hp: 95, atk: 120, def: 80, spa: 50, spd: 60, spe: 105},
	},
	starmie: {
		inherit: true,
		baseStats: {hp: 60, atk: 75, def: 85, spa: 105, spd: 85, spe: 118},
		abilities: {0: "Natural Cure"},
	},
	steelix: {
		inherit: true,
		baseStats: {hp: 80, atk: 115, def: 220, spa: 55, spd: 75, spe: 30},
		abilities: {0: "Heatproof", 1: "Magnet Pull"},
	},
	suicune: {
		inherit: true,
		baseStats: {hp: 110, atk: 75, def: 115, spa: 90, spd: 115, spe: 90},
	},
	sunflora: {
		inherit: true,
		baseStats: {hp: 85, atk: 75, def: 55, spa: 165, spd: 85, spe: 35},
	},
	swalot: {
		inherit: true,
		baseStats: {hp: 160, atk: 73, def: 83, spa: 73, spd: 83, spe: 55},
	},
	swampert: {
		inherit: true,
		baseStats: {hp: 110, atk: 110, def: 95, spa: 85, spd: 95, spe: 65},
	},
	swellow: {
		inherit: true,
		baseStats: {hp: 60, atk: 105, def: 60, spa: 90, spd: 50, spe: 129},
	},
	tangrowth: {
		inherit: true,
		baseStats: {hp: 120, atk: 100, def: 125, spa: 110, spd: 50, spe: 50},
		abilities: {0: "Magic Guard"},
	},
	tauros: {
		inherit: true,
		baseStats: {hp: 75, atk: 120, def: 95, spa: 40, spd: 70, spe: 115},
		abilities: {0: "Intimidate", 1: "Adaptability"},
	},
	tentacruel: {
		inherit: true,
		baseStats: {hp: 90, atk: 70, def: 65, spa: 80, spd: 120, spe: 103},
		abilities: {0: "Rain Dish", 1: "Liquid Ooze"},
	},
	togetic: {
		inherit: true,
		types: ["Normal", "Flying"],
		baseStats: {hp: 65, atk: 70, def: 105, spa: 80, spd: 115, spe: 40},
		abilities: {0: "Super Luck", 1: "Serene Grace"},
	},
	togepi: {
		inherit: true,
		types: ["Normal"],
	},
	togekiss: {
		inherit: true,
		types: ["Fighting", "Flying"],
		baseStats: {hp: 95, atk: 90, def: 95, spa: 120, spd: 115, spe: 85},
		abilities: {0: "Super Luck", 1: "Serene Grace"},
	},
	torkoal: {
		inherit: true,
		baseStats: {hp: 80, atk: 85, def: 140, spa: 95, spd: 70, spe: 20},
		abilities: {0: "Drought"},
	},
	torterra: {
		inherit: true,
		baseStats: {hp: 105, atk: 109, def: 105, spa: 85, spd: 85, spe: 61},
		abilities: {0: "Skill Link"},
	},
	toxicroak: {
		inherit: true,
		baseStats: {hp: 83, atk: 116, def: 65, spa: 106, spd: 65, spe: 97},
	},
	tropius: {
		inherit: true,
		baseStats: {hp: 111, atk: 78, def: 98, spa: 82, spd: 102, spe: 61},
		abilities: {0: "Chlorophyll", 1: "Air Lock"},
	},
	typhlosion: {
		inherit: true,
		baseStats: {hp: 78, atk: 84, def: 78, spa: 114, spd: 85, spe: 115},
		abilities: {0: "Mold Breaker"},
	},
	tyranitar: {
		inherit: true,
		baseStats: {hp: 105, atk: 134, def: 110, spa: 95, spd: 100, spe: 71},
	},
	umbreon: {
		inherit: true,
		baseStats: {hp: 105, atk: 75, def: 110, spa: 75, spd: 130, spe: 65},
	},
	ursaring: {
		inherit: true,
		baseStats: {hp: 100, atk: 150, def: 75, spa: 75, spd: 75, spe: 65},
		abilities: {0: "Guts"},
	},
	uxie: {
		inherit: true,
		baseStats: {hp: 95, atk: 75, def: 130, spa: 75, spd: 130, spe: 95},
	},
	vaporeon: {
		inherit: true,
		baseStats: {hp: 130, atk: 65, def: 80, spa: 110, spd: 95, spe: 65},
	},
	venomoth: {
		inherit: true,
		baseStats: {hp: 70, atk: 65, def: 60, spa: 150, spd: 75, spe: 100},
	},
	venusaur: {
		inherit: true,
		baseStats: {hp: 100, atk: 92, def: 83, spa: 100, spd: 100, spe: 90},
		abilities: {0: "Water Absorb"},
	},
	vespiquen: {
		inherit: true,
		baseStats: {hp: 80, atk: 80, def: 132, spa: 80, spd: 132, spe: 40},
	},
	victreebel: {
		inherit: true,
		baseStats: {hp: 90, atk: 115, def: 65, spa: 110, spd: 70, spe: 80},
	},
	vileplume: {
		inherit: true,
		baseStats: {hp: 95, atk: 80, def: 85, spa: 120, spd: 90, spe: 75},
	},
	wailord: {
		inherit: true,
		baseStats: {hp: 170, atk: 90, def: 85, spa: 90, spd: 65, spe: 60},
		abilities: {0: "Oblivious", 1: "Unaware"},
	},
	walrein: {
		inherit: true,
		baseStats: {hp: 120, atk: 80, def: 120, spa: 95, spd: 110, spe: 65},
	},
	weavile: {
		inherit: true,
		baseStats: {hp: 70, atk: 130, def: 65, spa: 45, spd: 85, spe: 135},
	},
	whiscash: {
		inherit: true,
		baseStats: {hp: 140, atk: 78, def: 73, spa: 76, spd: 71, spe: 60},
		abilities: {0: "Oblivious", 1: "Dry Skin"},
	},
	xatu: {
		inherit: true,
		baseStats: {hp: 85, atk: 75, def: 95, spa: 95, spd: 95, spe: 95},
		abilities: {0: "Magic Guard"},
	},
	yanmega: {
		inherit: true,
		baseStats: {hp: 86, atk: 76, def: 86, spa: 121, spd: 56, spe: 100},
	},
	zangoose: {
		inherit: true,
		baseStats: {hp: 73, atk: 135, def: 60, spa: 60, spd: 60, spe: 105},
		abilities: {0: "Guts"},
	},
	zapdos: {
		inherit: true,
		baseStats: {hp: 90, atk: 90, def: 85, spa: 125, spd: 90, spe: 101},
	},
	wormadam: {
		inherit: true,
		baseStats: {hp: 80, atk: 59, def: 85, spa: 79, spd: 105, spe: 67},
		abilities: {0: "Levitate"},
	},
	wormadamsandy: {
		inherit: true,
		baseStats: {hp: 80, atk: 79, def: 105, spa: 59, spd: 85, spe: 67},
		abilities: {0: "Levitate"},
	},
	wormadamtrash: {
		inherit: true,
		baseStats: {hp: 80, atk: 69, def: 95, spa: 69, spd: 95, spe: 67},
		abilities: {0: "Levitate"},
	},
	gligar: {
		inherit: true,
		abilities: {0: "Hyper Cutter", 1: "Immunity"},
	},
	gliscor: {
		inherit: true,
		abilities: {0: "Hyper Cutter", 1: "Poison Heal"},
	},
	abomasnow: {
		inherit: true,
		baseStats: {hp: 100, atk: 102, def: 95, spa: 122, spd: 125, spe: 85},
	},
	volbeat: {
		inherit: true,
		types: ["Bug", "Electric"],
		baseStats: {hp: 85, atk: 103, def: 85, spa: 47, spd: 95, spe: 95},
		abilities: {0: "Unaware"},
	},
	raichu: {
		inherit: true,
		baseStats: {hp: 80, atk: 110, def: 55, spa: 120, spd: 80, spe: 110},
		abilities: {0: "Motor Drive"},
	},
	absol: {
		inherit: true,
		baseStats: {hp: 75, atk: 130, def: 60, spa: 105, spd: 60, spe: 115},
	},
	aerodactyl: {
		inherit: true,
		baseStats: {hp: 80, atk: 115, def: 75, spa: 60, spd: 75, spe: 131},
	},
	aggron: {
		inherit: true,
		baseStats: {hp: 100, atk: 115, def: 180, spa: 80, spd: 60, spe: 55},
		abilities: {0: "Solid Rock", 1: "Rock Head"},
	},
	alakazam: {
		inherit: true,
		baseStats: {hp: 55, atk: 50, def: 45, spa: 145, spd: 95, spe: 130},
		abilities: {0: "Magic Guard", 1: "Inner Focus"},
	},
	altaria: {
		inherit: true,
		baseStats: {hp: 85, atk: 85, def: 95, spa: 95, spd: 110, spe: 85},
	},
	ambipom: {
		inherit: true,
		baseStats: {hp: 75, atk: 110, def: 66, spa: 85, spd: 66, spe: 125},
		abilities: {0: "Technician", 1: "Skill Link"},
	},
	ampharos: {
		inherit: true,
		types: ["Electric", "Dragon"],
		baseStats: {hp: 100, atk: 85, def: 95, spa: 120, spd: 100, spe: 65},
	},
	arbok: {
		inherit: true,
		baseStats: {hp: 90, atk: 105, def: 79, spa: 75, spd: 89, spe: 95},
	},
	arcanine: {
		inherit: true,
		baseStats: {hp: 90, atk: 115, def: 80, spa: 105, spd: 80, spe: 105},
	},
	arceus: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusbug: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusdark: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusdragon: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceuselectric: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusfighting: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusfire: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusflying: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusghost: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusgrass: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusground: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusice: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceuspoison: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceuspsychic: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceusrock: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceussteel: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	arceuswater: {
		inherit: true,
		baseStats: {hp: 128, atk: 128, def: 128, spa: 128, spd: 128, spe: 128},
	},
	ariados: {
		inherit: true,
		baseStats: {hp: 100, atk: 90, def: 120, spa: 60, spd: 90, spe: 40},
	},
	armaldo: {
		inherit: true,
		baseStats: {hp: 85, atk: 125, def: 120, spa: 70, spd: 80, spe: 45},
		abilities: {0: "Water Absorb"},
	},
	articuno: {
		inherit: true,
		baseStats: {hp: 90, atk: 85, def: 100, spa: 125, spd: 125, spe: 90},
		abilities: {0: "Snow Warning"},
	},
	azelf: {
		inherit: true,
		baseStats: {hp: 75, atk: 125, def: 70, spa: 125, spd: 70, spe: 118},
	},
	azurill: {
		inherit: true,
		types: ["Normal"],
	},
	marill: {
		inherit: true,
		types: ["Water"],
	},
	azumarill: {
		inherit: true,
		types: ["Water", "Dark"],
		baseStats: {hp: 100, atk: 50, def: 80, spa: 90, spd: 90, spe: 55},
		abilities: {0: "Pure Power", 1: "Huge Power"},
	},
	banette: {
		inherit: true,
		baseStats: {hp: 64, atk: 165, def: 65, spa: 93, spd: 63, spe: 65},
		abilities: {0: "Hustle"},
	},
	bastiodon: {
		inherit: true,
		baseStats: {hp: 60, atk: 72, def: 208, spa: 47, spd: 138, spe: 30},
		abilities: {0: "Marvel Scale"},
	},
	beautifly: {
		inherit: true,
		baseStats: {hp: 60, atk: 70, def: 50, spa: 110, spd: 90, spe: 85},
		abilities: {0: "Serene Grace"},
	},
	bellossom: {
		inherit: true,
		baseStats: {hp: 75, atk: 80, def: 95, spa: 110, spd: 130, spe: 60},
	},
	bibarel: {
		inherit: true,
		baseStats: {hp: 129, atk: 95, def: 60, spa: 75, spd: 60, spe: 71},
	},
	blastoise: {
		inherit: true,
		baseStats: {hp: 89, atk: 83, def: 120, spa: 105, spd: 105, spe: 78},
	},
	breloom: {
		inherit: true,
		abilities: {0: "Technician", 1: "Poison Heal"},
	},
	bronzong: {
		inherit: true,
		baseStats: {hp: 87, atk: 89, def: 116, spa: 74, spd: 116, spe: 33},
		abilities: {0: "Levitate", 1: "Flash Fire"},
	},
	butterfree: {
		inherit: true,
		baseStats: {hp: 70, atk: 45, def: 50, spa: 110, spd: 80, spe: 100},
	},
	cacturne: {
		inherit: true,
		baseStats: {hp: 70, atk: 115, def: 60, spa: 115, spd: 110, spe: 55},
		abilities: {0: "Rough Skin"},
	},
	camerupt: {
		inherit: true,
		baseStats: {hp: 80, atk: 110, def: 70, spa: 145, spd: 75, spe: 30},
		abilities: {0: "Flash Fire"},
	},
	carnivine: {
		inherit: true,
		baseStats: {hp: 94, atk: 120, def: 72, spa: 110, spd: 72, spe: 46},
	},
	celebi: {
		inherit: true,
		baseStats: {hp: 100, atk: 80, def: 100, spa: 100, spd: 120, spe: 100},
	},
	chatot: {
		inherit: true,
		baseStats: {hp: 76, atk: 65, def: 45, spa: 112, spd: 42, spe: 111},
	},
	chimecho: {
		inherit: true,
		baseStats: {hp: 75, atk: 50, def: 80, spa: 95, spd: 160, spe: 70},
	},
	claydol: {
		inherit: true,
		baseStats: {hp: 80, atk: 70, def: 105, spa: 70, spd: 120, spe: 75},
	},
	corsola: {
		inherit: true,
		baseStats: {hp: 95, atk: 55, def: 95, spa: 95, spd: 105, spe: 15},
		abilities: {0: "Magic Guard", 1: "Natural Cure"},
	},
	cradily: {
		inherit: true,
		baseStats: {hp: 86, atk: 81, def: 117, spa: 81, spd: 127, spe: 43},
		abilities: {0: "Water Absorb"},
	},
	crawdaunt: {
		inherit: true,
		baseStats: {hp: 63, atk: 130, def: 85, spa: 90, spd: 55, spe: 55},
		abilities: {0: "Adaptability", 1: "Hyper Cutter"},
	},
	deoxysdefense: {
		inherit: true,
		baseStats: {hp: 80, atk: 70, def: 160, spa: 70, spd: 160, spe: 90},
	},
	ditto: {
		inherit: true,
		baseStats: {hp: 82, atk: 48, def: 140, spa: 48, spd: 130, spe: 74},
	},
	drapion: {
		inherit: true,
		baseStats: {hp: 70, atk: 90, def: 110, spa: 60, spd: 95, spe: 95},
	},
	igglybuff: {
		inherit: true,
		types: ["Normal"],
	},
	jigglypuff: {
		inherit: true,
		types: ["Normal"],
	},
	wigglytuff: {
		inherit: true,
		types: ["Normal"],
		baseStats: {hp: 160, atk: 66, def: 66, spa: 66, spd: 99, spe: 66},
		abilities: {0: "Unaware"},
	},
	cleffa: {
		inherit: true,
		types: ["Normal"],
	},
	clefairy: {
		inherit: true,
		types: ["Normal"],
	},
	clefable: {
		inherit: true,
		types: ["Normal"],
		baseStats: {hp: 95, atk: 70, def: 93, spa: 95, spd: 90, spe: 60},
		abilities: {0: "Magic Guard"},
	},
	cherrim: {
		inherit: true,
		baseStats: {hp: 80, atk: 60, def: 110, spa: 87, spd: 128, spe: 95},
	},
	kricketot: {
		inherit: true,
		abilities: {0: "Soundproof"},
	},
	kricketune: {
		inherit: true,
		baseStats: {hp: 77, atk: 95, def: 71, spa: 95, spd: 71, spe: 85},
		abilities: {0: "Soundproof"},
	},
	exeggutor: {
		inherit: true,
		baseStats: {hp: 95, atk: 95, def: 85, spa: 135, spd: 75, spe: 65},
	},
	huntail: {
		inherit: true,
		baseStats: {hp: 65, atk: 114, def: 105, spa: 94, spd: 75, spe: 62},
	},
	dusknoir: {
		inherit: true,
		baseStats: {hp: 75, atk: 115, def: 135, spa: 35, spd: 135, spe: 45},
		abilities: {0: "Iron Fist"},
	},
	dragonite: {
		inherit: true,
		baseStats: {hp: 91, atk: 136, def: 95, spa: 100, spd: 100, spe: 91},
		abilities: {0: "Filter"},
	},
	delcatty: {
		inherit: true,
		types: ["Normal", "Ghost"],
		baseStats: {hp: 95, atk: 85, def: 65, spa: 65, spd: 85, spe: 90},
		abilities: {0: "Aftermath", 1: "Normalize"},
	},
	garchomp: {
		inherit: true,
		abilities: {0: "Rough Skin"},
	},
	cloyster: {
		inherit: true,
		baseStats: {hp: 50, atk: 135, def: 180, spa: 85, spd: 45, spe: 70},
	},
	dewgong: {
		inherit: true,
		baseStats: {hp: 100, atk: 90, def: 80, spa: 100, spd: 115, spe: 79},
		abilities: {0: "Thick Fat", 1: "Unaware"},
	},
	dustox: {
		inherit: true,
		baseStats: {hp: 60, atk: 75, def: 70, spa: 95, spd: 120, spe: 95},
	},
	weezing: {
		inherit: true,
		baseStats: {hp: 65, atk: 90, def: 120, spa: 105, spd: 85, spe: 60},
	},
	charizard: {
		inherit: true,
		types: ["Fire", "Dragon"],
		baseStats: {hp: 88, atk: 94, def: 84, spa: 114, spd: 85, spe: 102},
	},
	purugly: {
		inherit: true,
		baseStats: {hp: 81, atk: 92, def: 64, spa: 74, spd: 99, spe: 112},
		abilities: {0: "Thick Fat", 1: "Filter"},
	},
	electivire: {
		inherit: true,
		types: ["Electric", "Fighting"],
	},
	quagsire: {
		inherit: true,
		baseStats: {hp: 95, atk: 95, def: 105, spa: 65, spd: 95, spe: 35},
		abilities: {0: "Unaware", 1: "Water Absorb"},
	},
	scyther: {
		inherit: true,
		baseStats: {hp: 70, atk: 120, def: 70, spa: 55, spd: 80, spe: 117},
		abilities: {0: "Technician"},
	},
	ninjask: {
		inherit: true,
		baseStats: {hp: 61, atk: 90, def: 45, spa: 50, spd: 50, spe: 175},
	},
	dugtrio: {
		inherit: true,
		baseStats: {hp: 35, atk: 90, def: 50, spa: 50, spd: 70, spe: 140},
		abilities: {0: "Arena Trap"},
	},
	eevee: {
		inherit: true,
		abilities: {0: "Adaptability"},
	},
	darkrai: {
		inherit: true,
		types: ["Dark", "Ghost"],
		baseStats: {hp: 60, atk: 90, def: 90, spa: 135, spd: 90, spe: 125},
	},
	drifblim: {
		inherit: true,
		baseStats: {hp: 150, atk: 80, def: 64, spa: 90, spd: 74, spe: 80},
	},
	shelgon: {
		inherit: true,
		baseStats: {hp: 65, atk: 95, def: 130, spa: 60, spd: 100, spe: 50},
	},
	vibrava: {
		inherit: true,
		baseStats: {hp: 50, atk: 100, def: 50, spa: 80, spd: 50, spe: 80},
	},
	wartortle: {
		inherit: true,
		baseStats: {hp: 59, atk: 63, def: 100, spa: 65, spd: 100, spe: 58},
	},
	pupitar: {
		inherit: true,
		baseStats: {hp: 70, atk: 84, def: 110, spa: 65, spd: 90, spe: 51},
	},
	riolu: {
		inherit: true,
		baseStats: {hp: 40, atk: 70, def: 40, spa: 75, spd: 40, spe: 60},
	},
	magmar: {
		inherit: true,
		baseStats: {hp: 75, atk: 95, def: 87, spa: 125, spd: 105, spe: 83},
	},
	unown: {
		inherit: true,
		baseStats: {hp: 48, atk: 72, def: 48, spa: 72, spd: 48, spe: 72},
	},
};
