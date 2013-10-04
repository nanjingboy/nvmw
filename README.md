NVMW
====

This is a simple Node Version Manager for Windows

## Installation

```shell
npm install -g nvmw
```

## Usage
```shell
nvmw -h

Usage: nvmw [options] [command]

Commands:

  install <version>      build and install the given version of Node
  uninstall <version>    uninstall the given version of Node
  use <version>          use the specified Node in current shell
  deactivate             undo effects of nvmw on current shell
  ls                     list the installed all Nodes
  ls-remote              list remote versions available for install
  cleanup                remove stale local caches

Options:

  -h, --help     output usage information
  -V, --version  output the version number

Examples:

  nvmw install v0.10.20
  nvmw uninstall v0.10.20
  nvmw use v0.10.20
```

## License
>- [MIT](http://www.opensource.org/licenses/MIT)
