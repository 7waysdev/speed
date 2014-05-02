VTEX Speed
=====

VTEX Store development tools - reverse proxy, compilation, minification, optimization and more!

## Quick Start

Download and unzip this repo:

    wget -qO- -O vtex-speed.zip https://github.com/vtex/speed/archive/master.zip && unzip vtex-speed.zip && rm vtex-speed.zip
    cd speed-master
    npm i
    grunt

Go to a store on the `vtexlocal` hostname!

Example: http://basedevmkp.vtexlocal.com.br/?debugcss=true

Now, copy a CSS file from that site over to your `src/` folder.
We already have `src/arquivos/style.css` there as an example.

Go ahead and add a new rule to that file:

    body {
        background: black;
    }

Nice! Live Reload has reloaded that stylesheet for you.

## Features

All files in `src/` are compiled, optimized and copied to `build/` when you run `grunt`.

You can further configure this process editing `Gruntfile.coffee`.

Currently supported:

- LiveReload of assets in HTTP and HTTPS
- Coffee compilation
- LESS compilation
- JS and CSS Minification

But, hey, there's more!

## Discover new Grunt plugins

There are a **ton** of available Grunt plugins for your every need.

Go to http://gruntjs.com/plugins for a complete list.

If you think there's a plugin that's great for everybody, why don't you [fork this repo and open a pull request](https://github.com/vtex/speed/fork)?

## Advanced options

If you want to open the same store every time, you can add an `accountName` property to your `package.json` file:

    "accountName": "basedevmkp"

Now, when `grunt` runs, this store will open automatically.

## Feedback

We always want to hear you! Please report any problems to the issues page:

https://github.com/vtex/speed/issues