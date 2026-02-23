# Firebot Mage Utils

## Introduction

This is a [Firebot](https://firebot.app) plugin that adds utility replacement variables for common workflows.

## Features

### Replacement Variables

- **`$closestMatch`**: Closest match for given text in an array using Levenshtein distance.
- **`$degreesToDirection`**: Converts a bearing in degrees to a compass direction (8-point: N, NE, E, SE, S, SW, W, NW; or 16-point with sub-directions).
- **`$ensureArray`**: Ensures input is an array. Wraps primitives, extracts object keys, and converts null/undefined to empty arrays.
- **`$fileNameWithExtension`**: Given a directory and a filename without an extension, return the filename with its extension that exists in the directory.
- **`$filenamesInDirectory`**: Returns some or all filenames in a given directory, ignoring subdirectories and not recursing.
- **`$flattenArray`**: Flattens nested arrays and objects into a single-level array, with configurable depth limit.
- **`$formatUSD`**: Converts a number to US dollar currency format with optional division and thousands separators. [Reference](/doc/reference/format-usd.md)
- **`$haversineDistance`**: Calculates the distance in meters between two geographic coordinates using the Haversine formula.
- **`$metersToMiles`**: Converts a distance in meters to miles.
- **`$milesToMeters`**: Converts a distance in miles to meters.
- **`$streamUptime`**: Returns the current Twitch stream uptime in seconds as a string, or `-1` when the stream is offline. Use built-in `$uptime` if you want a formatted string.
- **`$travelBearing`**: Calculates the initial bearing in degrees (0-360) from one geographic coordinate to another.
- **`$uFuzzyMatch`**: Closest match using the [uFuzzy](https://github.com/leeoniya/uFuzzy) implementation.

## Documentation

- [Installation](/doc/installation.md)
- [Upgrading](/doc/upgrading.md)
- [Format USD Reference](/doc/reference/format-usd.md)

## Support

The best way to get help is in my Discord server. Join [The Static Discord](https://discord.gg/tkV4mZDAej) and visit the `#firebot-mage-utils` channel.

- Please do not DM me on Discord.
- Please do not ask for help in my chat when I am streaming.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/TheStaticMage/firebot-mage-utils/issues).

## Contributing

Contributions are welcome via [Pull Requests](https://github.com/TheStaticMage/firebot-mage-utils/pulls). I _strongly suggest_ that you contact me before making significant changes. Please refer to the [Contribution Guidelines](/.github/contributing.md) for specifics.

## License

This plugin is released under the [GNU General Public License version 3](/LICENSE). That makes it free to use whether your stream is monetized or not.

If you use this on your stream, I would appreciate a shout-out. (Appreciated, but not required.)

- <https://www.twitch.tv/thestaticmage>
- <https://kick.com/thestaticmage>
- <https://youtube.com/@thestaticmagerisk>
