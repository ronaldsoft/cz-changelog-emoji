# cz-changelog-emoji
Commitzen adapter to following conventional changelog with emoji and custom messages format.

> A [commitizen](https://github.com/commitizen/cz-cli) emoji adapter.

[![NPM](https://nodei.co/npm/emoji-cz.png?downloads=true&stars=true)](https://nodei.co/npm/emoji-cz/)

```
? Select the type of change that you're committing: (Use arrow keys)
❯ ✨  Feat:      A new feature
  🐛  Fix:       A bug fix
  📚  Docs:      Documentation only changes
  🎨  Style:     Changes that do not affect the meaning of the code
  🔨  Refactor:  A code change that neither fixes a bug nor adds a feature
  🚀  Perf:      A code change that improves performance
  🚨  Test:      Adding missing tests or correcting existing tests
```

## Demo
Just check out the commit history above :point_up:

## Installation
```
yarn global add cz-changelog-emoji
# OR
# npm install --global cz-changelog-emoji

# set as default adapter globally
echo '{ "path": "cz-changelog-emoji" }' > ~/.czrc
```

## Usage
Simply use `git cz` instead of `git commit` when committing. See the doc of [Commitizen](https://github.com/commitizen/cz-cli) for more info.

## Settings
You can overwrite the settings in 3 different ways, it will apply the config by this order:

1. `package.json`
2. `.cz.json`
3. `.czrc`

```js
// in package.json
"config": {
  "commitizen": {
    // ...
    "emoji-cz": {
      // Overwrite types prompted to the command line.
      "types": {
        "Fix": {
          "emoji": "🐝", // overwrite "Fix" emoji to a bee
          "name": "Bug", // overwrite "Fix" name to "Bug"
          "description": "Dirty bug" // overwrite description of "Fix"
        },
        // add a new type "Chore"
        "Chore": {
          "emoji": "❓",
          "description": "Other changes that don't modify src or test files"
        }
      },

      // Overwrite the output commit subject in the specified format.
      // Below is the default format,
      // [emoji] will be replace with the chose type's emoji,
      // [name] will be replace with the chose type's name,
      // [subject] will be replace with the subject you entered.
      // One example output of the format can be: `✨ Feat: initial commit`
      "format": "[emoji] [name]: [subject]"
    }
  }
}

// in .cz.json or .czrc
{
  "cz-changelog-emoji": {
    //...
  }
}
```

## Author
Ronald Rivera <ronaldsoft8423@gmail.com>

## License
[MIT](LICENSE)