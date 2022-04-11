const fs = require("fs");
const path = require("path");

const cardDBText = fs.readFileSync("./CardDB_Urza/2022-04-10_OnlyIDsAndEnNames_Formatted.json").toString();
const cardDB = JSON.parse(cardDBText);

const cardsBy_multiverseID = new Map();
const cardsBy_nameEn = new Map();
const cardsBy_shortNameEn = new Map();
const cardsBy_nameEn_simple = new Map();
const cardsBy_shortNameEn_simple = new Map();
function AddToMapOfLists(/** @type {Map<string, string>} */ map, key, entry) {
	if (!map.has(key)) {
		map.set(key, []);
	}
	map.get(key).push(entry);
}
for (const card of cardDB) {
	AddToMapOfLists(cardsBy_multiverseID, card.multiverseIdEn, card);
	AddToMapOfLists(cardsBy_nameEn, card.nameEn, card);
	AddToMapOfLists(cardsBy_shortNameEn, card.shortNameEn, card);
	AddToMapOfLists(cardsBy_nameEn_simple, SimplifyCardName(card.nameEn), card);
	AddToMapOfLists(cardsBy_shortNameEn_simple, SimplifyCardName(card.shortNameEn), card);
}
function SimplifyCardName(name) {
	return name.replace(/[^a-zA-Z]/g, "").toLowerCase();
}

Object.assign(exports, {FindUrzaCardID});
function FindUrzaCardID(multiverseID, cardName_raw) {
	let splitCardNames = cardName_raw.includes(" // ") ? cardName_raw.split(" // ") : [cardName_raw];
	for (let cardName of splitCardNames) {
		let cardMatch = (
			(multiverseID != 0 && cardsBy_multiverseID.get(multiverseID)?.[0]) ||
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