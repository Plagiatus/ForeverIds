# ForeverIds
A future compatible, tagged list of numerical ids for minecraft blocks and items. It automatically updates itself every saturday night, if there is something to update to.

**Starting from 1.20.2**

## How to use

### Raw Data

You can find every version since 1.20.2 annotated as a tag. The raw json files are available inside the `blocks` and `items` folders respectively.

### Datapacks

The `forever_ids` folder is ready to be copied into your datapack. Just run the `forever_ids:load` function either once manually or put it into the `#minecraft:load` function tag, to store the data inside your worlds storage.

It further provides you with a few basic convenience functions using macros to convert numerical ids and string names back and forth.


## Credits
Uses the work of @Arcensoth and @Ersatz77 by relying on the generated data from https://github.com/Ersatz77/mcdata.