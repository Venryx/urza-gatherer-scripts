# Urza Gatherer Scripts

Scripts for converting external MTG collection/deck data to a format that Urza Gatherer can import.

Supported source formats:
1) [Delver Lens N](https://play.google.com/store/apps/details?id=delverlab.delverlens), csv export of list.

Supported output formats:
1) [Urza Gatherer](https://www.urzagatherer.com) database file (.ugs) [for use with its database "Merge" function]

### Preparation

1) Open your [Delver Lens N](https://play.google.com/store/apps/details?id=delverlab.delverlens) Android app.
2) Click into the List you want to export.
3) Press the "Export" icon in the top toolbar.
4) Press the "Create CSV file" option.
5) Ensure that the `MultiverseID` and `TCGPlayer productID` fields are enabled for export in the export settings. (along with `QuantityX` and `Name`, which are enabled by default)
6) Press "Download"; your csv file will be exported to the standard "Download" folder.

### Usage

1) Install [NodeJS](https://nodejs.org/en/download) if not already installed. (to check if it's installed: `node --version`)
2) Clone/download this repo to disk. ("Code" button above, "Download ZIP", extract)
3) Copy the file from "Preparation" step 6 into the repo's `ImportFiles` folder.
4) Open terminal in repo root, and run: `node DelverCSVToUrzaDB.js`
5) If using Urza Gatherer on Android, copy the generated `OutputFiles/[date+time]_UrzaImport.ugs` file to your Android device.
6) Go to Urza Gatherer -> Settings -> Merge from a file, press Merge, then select the `[date+time]_UrzaImport.ugs` file.
7) The contents should now be merged into your collection! (if a card already existed in your collection, the count will be incremented by the amount present in the file)