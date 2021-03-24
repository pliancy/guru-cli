# Guru CLI

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/pliancy/guru-cli/CI)](https://github.com/pliancy/guru-cli)
[![npm](https://img.shields.io/npm/v/guru-cli.svg)](https://www.npmjs.com/package/guru-cli)
[![Downloads](https://img.shields.io/npm/dm/guru-cli.svg)](https://www.npmjs.com/package/guru-cli)
[![Dependency Status](https://img.shields.io/david/pliancy/guru-cli)](https://david-dm.org/pliancy/guru-cli)
[![License](https://img.shields.io/github/license/pliancy/guru-cli)](https://www.npmjs.com/package/guru-cli)

A NodeJS based CLI tool for doing useful things against the Guru KB (<https://getguru.com>)

**_Note: This project is still a work in progress. It is currently in active development. Use at your own risk!_**

This tool was made by us at Pliancy to augment the Guru administration experience. We hope it's useful to others as well!

It currently provides the following features:

- Search all cards with a powerful query language supporting regex in the title, content, collection, and board metadata.
- Verify any card. This works by generating an API token for the card's owner and using it to verify.
- Verify expired (stale) cards.
- Find and replace across all Guru cards with regex support, optional filtering, and powerful preview.
- Backup your cards to JSON format.

![find-replace-482742](https://user-images.githubusercontent.com/34489899/112241533-a8d31e80-8c07-11eb-874a-1a22d26097e4.gif)

## Installation

The NPM method is preferred since it is consistent across operating systems. The homebrew method is for convienence only.

### NPM Method

Install Node JS 14 or greater if you do not already have it from the [Offical NodeJS Download Page](https://nodejs.org/en/download/)

```shell
npm install -g guru-cli

# or

yarn global add guru-cli
```

### Homebrew Method

```bash
brew install pliancy/tap/guru-cli
```

## Getting Started

1. First, you need to authenticate to the guru API. Navigate to <https://app.getguru.com/settings/api-access> and generate an API token for a **Guru admin account**
2. Log in to the cli tool

```bash
$ guru-cli login
Login to Guru API
-------------------
Guru Admin Email: example@company.com
Admin API Token: some-api-token
✅ Successfully authenticated to Guru API. You can now run guru-cli commands.
```

Now you're ready!

## The filter query language

Many commands support a powerful filtering syntax with regex support. The filtering supports a familiar google-style query syntax of `key:value` where key is one of `collection`, `board`, `title`, or `content` and value is any ECMAScript supported regular expression. Typically you can just fuzzy match via something like `title:Overview` which logically means title contains the substring "Overview". See below for more examples of using this filtering.

If you need to ignore case sensitivity in the supplied regex you can pass the `--ignore-case` or `-i` flag to the command.

## Examples

### Find all cards with the words "Typescript" or "Javascript" in the title under the "Engineering" collection

```bash
guru-cli find 'title:Typescript|Javascript collection:Engineering'
```

### Find cards that have the text "Caleb" and "great guy" with anything in between in the content

```bash
guru-cli find 'content:Caleb.*great guy'
```

### Verify all cards that are in an expired (stale) state

```bash
guru-cli verify-expired
```

### Verify a card by its title

```bash
guru-cli verify-by-title 'card title'
```

### Verify a card by its title with optional collection filtering

```bash
guru-cli verify-by-title --collection 'collection title' 'card title'
```

### Verify all cards that are in an expired state

```bash
guru-cli verify-expired
```

### Verify all cards that are in an expired state in collection Engineering with "Overview" in title

```bash
guru-cli verify-expired 'collection:Engineering title:Overview'
```

### Find and replace across all cards with case insensitivity turned on (-i)

```bash
guru-cli find-replace -i 'G Suite' 'Google Workspace'
```

Once you're confident in your changes affecting the proper data in the preview:

```bash
guru-cli find-replace 'G Suite' 'Google Workspace' --confirm
```

### Find and replace across cards except for the ones that have the phrase "this is how you get ants"

This one is a bit more complex because it uses a regex feature known as negitive look-ahead in the filter to accomplish filtering out the relevant cards

```bash
guru-cli find-replace 'Archer' 'Lana' 'content:"^(?!.*this is how you get ants)"'
```

Once you're confident in your changes affecting the proper data in the preview:

```bash
guru-cli find-replace 'Archer' 'Lana' 'content:"^(?!.*this is how you get ants)"' --confirm
```

### Backup your Guru Cards to JSON

```bash
guru-cli backup-cards /path/to/some/folder
```
