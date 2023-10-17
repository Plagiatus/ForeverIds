const path = require("path");
const fs = require("fs");
const https = require("https");
const { argv } = require("process");
const { functions } = require("./functions");
const core = require("@actions/core");
const github = require("@actions/github");

let githubPath = "master";
if (argv[2]) {
    githubPath = argv[2];
}
console.log(`Using version ${githubPath}`);
const blocksURL = `https://raw.githubusercontent.com/Ersatz77/mcdata/${githubPath}/processed/reports/registries/block/data.min.json`;
const itemsURL = `https://raw.githubusercontent.com/Ersatz77/mcdata/${githubPath}/processed/reports/registries/item/data.min.json`;

const blocksFolderName = "blocks";
const itemsFolderName = "items";
const blocksDirPath = path.join(__dirname, "..", blocksFolderName);
const itemsDirPath = path.join(__dirname, "..", itemsFolderName);
const blocksJsonPath = path.join(blocksDirPath, "/blocks.json");
const itemsJsonPath = path.join(itemsDirPath, "/items.json");

const output = { additions: [], deletions: [] };

run();

async function run() {
    console.groupCollapsed("Loading Resources");
    let blocks = loadExistingIds(blocksJsonPath);
    let items = loadExistingIds(itemsJsonPath);
    console.log("Loaded existing IDs");

    let newBlocks = await loadNewList(blocksURL);
    let newItems = await loadNewList(itemsURL);
    console.log("Loaded new lists");
    console.groupEnd();

    console.group("Comparison");
    compareAndAdd(blocks, newBlocks);
    compareAndAdd(items, newItems);
    console.log("Comparisons completed");
    console.groupEnd();

    blocks.sort((a, b) => a.id - b.id);
    items.sort((a, b) => a.id - b.id);

    console.group("Saving files")
    fs.writeFileSync(blocksJsonPath, JSON.stringify(blocks, null, 2));
    fs.writeFileSync(itemsJsonPath, JSON.stringify(items, null, 2));
    fs.writeFileSync(path.join(blocksDirPath, "/blocks.min.json"), JSON.stringify(blocks));
    fs.writeFileSync(path.join(itemsDirPath, "/items.min.json"), JSON.stringify(items));
    if (githubPath && githubPath != "master")
        fs.writeFileSync(path.join(__dirname, "../VERSION.txt"), githubPath);
    console.groupEnd();

    console.group("Generating functions")
    functions(blocks, "blocks");
    functions(items, "items");
    console.groupEnd();
    
    console.group("Writing Output")
    core.setOutput("additions", JSON.stringify(output.additions));
    core.setOutput("deletions", JSON.stringify(output.deletions));
    console.groupEnd();
    
    console.log("Done.");
}

function loadExistingIds(path) {
    return JSON.parse(fs.readFileSync(path, { encoding: "utf-8" }));
}

function loadNewList(url) {
    return new Promise((resolve) => {
        https.get(url, res => {
            let rawData = "";
            res.on("data", chunk => {
                rawData += chunk;
            });
            res.on("end", () => {
                let parsedData = JSON.parse(rawData);
                resolve(parsedData);
            });
        });
    });
}

function compareAndAdd(existingList, newList) {
    let currentId = existingList.reduce((acc, current) => {
        if (acc > current.id) {
            return acc;
        }
        return current.id;
    }, 0);

    let copyOfList = JSON.parse(JSON.stringify(existingList));

    for (let element of newList.values) {
        if (existingList.find(el => el.name == element)) {
            copyOfList = copyOfList.filter(el => el.name != element);
            continue;
        }
        existingList.push({ name: element, id: ++currentId });
        output.additions.push({name: element, id: currentId});
    }
    console.log(`Compared: ${output.additions.length} additions. New total length: ${existingList.length}`);
    
    for (element of copyOfList) {
        if (element.name == "") continue;
        let deletedItem = existingList.find(el => el.name == element.name);
        if(!deletedItem.previous) deletedItem.previous = [];
        deletedItem.previous.push({name: element.name, removed_in: githubPath});
        deletedItem.name = "";
        output.deletions.push(deletedItem);
    }
    console.log(`Compared: Detected ${output.deletions.length} deletions.`);
}