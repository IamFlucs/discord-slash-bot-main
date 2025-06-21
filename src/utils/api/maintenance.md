# League of Legends maintenance
## New champion released
1. Find his icon on [communitydragon](https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/)
2. Save the icon.png and his ID as we will need it for later
3. Upload the icon on discord Emoji, either an a dedicated storage server or on the bot emoji storage (accessible on [developers application portal](https://discord.com/developers/applications/))
4. Copy the Emoji_ID from discord
5. Edit the file `/src/utils/api/riotMessageUtil.js`
   - In championIconDict, add: `'Champion_Name': '<:Champion_Name:Emoji_ID>',`
   - In championIdDict, add: `'ID': 'Champion_Name',` where ID is the number of communitydragon (step 2)
   - In championRoles, add: `'ID': { top: 0.2, jungle: 0.2, mid: 0.2, adc: 0.2, support: 0.2 }, // 'Champion_Name'` where you can adapt the percentage and delete role as you which
6. Save file and restart the bot
## New game mode released
1. Find the queue_ID on [riot documentation](https://static.developer.riotgames.com/docs/lol/queues.json)
2. Edit the file `/src/utils/api/riotMessageUtil.js`
3. Complete this template line to suit your need `'queue_ID': 'queue_Name | <:Emoji_Name:Emoji_ID> Texte',`
   - Example: `'900': 'ARURF | <:rift:1261817502284124260> Summoner\'s Rift',`
### New game mode icon
1. Find the icon on [communitydragon](https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/)
2. Save the icon.png
3. Upload the icon on discord Emoji, either an a dedicated storage server or on the bot emoji storage (accessible on [developers application portal](https://discord.com/developers/applications/))
4. Copy the Emoji_ID from discord
5. Edit the file `/src/utils/api/riotMessageUtil.js`
   - In gameModeDict, add: `'GameMode_Name': '<:GameMode_Name:Emoji_ID>',`