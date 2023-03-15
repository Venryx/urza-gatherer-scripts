# Urza Gatherer Scripts

Various scripts for use with the UrzaGatherer app (a card-catalog for the card-game Magic the Gathering).

## General setup/installation

1) Install [NodeJS](https://nodejs.org/en/download) if not already installed. (to check if it's installed: `node --version`)
2) Clone/download this repo to disk. ("Code" button above, "Download ZIP", extract)

## Delver Export to Urza Database File

This function lets you convert external MTG collection/deck data to a format that Urza Gatherer can import.

Supported source formats:
1) [Delver Lens N](https://play.google.com/store/apps/details?id=delverlab.delverlens), csv export of list.

Supported output formats:
1) [Urza Gatherer](https://www.urzagatherer.com) database file (.ugs) [for use with its database "Merge" function]

Notes:
* The conversion can only take place due to mapping of card-ids between various systems/databases. Naturally, this can only take place if the UrzaGatherer database that these scripts are referencing are up-to-date enough to include the cards being converted.
* The copy of the UrzaGatherer card-database used by these scripts is located at: `CardDatabases/UrzaCardDB.json`
* The urza card-db was last updated: **2023-03-15**
* If the date above is not recent enough, running the scripts will log warnings for cards it can't identify. If needed/desired, you can update the card-database file yourself, by following the instructions in `CardDatabases/@UrzaCardDB_HowToUpdate.md`.

### Preparation

1) Open your [Delver Lens N](https://play.google.com/store/apps/details?id=delverlab.delverlens) Android app.
2) Click into the List you want to export.
3) Press the "Export" icon in the top toolbar.
4) Press the "Create CSV file" option.
5) Ensure that the `MultiverseID` and `TCGPlayer productID` fields are enabled for export in the export settings. (along with `QuantityX` and `Name`, which are enabled by default)
6) Press "Download"; your csv file will be exported to the standard "Download" folder.

### Usage

1) Do general repo setup/installation. (see earlier section)
2) Copy the file(s) from "Preparation" step 6 into the repo's `ImportFiles` folder. (you can place multiple files, to have them all processed at once)
3) Open terminal in repo root, and run: `node DelverCSVToUrzaDB.js`
4) If using Urza Gatherer on Android, copy the generated `OutputFiles/[date+time]_UrzaImport.ugs` file to your Android device.
5) Go to Urza Gatherer -> Settings -> Merge from a file, press Merge, then select the `[date+time]_UrzaImport.ugs` file.
6) The contents should now be merged into your collection! (if a card already existed in your collection, the count will be incremented by the amount present in the file)

## Urza Database Transformer

At the moment, the only operation it supports is decrementing the counts of cards in file A by the counts of cards in file B. (though in the process, it also "cleans up" the file, by removing entries that just specify the default value for things, causing unnecessary file bloat)

### Usage

1) Do general repo setup/installation. (see earlier section)
2) Open terminal in repo root, and run: `node DBTransformer.js decrementCardCounts PATH_TO_BASE_FILE PATH_TO_EXCLUSION_FILE`
3) A file named `Output_<date and time>.ugs` will be created in the repo-root; you can then load this into UrzaGatherer in the settings page.