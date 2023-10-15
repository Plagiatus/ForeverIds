const path = require("path");
const fs = require("fs");

/**
 * Generates all the functions that correspond to the block and item ids
 */
function functions(array, name){
    console.groupCollapsed("Generating functions for", name);
    let folderPath = path.join(__dirname, "../forever_ids/functions", name);
    load(array, name, folderPath);
    console.groupEnd();
}

function load(array, name, folderPath){
    // generates load functions
    let arr = `data modify storage forever_ids:data ${name}.id_to_name set value [\\\n`;
    let obj = `\n\ndata modify storage forever_ids:data ${name}.name_to_id set value {\\\n`;
    for(let element of array) {
        arr += `"${element.name}", \\\n`;
        obj += `"${element.name}": ${element.id}, \\\n`;
    }
    arr += "]";
    obj += "}";

    fs.writeFileSync(path.join(folderPath, "load.mcfunction"), arr + obj);
}

module.exports = {functions}