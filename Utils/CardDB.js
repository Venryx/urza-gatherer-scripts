const fs = require("fs");
const path = require("path");

let cardDBText = fs.readFileSync("./CardDB_Urza/2022-04-10_OnlyIDsAndEnNames_Formatted.json").toString();
let cardDB = JSON.parse(cardDBText);
Object.assign(exports, {FindUrzaCardID});
function FindUrzaCardID(multiverseID, cardName) {
	return (
		cardDB.find(a=>a.multiverseIdEn == multiverseID) ??
		cardDB.find(a=>a.nameEn == cardName) ??
		cardDB.find(a=>a.shortNameEn == cardName)
	)?.id;
}