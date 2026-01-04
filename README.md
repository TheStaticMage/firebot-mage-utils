# Firebot Mage Utils

## Introduction

This is a [Firebot](https://firebot.app) plugin that adds utility replacement variables for common workflows.

## Features

### Replacement Variables

- **`$closestMatch`**: Closest match for given text in an array using Levenshtein distance.
- **`$fileNameWithExtension`**: Given a directory and a filename without an extension, return the filename with its extension that exists in the directory.
- **`$filenamesInDirectory`**: Returns some or all filenames in a given directory, ignoring subdirectories and not recursing.
- **`$formatUSD`**: Converts a number to US dollar currency format with optional division and thousands separators. [Reference](/doc/reference/format-usd.md)
- **`$streamUptime`**: Returns the current Twitch stream uptime in seconds as a string, or `-1` when the stream is offline. Use built-in `$uptime` if you want a formatted string.
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
