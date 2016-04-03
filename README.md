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

    nvmw install v0.10.20
    nvmw uninstall v0.10.20
    nvmw use v0.10.20
```

## Notes
* It doesn't work in Windows Powershell
* The latest version for npm is 1.4.12
* You should install a system version Node with Windows installer
* Node versions will be installed on the path X:\Users\<yourUserName>\AppData\Roaming\nvm\

## License
[MIT](http://www.opensource.org/licenses/MIT)
