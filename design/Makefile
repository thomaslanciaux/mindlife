all: html css js

js:
	browserify src/index.js -o index.js

css:
	stylus --include ../node_modules/nib/lib ./src/css/index.styl -o css/

html:
	jade -P src/index.jade -o .
