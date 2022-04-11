const fs = require("fs");
const path = require("path");

const cardDBText = fs.readFileSync("./CardDB_Urza/2022-04-10_OnlyIDsAndEnNames_Formatted.json").toString();
const cardDB = JSON.parse(cardDBText);

const cardsBy_multiverseID = new Map();
const cardsBy_tcgPlayerID = new Map();
const cardsBy_nameEn = new Map();
const cardsBy_shortNameEn = new Map();
const cardsBy_nameEn_simple = new Map();
const cardsBy_shortNameEn_simple = new Map();
function AddToMapOfLists(/** @type {Map<string, string>} */ map, key_raw, entry) {
	let key = ""+key_raw; // always stringify the key (in a Map, number and string keys are different; we want them to coalesce)
	if (!map.has(key)) {
		map.set(key, []);
	}
	map.get(key).push(entry);
}
for (const card of cardDB) {
	AddToMapOfLists(cardsBy_multiverseID, card.multiverseIdEn, card);
	AddToMapOfLists(cardsBy_tcgPlayerID, card._tcgPlayerId, card);
	AddToMapOfLists(cardsBy_nameEn, card.nameEn, card);
	AddToMapOfLists(cardsBy_shortNameEn, card.shortNameEn, card);
	AddToMapOfLists(cardsBy_nameEn_simple, SimplifyCardName(card.nameEn), card);
	AddToMapOfLists(cardsBy_shortNameEn_simple, SimplifyCardName(card.shortNameEn), card);
}
function SimplifyCardName(name) {
	return name.replace(/[^a-zA-Z]/g, "").toLowerCase();
}

Object.assign(exports, {FindUrzaCardID});
function FindUrzaCardID(multiverseID, tcgPlayerID, cardName_raw) {
	const multiverseID_valid = multiverseID != null && multiverseID != 0;
	const tcgPlayerID_valid = tcgPlayerID != null && tcgPlayerID != 0;
	let splitCardNames = cardName_raw.includes(" // ") ? cardName_raw.split(" // ") : [cardName_raw];
	for (let cardName of splitCardNames) {
		let cardMatch = (
			(multiverseID_valid && tcgPlayerID_valid && cardsBy_multiverseID.get(multiverseID)?.filter(a=>a._tcgPlayerId == tcgPlayerID)[0]) ||
			(multiverseID_valid && cardsBy_multiverseID.get(multiverseID)?.[0]) ||
			(tcgPlayerID_valid && cardsBy_tcgPlayerID.get(tcgPlayerID)?.[0]) ||
			cardsBy_nameEn.get(cardName)?.[0] ||
			cardsBy_shortNameEn.get(cardName)?.[0] ||
			cardsBy_nameEn_simple.get(SimplifyCardName(cardName))?.[0] ||
			cardsBy_shortNameEn_simple.get(SimplifyCardName(cardName))?.[0]
		);
		if (cardMatch != null) {
			return cardMatch.id;
		}
	}
}