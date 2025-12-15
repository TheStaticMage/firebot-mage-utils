# TheStaticMage's Firebot Utilities

## Introduction

These are various utilities that I use in my Firebot setup.

I would be willing to contribute any of these utilities to Firebot itself. If any Firebot developers happen across this and are interested in any of this work, please reach out.

## Installation

The script needs to be installed like any other Firebot startup script.

1. From the latest [Release](https://github.com/TheStaticMage/firebot-mage-utils/releases), download `firebot-mage-utils-<version>.js` into your Firebot scripts directory (File &gt; Open Data Folder, then select the "scripts" directory).

2. Enable custom scripts in Firebot (Settings &gt; Scripts) if you have not already done so.

3. Add the `firebot-mage-utils-<version>.js` script that you just added as a startup script (Settings &gt; Scripts &gt; Manage Startup Scripts &gt; Add New Script).

4. Restart Firebot.

## Contents

### Replacement Variables

- **`$closestMatch`**: Closest match for given text in an array using Levenshtein distance.
- **`$fileNameWithExtension`**: Given a directory and a filename without an extension, return the filename (with its extension) that exists in the directory.
- **`$filenamesInDirectory`**: Returns some or all filenames in a given directory, ignoring subdirectories and not recursing.
- **`$formatUSD`**: Converts a number to US dollar currency format with optional division and thousands separators. [Reference](/doc/reference/format-usd.md)
- **`$uFuzzyMatch`**: Closest match using the [uFuzzy](https://github.com/leeoniya/uFuzzy) implementation.

## Support

The best way to get help is in my Discord server. Join the [The Static Discord](https://discord.gg/tkV4mZDAej) and then visit the `#firebot-mage-utils` channel there.

- Please do not DM me on Discord.
- Please do not ask for help in my chat when I am live on Twitch.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/TheStaticMage/firebot-mage-utils/issues).

## Contributing

Contributions are welcome via [Pull Requests](https://github.com/TheStaticMage/firebot-mage-utils/pulls). I _strongly suggest_ that you contact me before making significant changes, because I'd feel really bad if you spent a lot of time working on something that is not consistent with my vision for the project. Please refer to the [Contribution Guidelines](/.github/contributing.md) for specifics.

## License

This script is released under the [GNU General Public License version 3](/LICENSE). That makes it free to use whether your stream is monetized or not.

If you use this on your stream, I would appreciate a shout-out. (Appreciated, but not required.)

- <https://www.twitch.tv/thestaticmage>
- <https://kick.com/thestaticmage>
- <https://youtube.com/@thestaticmagerisk>
