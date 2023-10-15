#> finds and returns the id that corresponds with the given string name
#
# @input name   The name of the item to search for, including namespace
#               Example usage: `function forever_ids:items/name_to_id {name: "minecraft:cobblestone"}` 
# @returns the number in the storage "forever_ids:output id"

data remove storage forever_ids:output id
$data modify storage forever_ids:output id set from storage forever_ids:data items.name_to_id."$(name)"
$tellraw @s [{"text":"The item $(name) has the id ","color": "gray"}, {"nbt":"id", "storage": "forever_ids:output"}]