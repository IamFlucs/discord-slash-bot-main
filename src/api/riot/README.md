# Obtain your RIOT API Key
Sign in to your [Riot Developer Account](https://https://developer.riotgames.com/apis#) and in the **Dashboard** section, you should see your **Development [API Key](https://developer.riotgames.com)**:
![dashboard](https://github.com/user-attachments/assets/65b34ca2-cddb-4fc9-9e8e-899597f9d20a)

> [!NOTE]
> The Riot API key expires after 24 hours. If it’s been more than 24 hours since you last got your key, you must log in again and generate a new key by clicking the REGENERATE API KEY button.

To obtain a much durable key, register your project as **personal app**.
![Register](https://github.com/user-attachments/assets/addd720b-97f2-4f9c-b26f-91eafdb01421)
![Key](https://github.com/user-attachments/assets/6c29c383-43f6-44ff-9394-f07fb7c46c51)

## Personal App
Register your project to apply for a Personal API Key without the verification process. This is only for the Standard API’s, not Tournaments. Personal Keys require a detailed description of the project.

## Authentication via Headers
The Riot API accepts your API key via headers. This is the cleaner method to authenticate. The header is `X-Riot-Token` For example:
```sh
// config.json

"X-Riot-Token": "RGAPI-b5x9Ax3f-3x13-4A9x-x9Y2-10AX9eXx8494"`
```

## Example Usage of Riot API
There are 3 primary places that you will get IDs: from a summoner name, from match data, and from leagues.

In our example we want to get the current rank of TSM Bjergsen on the North American server. We will get his summoner ID through Summoner-V4's by-name endpoint.

We will build our URL, making sure to URL encode the name:
```sh
https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/TSM%20Bjergsen
```

We get a response as follows:
```json
{
    "id": "GNCF41eAxXVw7TVyVN84Jk7iWVUwN_R16ZGDtwS8-2NMpGQ",
    "accountId": "33yjTTkusyHOCSy3_4WU2kGJ0CyEesx9BydA9DN5U1Qj4pQ",
    "puuid": "WX9LmetKzMz6wKHE2pR8RMim8nmv9CV6vrWxww4rgBpKG9FnleQHRY7HycMhamfxazFd5rMBjT49kA",
    "name": "TSM Bjergsen",
    "profileIconId": 3271,
    "revisionDate": 1599420939000,
    "summonerLevel": 242
}
```

We will be using the `encryptedSummonerId` **puuid** response.

> [!IMPORTANT]  
> You cannot use puuids obtained with one key with a second key. 
> Puuids are unique for each token.

Now that we have our PUUID we will pass it to League-V4's by-summoner endpoint.

We will build our URL:
```sh
https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/TSM%20Bjergsen
```

We get the following response:
```json
[
    {
        "leagueId": "ca31c2ee-771c-453b-8527-76152d0c15fc",
        "queueType": "RANKED_SOLO_5x5",
        "tier": "DIAMOND",
        "rank": "II",
        "summonerId": "GNCF41eAxXVw7TVyVN84Jk7iWVUwN_R16ZGDtwS8-2NMpGQ",
        "summonerName": "TSM Bjergsen",
        "leaguePoints": 75,
        "wins": 405,
        "losses": 351,
        "veteran": false,
        "inactive": false,
        "freshBlood": false,
        "hotStreak": false
    }
]
```

We can successfully see Bjergsen is placed in 1 queue (1 element in the list) where he is Diamond 2 in Solo Queue.
