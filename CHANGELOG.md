# Changelog

## 1.3.1

### Added or Changed
- Updated all `.md` documentation files
- Added a detailed procedure for generating an X API key
- Updated the `/weekly-sale setup` command to support `ChannelType.GuildAnnouncement`
- Refactored and improved the log structure
- Updated the bot version in `ready.js` and `package.js` to reflect the current release in the bot's status

### Fixed
- Fixed a 403 API error preventing the `InfoChannel` from refreshing <br>
  → The issue was due to the use of the deprecated `summonerId`; replaced with `encryptedPUUID` in API requests

## 1.3

### Added or Changed
- Web scraping of discounted skins (automated task using Twitter API)

## 1.2

### Added or Changed
- Added a `rank-update` channel where match recaps are sent
- Added game cards (live game recaps in the `info-channel`)
- Fixed sorting issues for players with multiple accounts

## 1.1

### Added or Changed
- Added this changelog
- Added a Riot API Readme
- Added a discord application readme
- Fixed some issues in the infopanel

## 1.0

### Added or Changed
- The bot is now officialy deployed !
- Added a database to support new features
- Added the infochannel system

### Removed

- Some packages/libraries from acknowledgements I no longer use