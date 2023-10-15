#> finds and returns the id that corresponds with the given string name
#
# @input name   The name of the block to search for, including namespace
#               Example usage: `function forever_ids:blocks/name_to_id {name: "minecraft:cobblestone"}` 
# @returns the number in the storage "forever_ids:output id"

$data modify storage forever_ids:tmp name set value "$(name)"

data modify storage forever_ids:tmp name set string storage forever_ids:tmp name 10

function forever_ids:blocks/name_to_id_helper with storage forever_ids:tmp