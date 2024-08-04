# Obtain your RIOT API Key
Sign in to your [Riot Developer Account](https://https://developer.riotgames.com/apis#) and in the **Dashboard** section, you should see your **Development [API Key](https://developer.riotgames.com)**:
![alt](https://apipheny.io/wp-content/uploads/2020/04/1-6-1024x604.jpg "Register your project")

> [!NOTE]
> The Riot API key expires after 24 hours. If it’s been more than 24 hours since you last got your key, you must log in again and generate a new key by clicking the REGENERATE API KEY button.

To obtain a much durable key, register your project as **personal app**.
## Personal App
Register your project to apply for a Personal API Key without the verification process. This is only for the Standard API’s, not Tournaments. Personal Keys require a detailed description of the project.

## Authentication via Headers
The Riot API accepts your API key via headers. This is the cleaner method to authenticate. The header is `X-Riot-Token` For example:
```sh
// config.json

"X-Riot-Token": "RGAPI-b529Ax3f-3Y13-4A9d-a9Y2-10Ab9ecc8494"`
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
