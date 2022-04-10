const fs = require("fs");
const path = require("path");

let cardDBText = fs.readFileSync("./CardDB_Urza/2022-04-10_OnlyIDsAndEnNames_Formatted.json").toString();
let cardDB = JSON.parse(cardDBText);
function FindUrzaCardID(multiverseID, cardName) {
	return (
		cardDB.find(a=>a.multiverseIdEn == multiverseID) ??
		cardDB.find(a=>a.nameEn == cardName) ??
		cardDB.find(a=>a.shortNameEn == cardName)
	)?.id;
}

let delverText = fs.readFileSync("./DelverExport.csv").toString();
let lines = delverText.split("\n");

let urzaExportData = {
	"Count": {},
	"Foils": {},
	"FoilEtcheds": {},
	"Comments": {},
	"Conditions": {},
	"Tags": {}
};

let columnNames = lines[0].split("\t");
let columnIndexFor = columnName=>columnNames.findIndex(a=>a == columnName);
let quantityX_columnIndex = columnIndexFor("QuantityX");
let cardName_columnIndex = columnIndexFor("Name");
let multiverseID_columnIndex = columnIndexFor("MultiverseID");
if (quantityX_columnIndex == -1) {
	console.warn(`Delver-export contains no "QuantityX" column; did you forget to enable that field during export? Import cannot continue with this column missing. Aborting...`);
	process.exit();
}
if (multiverseID_columnIndex == -1) {
	console.warn(`Delver-export contains no "MultiverseID" column; did you forget to enable that field during export? Falling back to card-name matching...`);
	if (cardName_columnIndex == -1) {
		console.warn(`Delver-export contains no "Name" column. Import cannot continue with both multiverse-id and card-name columns missing. Aborting...`);
		process.exit();
	}
}

for (let line of lines.slice(1)) {
	if (line.trim().length == 0) continue;

	let cells = line.split("\t");
	let quantityX = cells[quantityX_columnIndex];
	let multiverseID = cells[multiverseID_columnIndex];
	let cardName = cells[cardName_columnIndex];

	let urzaCardID = FindUrzaCardID(multiverseID, cardName);
	if (urzaCardID == null) {
		console.log(`Skipping card, since could not find card in urza-database matching data from export:`, {multiverseID, cardName});
		continue;
	}
	
	let quantity = Number(quantityX.replace(/x/g, ""));
	//if (isNaN(quantity)) quantity = 1; // fallback to assuming a card-count of 1
	if (isNaN(quantity)) throw new Error("Could not parse quantity of card in row:", line);
	urzaExportData.Count[urzaCardID] = (urzaExportData.Count[urzaCardID] ?? 0) + quantity;
}

fs.writeFileSync("./UrzaImport.ugs", JSON.stringify(urzaExportData));
console.log("Conversion complete! See file at:", path.resolve("./UrzaImport.ugs"));