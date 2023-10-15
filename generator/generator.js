const path = require("path");
const fs = require("fs");
const https = require("https");
const { argv } = require("process");
const { functions } = require("./functions");

let githubPath = "master";
if(argv[2]){
    githubPath = argv[2];
}
console.log(`Using version ${githubPath}`);
const blocksURL = `https://raw.githubusercontent.com/Ersatz77/mcdata/${githubPath}/processed/reports/registries/block/data.json`;
const itemsURL = `https://raw.githubusercontent.com/Ersatz77/mcdata/${githubPath}/processed/reports/registries/item/data.json`;

const blocksFolderName = "blocks";
const itemsFolderName = "items";
const blocksDirPath = path.join(__dirname, "..", blocksFolderName);
const itemsDirPath = path.join(__dirname, "..", itemsFolderName);
const blocksJsonPath = path.join(blocksDirPath, "/blocks.json");
const itemsJsonPath = path.join(itemsDirPath, "/items.json");


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

    blocks.sort((a, b)=> a.id - b.id);
    items.sort((a, b)=> a.id - b.id);

    console.group("Saving files")
    fs.writeFileSync(blocksJsonPath, JSON.stringify(blocks, null, 2));
    fs.writeFileSync(itemsJsonPath, JSON.stringify(items, null, 2));
    if(githubPath && githubPath != "master")
        fs.writeFileSync(path.join(__dirname, "../VERSION.txt"), githubPath);
    console.groupEnd();
    
    console.group("Generating functions")
    functions(blocks, "blocks");
    functions(items, "items");
    console.groupEnd();

    console.log("Done.");
}

function loadExistingIds(path) {
    return JSON.parse(fs.readFileSync(path, {encoding: "utf-8"}));
}

function loadNewList(url){
    return new Promise((resolve)=> {
        https.get(url, res => {
            let rawData = "";
            res.on("data", chunk => {
                rawData += chunk;
            });
            res.on("end", ()=> {
                let parsedData = JSON.parse(rawData);
                resolve(parsedData);
            });
        });
    });
}

function compareAndAdd(existingList, newList) {
    let currentId = existingList.reduce((acc, current) => {
        if(acc.id > current){
            return acc.id;
        }
        return current.id;
    }, 0);

    let additions = 0;
    for(let element of newList.values) {
        if(existingList.find(el => el.name == element)) continue;
        existingList.push({name: element, id: ++currentId});
        additions++;
    }
    console.log(`Compared: ${additions} additions. New total length: ${existingList.length}`);
}