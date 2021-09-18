media-inspector
===============

[![NPM package](https://img.shields.io/npm/v/media-inspector.svg)](https://www.npmjs.com/package/media-inspector)
[![Github: CI CD](https://github.com/rasmuslp/media-inspector/workflows/CI%20CD/badge.svg)](https://github.com/rasmuslp/media-inspector/actions)
[![codecov](https://codecov.io/gh/rasmuslp/media-inspector/branch/master/graph/badge.svg?token=W1WmybGFxx)](https://codecov.io/gh/rasmuslp/media-inspector)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f3254449eccb484bb8fb5400ef344611)](https://www.codacy.com/manual/rasmuslp/media-inspector?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rasmuslp/media-inspector&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/f3254449eccb484bb8fb5400ef344611)](https://www.codacy.com/manual/rasmuslp/media-inspector?utm_source=github.com&utm_medium=referral&utm_content=rasmuslp/media-inspector&utm_campaign=Badge_Coverage)

> Find media files by searching in the metadata

<!-- toc -->
* [Requirements](#requirements)
* [Supported media mime-types](#supported-media-mime-types)
* [Usage](#usage)
* [Commands](#commands)
* [How filters work](#how-filters-work)
* [Notes](#notes)
* [Test files](#test-files)
<!-- tocstop -->

# Requirements
* Node 12 or newer
* NPM 7 series (for development) - automatically installs peer dependencies
* [ffmpeg](https://ffmpeg.org) executable in `$PATH`
* [mediainfo](https://mediaarea.net/en/MediaInfo) executable in `$PATH`

# Supported media mime-types
The current list of supported mime-types is
* `video/`

However, as Mediainfo is utilised for reading the metadata, it should be fairly simple to expand that to include both `audio` and `image/`.

# Usage
<!-- usage -->
```sh-session
$ npm install -g media-inspector
$ media-inspector COMMAND
running command...
$ media-inspector (-v|--version|version)
media-inspector/0.4.2 darwin-x64 node-v14.17.3
$ media-inspector --help [COMMAND]
USAGE
  $ media-inspector COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`media-inspector autocomplete [SHELL]`](#media-inspector-autocomplete-shell)
* [`media-inspector cache`](#media-inspector-cache)
* [`media-inspector help [COMMAND]`](#media-inspector-help-command)
* [`media-inspector inspect`](#media-inspector-inspect)
* [`media-inspector validate-filter FILTERPATH`](#media-inspector-validate-filter-filterpath)
* [`media-inspector video-errors VIDEOPATH`](#media-inspector-video-errors-videopath)

## `media-inspector autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ media-inspector autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ media-inspector autocomplete
  $ media-inspector autocomplete bash
  $ media-inspector autocomplete zsh
  $ media-inspector autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `media-inspector cache`

Cache metadata for a directory structure as JSON

```
USAGE
  $ media-inspector cache

OPTIONS
  -r, --read=read    (required) Path of a directory or file to read
  -w, --write=write  (required) Path of where to write the metadata cache as JSON

EXAMPLES
  $ media-inspector cache -r ~/Downloads -w downloads.json
  $ media-inspector cache -r ~/Downloads/file.ext -w file.json
  $ media-inspector cache -r /Users/username/Downloads -w ~/Desktop/downloads.json
```

_See code: [src/cli/commands/cache.ts](https://github.com/rasmuslp/media-inspector/blob/v0.4.2/src/cli/commands/cache.ts)_

## `media-inspector help [COMMAND]`

display help for media-inspector

```
USAGE
  $ media-inspector help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `media-inspector inspect`

Inspect input with filter

```
USAGE
  $ media-inspector inspect

OPTIONS
  -f, --filter=filter     (required) Path of the filter to apply in JSON or JSON5
  -i, --includeAuxiliary  Will also include empty directories and 'container' directories
  -r, --read=read         (required) Path of a directory or file, or a metadata cache file to read
  -v, --verbose           Enable to get detailed information and progress

EXAMPLES
  $ media-inspector inspect -r ~/Downloads -f ./examples/filter-default.json5
  $ media-inspector inspect -r ~/Downloads/file.ext -f ./examples/filter-default.json5
  $ media-inspector inspect -r downloads.json -f ./examples/filter-default.json5
  $ media-inspector inspect -r downloads.json -f ./examples/filter-default.json5 -i -v
```

_See code: [src/cli/commands/inspect.ts](https://github.com/rasmuslp/media-inspector/blob/v0.4.2/src/cli/commands/inspect.ts)_

## `media-inspector validate-filter FILTERPATH`

Validate filter

```
USAGE
  $ media-inspector validate-filter FILTERPATH

ARGUMENTS
  FILTERPATH  Path to filter in JSON or JSON5

EXAMPLE
  $ media-inspector validate-filter ./examples/filter-default.json5
```

_See code: [src/cli/commands/validate-filter.ts](https://github.com/rasmuslp/media-inspector/blob/v0.4.2/src/cli/commands/validate-filter.ts)_

## `media-inspector video-errors VIDEOPATH`

Checks video files for errors by decoding them

```
USAGE
  $ media-inspector video-errors VIDEOPATH

ARGUMENTS
  VIDEOPATH  Path to video file or directory of video files

OPTIONS
  -d, --demux-only         Skip decode and demux only
  -e, --ext=ext            File extensions to match - default: all
  -p, --parallel=parallel  (required) [default: 1] Number of parallel processes to utilise for decoding - default: 1
  -v, --verbose            Enable to get detailed information and progress

EXAMPLES
  $ media-inspector video-errors ./path/to/video.ext
  $ media-inspector video-errors ./path/to/directory-with-video-files
  $ media-inspector video-errors ./path/to/directory-with-video-files --ext .ts,.mp4 --parallel 4
```

_See code: [src/cli/commands/video-errors.ts](https://github.com/rasmuslp/media-inspector/blob/v0.4.2/src/cli/commands/video-errors.ts)_
<!-- commandsstop -->

# How filters work
A `filter` is a list of `rules`. A `rule` is a prioritised list of `conditions`.
A `rule` is considered satisfied when all its `conditions` are satisfied.
When a media file satisfies all the `conditions` of _any_ `rule`, that media-file is considered a match.

# Notes
* <https://github.com/jshttp/mime-types#readme>
* <https://github.com/mgcrea/node-mediainfo-parser>

# Test files
<https://www.sample-videos.com/about.php>
