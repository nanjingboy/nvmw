nvmw
====

This is a simple Node Version Manager for Windows

[![npm](https://img.shields.io/npm/v/nvmw.svg?style=plastic)](https://npmjs.org/package/nvmw) [![npm](https://img.shields.io/npm/dm/nvmw.svg?style=plastic)](https://npmjs.org/package/nvmw) [![npm](https://img.shields.io/npm/dt/nvmw.svg?style=plastic)](https://npmjs.org/package/nvmw)

## Installation

```shell
npm install -g nvmw
```

## Usage
```shell
nvmw -h

  Usage: nvmw [options] [command]

  Commands:

    install <version>      install the given version of Node
    uninstall <version>    uninstall the given version of Node
    use <version>          use the given version of Node in current shell
    deactivate             undo effects of nvmw in current shell
    switch <version>       permanently use the given version of Node as default
    switch-deactivate      permanently undo effects of nvmw
    ls                     list the installed all Nodes
    ls-remote              list remote versions available for install
    cleanup                remove stale local caches

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    nvmw install v8.12.0
    nvmw uninstall v8.12.0
    nvmw use v8.12.0
```

## Notes

* It only works in Windows CMD.
* This tool can't install the Node which version below v4.5.0.
* You should install a system version Node with [Windows installer](https://nodejs.org/en/download/).

## License
[MIT](http://www.opensource.org/licenses/MIT)
