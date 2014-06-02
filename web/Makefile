all: js minjs css html
	
js:
	browserify src/index.js -o dist/index.js

minjs:
	ngmin dist/index.js dist/index.js
	uglifyjs dist/index.js -o dist/index.js

css:
	stylus -c --include ../node_modules/nib/lib ./src/css/index.styl -o dist/

html:
	jade src/views/index.jade -o .
	jade src/views/*.jade -o ./views/
	jade src/views/components/*.jade -o ./views/components
	jade src/views/components/form/* -o ./views/components/form
