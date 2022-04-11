const fs = require("fs");
const path = require("path");
const {PopulateUrzaDataFromFiles} = require("./Utils/Delver.js");

let urzaData = {
	"Count": {},
	"Foils": {},
	"FoilEtcheds": {},
	"Comments": {},
	"Conditions": {},
	"Tags": {}
};

let importFiles = fs.readdirSync("./InputFiles").filter(a=>a.endsWith(".csv"));
PopulateUrzaDataFromFiles(urzaData, importFiles);

fs.writeFileSync(`./OutputFiles/${new Date().toLocaleString("sv").replace(/[: ]/g, "-")}_UrzaImport.ugs`, JSON.stringify(urzaData));
console.log("Conversion complete! See file at:", path.resolve("./OutputFiles/UrzaImport.ugs"));