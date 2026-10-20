# Changelog

## [0.3.1](https://github.com/DeckFilter/steam-deck-battery-tracker/releases/tag/v0.3.1) - 2026-04-08

### Features

- Add an install script and installation instructions.
- Make the battery graph and per-app power consumption rows selectable with a controller.

## [0.3.0](https://github.com/DeckFilter/steam-deck-battery-tracker/releases/tag/v0.3.0) - 2026-03-21

### Features

- Detect battery devices dynamically to support more handhelds, incorporating [Rahat Zaman's upstream contribution](https://github.com/safijari/steam-deck-battery-tracker/pull/6).

### Fixes

- Prefer the main battery over controller batteries and support `power_now` readings on the Legion Go.

### Maintenance

- Add automated GitHub releases.

## [0.2.0](https://github.com/SteamDeckHomebrew/decky-plugin-database/pull/563) - 2024-03-17

### Maintenance

- Update the declared `decky-frontend-lib` dependency to `^3.24.5` for the Decky Store release. The packaged backend and compiled frontend remain unchanged from the previous store version.

## [0.1.0-1](https://plugins.deckbrew.xyz/plugins) - 2024-01-20

### Maintenance

- Publish a Decky Store revision declaring `decky-frontend-lib` `^3.24.3`. The packaged backend and compiled frontend remain unchanged from the first store version.

## [0.1.0](https://github.com/safijari/steam-deck-battery-tracker/releases/tag/0.1.0) - 2023-08-19

### Features

- Release the initial MVP with battery charge history and average power consumption per app.

### Fixes

The first [Decky Store publication on 2023-08-25](https://github.com/SteamDeckHomebrew/decky-plugin-database/pull/424) included these fixes after the MVP GitHub release:

- Query battery history using the selected lookback period.
- Skip per-app power averages when there are no discharging samples.

### Maintenance

- Remove the obsolete coroutine decorator from the async recorder before the first Decky Store publication.
