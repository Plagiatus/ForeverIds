#> finds and returns the string name that corresponds with the given numerical id
#
# @input id     The numerical id to search for
#               Example useage: `function forever_ids:blocks/id_to_name {id: 123}` 
# @output as string in storage "forever_ids:output name"

data remove storage forever_ids:output name
$data modify storage forever_ids:output name set from storage forever_ids:data blocks.id_to_name[$(id)]
$tellraw @s [{"text":"The id $(id) belongs to this block: ", "color": "gray"}, {"nbt":"name", "storage": "forever_ids:output"}]