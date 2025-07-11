<a id="readme-top"></a>



<!-- PROJECT LOGO -->
<div align="center">
  <h1 align="center">EzBot</h1>
  <i>Your personal multipurpose Discord bot, perfect for managing a multigaming server for friends.</i>
  <br/><br/>
  <img width="140" alt="EzBot" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/88c6ac91-e30a-4c67-a92d-e8178abac9bd/devdlvv-6a12f604-4c12-4b6a-9fc3-b70090b6bdd3.png/v1/fill/w_894,h_894,q_70,strp/ezreal___lol_icon_by_editsbyjadewolf_devdlvv-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTIwMCIsInBhdGgiOiJcL2ZcLzg4YzZhYzkxLWUzMGEtNGM2Ny1hOTJkLWU4MTc4YWJhYzliZFwvZGV2ZGx2di02YTEyZjYwNC00YzEyLTRiNmEtOWZjMy1iNzAwOTBiNmJkZDMucG5nIiwid2lkdGgiOiI8PTEyMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.2lmOH_8N1hKO-ZG-xhQKJ3Dc491WIMKow6eWg1fM03I"/>
  <br/><br/>
  <a target="_blank" href="https://github.com/IamFlucs/discord-slash-bot-main"><img src="https://img.shields.io/badge/Language-JS-3ce5de?logo=nodedotjs&color=2370d5&logoColor=fff" alt="Last commit"/></a>
  <a href="https://github.com/IamFlucs/discord-slash-bot-main/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-2379e9?logo=opensourceinitiative&logoColor=fff" alt="License MIT"/></a>
  <a href="https://github.com/IamFlucs/discord-slash-bot-main/blob/main/README.md"><img src="https://img.shields.io/badge/version-v1.3.1-2673d8?logo=hackthebox&logoColor=fff" alt="Current Version"/></a>
  <br/><br/>
  <a target="_blank" href="https://github.com/IamFlucs/discord-slash-bot-main/blob/main/README.md"><img src="https://img.shields.io/badge/discord.js-v14.14.1-5865F2?logo=Discord&logoColor=fff"/></a>
  <a target="_blank" href="https://github.com/IamFlucs/discord-slash-bot-main/blob/main/src/database/schemas/README.md"><img src="https://img.shields.io/badge/MongoDB-v4.4-47A248?logo=MongoDB&logoColor=fff"/></a>
  <a target="_blank" href="https://github.com/IamFlucs/discord-slash-bot-main/blob/main/src/api/riot/README.md"><img src="https://img.shields.io/badge/API-Riot Games-dc291e?logo=RiotGames&logoColor=fff"/></a>
  <a target="_blank" href="https://github.com/IamFlucs/discord-slash-bot-main/blob/main/src/api/riot/README.md"><img src="https://img.shields.io/badge/API-Twitter-151b23?logo=x&logoColor=fff"/></a>
  <br/><br/>
  <a href="https://github.com/IamFlucs/discord-slash-bot-main/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
  ·
  <a href="https://github.com/IamFlucs/discord-slash-bot-main/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
</div>


<!-- DESCRIPTION -->
## Description
EzBot is a Discord bot designed to provide detailed information about League of Legends players, including their current ranks and real-time game status. This bot is designed to be integrated into Discord servers to facilitate the tracking and management of player information.



## Features

<details>
    <summary><b>🔊 Temporary Voice Channels</b></summary>
    <p>Creation of temporary voice channels, facilitating party organization and discussions.</p>
    <img src="https://github.com/user-attachments/assets/51430e69-6b16-483d-9729-2ddc1e1a8e2f" alt="Outer GIF" width="240">
    <p>&nbsp</p>
    <details>
        <summary>Setup a voice channel</summary>
        <p>Use <code>/join-to-create setup</code> to enable a jtc channel.</p>
        <img src="https://github.com/user-attachments/assets/22a94d08-1a4a-496d-aabf-52e80d327996" alt="Inner GIF 1" width="650">
        <p>&nbsp</p>
    </details>
    <details>
        <summary>Disable a jtc channel</summary>
        <p>Use <code>/join-to-create disable</code> to disable a jtc channel.</p>
        <img src="https://github.com/user-attachments/assets/a6d0ec9a-2fbc-4be4-aa2b-b69dd0c1ade8" alt="Inner GIF 2" width="650">
        <p>&nbsp</p>
    </details>
    <details>
        <summary>List all jtc channels</summary>
        <p>Use <code>/join-to-create list</code> to show all jtc channels.</p>
        <img src="https://github.com/user-attachments/assets/1ee059b5-64c9-40d7-942b-6cd62bf5b2a5" alt="Inner GIF 3" width="650">
    </details>
    <p>&nbsp</p>
</details>

<details>
    <summary><b>⭐ Information Panel</b></summary>
    <p>League of Legends feature where EzBot sends an infopanel with information about all the registered players.<br>
    Ideally the information channel does not allow sending messages to users other than the bot.</p>
    <img src="https://github.com/user-attachments/assets/17dda7bb-1abb-42ba-a487-586933759963" alt="Outer JPG" width="787">
    <p>&nbsp</p>
    <details>
        <summary>Create an infochannel</summary>
        <p>Use <code>/create-infochannel</code> to create a new infochannel where EzBot can send the infopanel.</p>
        <img src="https://github.com/user-attachments/assets/638f86ab-04ad-4371-b4cf-a31f9c6582cb" alt="Inner GIF 1" width="650">
        <p>&nbsp</p>
    </details>
    <details>
        <summary>Delete an infochannel</summary>
        <p>Use <code>/delete-infochannel</code> to delete the infochannel.</p>
        <img src="https://github.com/user-attachments/assets/7cd25c8c-7510-4081-a832-62517af1aec4" alt="Inner GIF 2" width="650">
    </details>
    <p>&nbsp</p>
</details>

<details>
    <summary><b>🃏 Game Card option</b></summary>
    <p>Optional feature of the <code>⭐ Information Panel</code> where information cards about current games are sent under the information panel.<br>
    The cards are only displayed during the game and are deleted once game is finished.</p>
    <img src="https://github.com/user-attachments/assets/37408511-405f-4251-9e89-100bb2b00f19" alt="Outer JPG" width="436">
    <p>&nbsp</p>
    <details>
        <summary>Toggle game card option</summary>
        <p>Use <code>/toggle-gamecard</code> inside the Information Channel to toggle the option for game card feature.</p>
        <img src="https://github.com/user-attachments/assets/7698b86a-f247-400f-b5bf-29a632b3c951" alt="Inner GIF 1" width="503">
        <p>&nbsp</p>
    </details>
    <p>&nbsp</p>
</details>

<details>
    <summary><b>📈 Rank Update</b></summary>
    <p>League of Legends feature where EzBot sends daily, weekly and monthly rank updates about all the registered players.</p>
    <img src="https://github.com/user-attachments/assets/7132e5ae-9085-4cbb-af74-36ffbfefe370" alt="Outer JPG" width="534">
    <p>&nbsp</p>
    <details>
        <summary>Create a rank update channel</summary>
        <p>Use <code>/create-rankchannel</code> to create a new rankchannel where EzBot can send the rank update embeds.</p>
        <img src="https://github.com/user-attachments/assets/911d8939-f931-49a5-b476-6aec20abf9d3" alt="Inner GIF 1" width="499">
        <p>&nbsp</p>
    </details>
    <details>
        <summary>Delete a rank update channel</summary>
        <p>Use <code>/delete-rankchannel</code> inside the rank channel to delete it.</p>
        <img src="https://github.com/user-attachments/assets/7b9e2239-ade7-4743-8d71-82caf03bc630" alt="Inner GIF 2" width="440">
    </details>
    <p>&nbsp</p>
</details>

<details>
    <summary><b>🪙 Weekly Sale</b></summary>
    <p>
      A League of Legends feature that automatically monitors Twitter for weekly skin sales, then posts updates to a specified Discord channel.<br>
      Ideal for community servers that want to keep members informed of current deals in-game.
    </p>
    <img src="https://github.com/user-attachments/assets/31c84669-41ec-4556-bf41-534138df6f8b" alt="Outer JPG" width="499">
    <p>&nbsp</p>
    <details>
        <summary>Setup a Weekly Sale Channel</summary>
        <p>
          Use the <code>/weekly-sale setup</code> command to enable automatic sale postings in a chosen channel.<br>
          Sales are posted every Monday at 19:15.
        </p>
        <img src="https://github.com/user-attachments/assets/76f69534-46bd-469c-af9a-415489a0f33e" alt="Inner GIF 1" width="560">
        <p>&nbsp</p>
    </details>
    <details>
        <summary>Disable the Weekly Sale Channel</summary>
        <p>
          Use <code>/weekly-sale disable</code> to deactivate the feature in the selected channel.<br>
          This will stop the bot from posting weekly sale updates there.
        </p>
        <img src="https://github.com/user-attachments/assets/389a8f87-c1b6-4496-a2ef-0584f6f2dcc1" alt="Inner GIF 2" width="560">
        <p>&nbsp</p>
    </details>
    <details>
        <summary>List All Weekly Sale Channels</summary>
        <p>
          Use <code>/weekly-sale list</code> to display all channels currently configured for weekly sale updates.<br>
          Helpful for server admins managing multiple channels.
        </p>
        <img src="https://github.com/user-attachments/assets/fa69ce2a-2da2-4aea-9473-f14dda45f57e" alt="Inner GIF 3" width="560">
    </details>
    <p>&nbsp</p>
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

- Node.js (version 16.9 or higher)
- MongoDB (4.4). My [`setup`](https://github.com/IamFlucs/discord-slash-bot-main/blob/main/src/database/README.md) cover only Ubuntu installation.
- A Discord account and a server where you can add bots. See [`SETUP.md`](https://github.com/IamFlucs/discord-slash-bot-main/blob/main/SETUP.md) to setup your bot application.
- A Riot Games API key. See [`Riot README.md`](https://github.com/IamFlucs/discord-slash-bot-main/blob/main/src/api/riot/README.md) for more information.
- An X API key. See [`X README.md`](https://github.com/IamFlucs/discord-slash-bot-main/blob/main/src/api/twitter/README.md) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

1. Clone this repository to your local machine:
```sh
git clone https://github.com/your-username/EzBot.git
cd EzBot
```
2. Install the dependencies:
```sh
npm install
```
3. Create a `config.json` file at the root of the project and add your environment variables:
```json
{
    "token": "your-discord-bot-token",
    "clientId": "your-bot-id",
    "riotApiKey": "your-riot-api-key",
    "mongodbUrl": "your-mongodb-uri",
    "xBearerToken": "your-x-api-key"
}
```
4. Start the bot:
```sh
node index.js
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Once the bot is added to your Discord server, you will need to `/create-infochannel` to automatically generate an information panel. It start updating registered player information every 20 minutes. Available commands include:

- `/register` add a new player with an account.
- `/delete-player` delete a player with his account(s).
- `/add-account` add an account to an existing player.
- `/remove-account` if player have multiple accounts, remove one else delete the player.
- `/stats profile` displays rank information for a specific player.
- Temporary Voice Channels:
  - Join a set up voice channel to create a new temporary voice channel.
  - The channel will be automatically deleted when all users have left.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

### Core Features
- [x] Database setup  
- [x] Global commands・Implement commands so they are usable across all servers the bot is in

### Voice Channel System (Join to Create)
- [x] Set up / disable Join to Create channel  
- [x] Auto-manage temporary voice channels based on user activity  
- [x] List all configured Join to Create channels  

### League of Legends Integration

#### InfoChannel (InfoPanel)
- [x] Full command set for players to register in the database  
- [x] Display in-game players first  
- [x] Rank players based on their SoloQ rank  
- [x] Show last SoloQ LP gain/loss・This feature has been **deactivated** because InfoPanel was too long  
- [x] Game Card option・Toggle to send game cards in the InfoChannel (default = false)  
  - [x] Create game cards  
  - [x] Update handler with removal of old game cards  

#### Rank Update Channel
- [x] Track LP variation in the database  
- [x] Generate periodic rank updates via embeds  

#### Skin Sales Scraping (X integration)
- [x] Web scraping system to retrieve discounted skins・Runs every Monday at 19:00 using the Twitter API  

### Upcoming Features
- [ ] Member Count Channel・Display the current number of server members in a voice/text channel  
- [ ] Minecraft Server Status・Display the status of a Minecraft server in a designated channel  
- [ ] Welcome Messages・Send randomized welcome messages when a new member joins  
- [ ] Leave Messages・Send randomized messages when a member leaves  
- [ ] Call of Duty API Integration・Commands to track player stats → Possibly add InfoChannel support for displaying KDA  
- [ ] Reaction Roles・Create an embed where users can react to assign themselves roles → Inspired by [Carl Bot](https://github.com/dhvitOP/multiple-purpose-discord-bot-like-carlbot/blob/master/commands/🎭Reaction%20Roles/create.js)  
- [ ] Button Roles・Create an embed with clickable buttons to assign roles → Example from [Comfi](https://github.com/Only-Moon/Comfi/blob/master/commands/roles/buttonroles.js)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a branch for your feature (`git checkout -b my-feature`).
3. Commit your changes (`git commit -am 'Add my feature'`).
4. Push your branch (`git push origin my-feature`).
5. Open a Pull Request.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

![Static Badge](https://img.shields.io/badge/Discord-theflucs-5865F2?logo=Discord&logoColor=fff)

Project Link: [https://github.com/IamFlucs/discord-slash-bot-main](https://github.com/IamFlucs/discord-slash-bot-main)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgment

I would like to give credit to the resources and individuals who have been helpful in the development of EzBot. Special thanks to:

- KaluNight with his repository [Zoe-Discord-Bot](https://github.com/Zoe-Discord-Bot/Zoe-Discord-Bot)
- [Shields.io](https://shields.io/badges/static-badge)
- [Simple Icons](https://simpleicons.org/)

Your support and contributions are greatly appreciated!

<p align="right">(<a href="#readme-top">back to top</a>)</p>
