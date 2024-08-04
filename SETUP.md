# Setup Guide

Follow these steps to set up your Application on your Discord server.



## Configure Discord Developer Settings

### Getting the token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click "`New Application`"
3. Enter your Bot's name.
4. On the page you are directed to, set the icon (image) of the Bot.
5. Click "`Bot`" on the left side of the screen.
6. Click "`Add Bot`".
7. Enable all three Intents (Remember to save your changes!).
8. Click "`reset token`".
9. Copy the token that is displayed – You will need this later.

### Adding the Bot to your server

1. Click "`oauth2`" then “URL Generator" on the left side of the screen.
2. Click "`application.commands`" and "`bot`" from the first grid.
3. Click "`administrator`" from the second grid.
4. Copy the URL below the grids into a browser, and follow the steps
on screen.



## Edit `config.json`

> [!TIP]
> It should be at the base of the project next to index.js

1. **You must enable developer mode, by:**
    - Clicking settings in the bottom left of Discord.
    - Go to "`advanced`".
    - "`Toggle Developer Mode`"
2. **Bot Token:**
    - From Earlier! Return to the Developer Portal if you have lost this.



## Start the bot

1. Open powershell/terminal from the folder
2. Enter `npm install`
3. Enter `node index.js`

> [!WARNING]  
> If you do not see "`[INFO ] : YourBot is up and running`", something is wrong.
> 
> Screenshot the message that appears, try debugging or ask for help if you are struggling.