# League of Legends maintenance

## New champion released
1. Find the champion icon on [communitydragon](https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/)
2. Save the icon as `icon.png` and take note of the **champion ID**
3. Upload the icon to Discord as an Emoji, either:
   - In a **dedicated storage server**, or
   - On the bot's emoji storage via the [Discord Developer Portal](https://discord.com/developers/applications/)
4. Copy the `Emoji_ID` from Discord (right-click > Copy Link → only keep the ID) 
5. Edit the file `/src/utils/api/riotMessageUtil.js` and add the following:
   -    - In `championIconDict`:  
     ```js
     'Champion_Name': '<:Champion_Name:Emoji_ID>',
     ```
   - In `championIdDict`:  
     ```js
     '123': 'Champion_Name',
     ```  
     *(where `123` is the numeric ID from CommunityDragon)*
   - In `championRoles`:  
     ```js
     '123': { top: 0.2, jungle: 0.2, mid: 0.2, adc: 0.2, support: 0.2 }, // 'Champion_Name'
     ```
     *(Adapt the role distribution or remove unused roles as needed)*
6. Save the file and restart the bot to apply changes

---

## New game mode released
1. Find the `queueId` on Riot’s official documentation: [queues.json](https://static.developer.riotgames.com/docs/lol/queues.json)  
2. Open `/src/utils/api/riotMessageUtil.js`
3. Add an entry to `gameQueueDict` using this template:  
   ```js
   'queue_ID': 'Queue_Name | <:Emoji_Name:Emoji_ID> Text',
   '900': 'ARURF | <:rift:1261817502284124260> Summoner\'s Rift',
   ```

---

## New game mode icon
1. Find the icon on [communitydragon](https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/)
2. Save the file as `icon.png`
3. Upload the icon to Discord as an Emoji, either:
   - In a **dedicated storage server**, or
   - On the bot's emoji storage via the [Discord Developer Portal](https://discord.com/developers/applications/)
4. Copy the `Emoji_ID` from discord
5. Edit the file `/src/utils/api/riotMessageUtil.js` and add to `gameModeDict`:
   ```js
   'GameMode_Name': '<:GameMode_Name:Emoji_ID>',
   ```