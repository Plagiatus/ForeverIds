#> finds and returns the id that corresponds with the given string name
#
# @input name   The name of the block to search for, including namespace
#               Example usage: `function forever_ids:blocks/name_to_id {name: "minecraft:cobblestone"}` 
# @returns the number in the storage "forever_ids:output id"

data remove storage forever_ids:output id
$data modify storage forever_ids:output id set from storage forever_ids:data blocks.name_to_id."$(name)"
$tellraw @s [{"text":"The block $(name) has the id ","color": "gray"}, {"nbt":"id", "storage": "forever_ids:output"}]