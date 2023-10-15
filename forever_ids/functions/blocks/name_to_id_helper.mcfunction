#> a helper function, do not call manually unless you know what you're doing
#
# @input name   The name of the block to search for, without namespace!
#               Example usage: `function forever_ids:blocks/name_to_id_helper {name: "cobblestone"}` 
# @returns the number in the storage "forever_ids:output id"

data remove storage forever_ids:output id
$data modify storage forever_ids:output id set from storage forever_ids:data blocks.name_to_id.$(name)

$tellraw @s [{"text":"The block $(name) has the id ","color": "gray"}, {"nbt":"id", "storage": "forever_ids:output"}]