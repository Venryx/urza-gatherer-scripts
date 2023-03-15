const fs = require("fs");
const {GetUrzaDataForCard} = require("./Utils/CardDB.js");

let [operation, ...args] = process.argv.slice(2);

const DateStr = ()=>new Date().toLocaleString("sv").replace(/[ :]/g, "-");
const BasicCardInfoForUrzaID = id=>{
	return JSON.stringify(
		GetUrzaDataForCard(id),
		(key, value)=>key != "_picturePath" ? value : undefined,
	);
};

if (operation == "decrementCardCounts") {
	let [baseFile, excludeFile] = args;
	let baseData = JSON.parse(fs.readFileSync(baseFile));
	let dataToExclude = JSON.parse(fs.readFileSync(excludeFile));
	let newData = JSON.parse(JSON.stringify(baseData));

	for (const [key, decrementAmount] of Object.entries(dataToExclude.Count)) {
		let id = parseInt(key);
		let oldCount = baseData.Count[key];
		if (oldCount == null) {
			console.warn(`Trying to decrement count of card ${key} by ${decrementAmount}. Failed, since card was not found in base file!`.padEnd(110, " ") + `@CardInfo:${BasicCardInfoForUrzaID(id)}`);
			continue;
		}
		let newCount = oldCount - decrementAmount;
		if (oldCount < decrementAmount) {
			console.warn(`Trying to decrement count of card ${key} by ${decrementAmount}. Failed (partially), since base file only had ${oldCount} copies.`.padEnd(110, " ") + `@CardInfo:${BasicCardInfoForUrzaID(id)}`);
		}
		newData.Count[key] = newCount;

		if (newCount == 0) {
			delete newData.Count[key];
		}
	}

	CleanUpUrzaDBData(newData);

	let outputFilename = `./Output_${DateStr()}.ugs`;
	fs.writeFileSync(outputFilename, JSON.stringify(newData));
}

function CleanUpUrzaDBData(data) {
	// collection-internal cleanup
	// ==========

	// do this in cross-collection cleanup below
	/*for (const [key, value] of Object.entries(data.Count)) {
		if (value == 0) delete data.Count[key];
	}*/
	for (const [key, value] of Object.entries(data.Foils)) {
		if (value == 0) delete data.Foils[key];
	}
	for (const [key, value] of Object.entries(data.FoilEtcheds)) {
		if (value == 0) delete data.FoilEtcheds[key];
	}
	for (const [key, value] of Object.entries(data.Conditions)) {
		if (value == "") delete data.Conditions[key];
	}
	for (const [key, value] of Object.entries(data.Gradings)) {
		if (value == "") delete data.Gradings[key];
	}
	for (const [key, value] of Object.entries(data.Languages)) {
		if (value == "") delete data.Languages[key];
	}
	for (const [key, value] of Object.entries(data.IsOrdered)) {
		if (value == false) delete data.IsOrdered[key];
	}
	// default is probably 0, but I'm not 100% sure, so am leaving commented
	/*for (const [key, value] of Object.entries(data.Icon)) {
		if (value == 0) delete data.Icon[key];
	}*/
	for (const [key, value] of Object.entries(data.IsProxy)) {
		if (value == false) delete data.IsProxy[key];
	}

	// cross-collection cleanup
	// ==========

	for (const [key, value] of Object.entries(data.Count)) {
		if (value == 0) {
			delete data.Count[key];
			delete data.Foils[key];
			delete data.FoilEtcheds[key];
			delete data.Conditions[key];
			delete data.Gradings[key];
			delete data.Languages[key];
			// user may want proxy/icon markings to remain, even if the card's count-in-collection is changed to 0
			//delete data.IsProxy[key];
			//delete data.Icon[key];
		}
	}
}