const path = require("path");
const fs = require("fs");
const https = require("https");


const blocksURL = "https://raw.githubusercontent.com/Ersatz77/mcdata/1.20.2/processed/reports/registries/block/data.json";
const itemsURL = "https://raw.githubusercontent.com/Ersatz77/mcdata/1.20.2/processed/reports/registries/item/data.json";

const blocksDirPath = path.join(__dirname, "../blocks");
const itemsDirPath = path.join(__dirname, "../items");
const blocksJsonPath = path.join(blocksDirPath, "/blocks.json");
const itemsJsonPath = path.join(itemsDirPath, "/items.json");

run();

async function run() {
    let blocks = loadExistingIds(blocksJsonPath);
    let items = loadExistingIds(itemsJsonPath);

    let newBlocks = await loadNewList(blocksURL);
    let newItems = await loadNewList(itemsURL);

    compareAndAdd(blocks, newBlocks);
    compareAndAdd(items, newItems);

    fs.writeFileSync(blocksJsonPath, JSON.stringify(blocks, null, 2));
    fs.writeFileSync(itemsJsonPath, JSON.stringify(items, null, 2));
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

    for(let element of newList.values) {
        if(existingList.find(el => el.name == element)) continue;
        existingList.push({name: element, id: ++currentId});
    }
}