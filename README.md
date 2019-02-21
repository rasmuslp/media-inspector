# media-inspector

[![CircleCI](https://circleci.com/gh/rasmuslp/media-inspector.svg?style=shield&circle-token=21fe02e13458f4ce20cd844453b47dbb540f32d8)](https://circleci.com/gh/rasmuslp/media-inspector)
[![codecov](https://codecov.io/gh/rasmuslp/media-inspector/branch/master/graph/badge.svg?token=W1WmybGFxx)](https://codecov.io/gh/rasmuslp/media-inspector)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b17230f59081472092c5578031885b37)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rasmuslp/media-inspector&amp;utm_campaign=Badge_Grade)

> Find media files by searching in metadata

## Requirements
  * Node 8 or newer
  * [mediainfo](https://mediaarea.net/en/MediaInfo) executable in `$PATH`

## Installation
```bash
$ npm install -g media-inspector
```

## Use
```bash
$ media-inspector --read <path/to/directory> --filter <path/to/filter>
```

## Example
```bash
$ media-inspector --read <path/to/directory> --filter examples/filter-default.json --include-auxiliary --verbose
```
## How filters work
A `filter` is a list of `rules`. A `rule` is a prioritised list of `conditions`.
A `rule` is considered satisfied when all its `conditions` are satisfied.
When a media file satisfies all the `conditions` of *any* `rule`, that media-file is considered a match.

## Notes

  * [https://github.com/yargs/yargs]
  * [https://github.com/jshttp/mime-types#readme]
  * [https://github.com/mgcrea/node-mediainfo-parser]

## Test files
[https://www.sample-videos.com/about.php]

