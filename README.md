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

##Warnings
>- It doesn't work in Windows Powershell
>- You should install a system version Node with Windows installer

## Release History
_2013-10-30   v0.1.2   Exit Node process while switch or switch-deactivate run failed_

_2013-10-30   v0.1.1   Add switch and switch-deactivate commands_

_2013-10-05   v0.1.0   Release the first version_

## License
>- [MIT](http://www.opensource.org/licenses/MIT)
