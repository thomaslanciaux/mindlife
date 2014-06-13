# Mindlife app

The following technologies are used:

- [AngularJS](http://www.angularjs.org/) (MVW Framework)
- [Browserify](http://browserify.org/) (CommonJS `require()`)
- [Stylus](http://learnboost.github.io/stylus/) (CSS preprocessor)

## Requirement to build the app

- Unix (OS X/Darwin)
- [Node.js](http://nodejs.org/)

## Optional to build app icons from svg

- [Inkscape](http://www.inkscape.org)

## Install development environment

Make sure you are in the root directory of the app:

```
$ npm install
```

## Development

All developped files are uncompressed and located in the `./src/` directory

- [`./src/css/`](https://github.com/thomaslanciaux/mindlife/blob/master/src/css/) Stylus files (will be compiled in [`./dist/index.css`](https://github.com/thomaslanciaux/mindlife/blob/master/dist/))
- [`./src/views/`](https://github.com/thomaslanciaux/mindlife/blob/master/src/views/) Jade files (will be compiled in [`./views/`](https://github.com/thomaslanciaux/mindlife/tree/master/views/))
- [`./src/framework`](https://github.com/thomaslanciaux/mindlife/blob/master/src/framework/) Framework JS files (will be compiled in [`./dist/index.js`](https://github.com/thomaslanciaux/mindlife/tree/master/dist/))
- [`./src/index.js`](https://github.com/thomaslanciaux/mindlife/blob/master/src/index.js) App file (will be compiled in [`./dist/index.js`](https://github.com/thomaslanciaux/mindlife/tree/master/dist/))


## Compilations

Make sure you are in the root directory of the app:

Compile the app (compilation and minification of the JS files, compilation of
the CSS files, compilation of HTML view)

```
$ make
```

Compile only JS:

```
$ make js
```

Compile and minify only JS (longer as the script will first be rendered by
[ngmin](https://github.com/btford/ngmin) then minified with uglifyjs)

```
$ make minjs
```

Compile only CSS:

```
$ make css
```

Compile only HTML views:

```
$ make html
```

Optional if you are designing and installed inkscape previously: 
Convert svg to all correct size for app icons and favicons

```
$ make favicons
```
