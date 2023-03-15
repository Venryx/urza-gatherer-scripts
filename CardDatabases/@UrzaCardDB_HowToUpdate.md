1) Install a user-script extension in your browser. I use the open-source [Violent Monkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) extension.
2) Add a userscript with the following code:
```
// ==UserScript==
// @name        UrzaGatherer data-extractor - urzagatherer.app
// @namespace   Violentmonkey Scripts
// @match       https://www.urzagatherer.app/
// @grant       none
// @version     1.0
// @author      -
// @description 3/14/2023, 10:22:04 PM
// ==/UserScript==

// Here we intercept the property-setting of the last property on each card object, and store each card's data in an array at `window.mapping`.
Object.defineProperty(Object.prototype, "shortNameEn", {
    set: function(value) {
        //console.log("Self:", this, "@value:", value);
        Object.defineProperty(this, "shortNameEn", {enumerable: true, value});

        window.mapping = window.mapping ?? [];
        //window.mapping[this.id] = JSON.parse(JSON.stringify(this)); // this leaves unwanted gaps/nulls
        window.mapping.push(JSON.parse(JSON.stringify(this)));
    }
})

let button = document.createElement("button");
button.innerText = "Export card data";
Object.assign(button.style, {
    position: "fixed",
    zIndex: 100,
    left: "50%",
    top: 0,
});
button.onclick = ()=>{
    if (window.mapping == null) {
        alert("Card data not yet loaded. Try again shortly.");
        return;
    }

    cardKeysToKeep = [
        "id", "multiverseIdEn", "multiverseIdFr", "nameEn", "scryfallNumber", "_cardMarketId", "_tcgPlayerId",
        "nameEn", "shortNameEn", "_picturePath", 
    ];

    const resultStruct = [];
    for (let [id, card] of Object.entries(window.mapping)) {
        resultStruct[id] = {};
        for (let [key, value] of Object.entries(card)) {
            if (cardKeysToKeep.includes(key)) {
                resultStruct[id][key] = value;
            }
        }
    }
    
    //let dataStr = JSON.stringify(resultStruct); // unformatted (smaller file)
    let dataStr = JSON.stringify(resultStruct, null, "\t"); // formatted (larger file)

    StartDownload(dataStr, "UrzaCardDB.json");
};
document.body.appendChild(button);

function StartDownload(content, filename, dataTypeStr = "data:application/octet-stream,", encodeContentAsURIComp = true) {
	var link = document.createElement("a");
	Object.assign(link.style, {display: "none"});
	link.innerText = "Save to disk";
	if (content instanceof Blob) {
		// todo: make sure this works correctly, even for different data-types (since data-type args are ignored if Blob supplied)
		link.setAttribute("href", URL.createObjectURL(content));
	} else {
		link.setAttribute("href", dataTypeStr + (encodeContentAsURIComp ? encodeURIComponent(content) : content));
	}
	link.setAttribute("download", filename);
	document.body.appendChild(link);
	link.click();
	link.remove();
}
```
3) Reload the UrzaGatherer app, wait for it to fully load, then press the "Export card data" button.
4) Move/copy the downloaded file to the `CardDatabases` folder in this repo, making sure the file is named `UrzaCardDB.json`.
5) If you're going to be pushing the updated file to GitHub, change the "last-updated" date in the readme.