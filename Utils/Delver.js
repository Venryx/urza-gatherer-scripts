const fs = require("fs");
const path = require("path");
const {FindUrzaCardID} = require("./CardDB.js");

Object.assign(exports, {PopulateUrzaDataFromFiles});
function PopulateUrzaDataFromFiles(urzaData, files) {
	for (let file of files) {
		PopulateUrzaDataFromFile(urzaData, file);
	}
}

Object.assign(exports, {PopulateUrzaDataFromFile});
function PopulateUrzaDataFromFile(urzaData, file) {
	let delverText = fs.readFileSync(`./InputFiles/${file}`).toString();
	let lines = delverText.split("\n");

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
			if (multiverseID == 0 && cardName.endsWith(" Token")) {
				console.log(`Skipping token card "${cardName}". (Urza doesn't track token cards)`);
			} else {
				console.log(`Skipping card, since could not find card in urza-database matching data from export:`, {multiverseID, cardName});
			}
			continue;
		}
		
		let quantity = Number(quantityX.replace(/x/g, ""));
		//if (isNaN(quantity)) quantity = 1; // fallback to assuming a card-count of 1
		if (isNaN(quantity)) throw new Error("Could not parse quantity of card in row:", line);
		urzaData.Count[urzaCardID] = (urzaData.Count[urzaCardID] ?? 0) + quantity;
	}
}