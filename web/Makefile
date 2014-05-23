all: js css html
	
js:
	browserify src/index.js -o index.js

css:
	stylus --include ../node_modules/nib/lib ./src/css/index.styl -o .

html:
	jade src/views/index.jade -o .
	jade src/views/page.jade -o ./views
