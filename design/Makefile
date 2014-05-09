all: html css

css:
	stylus --include ../node_modules/nib/lib ./src/css/index.styl -o css/

html:
	jade -P src/index.jade -o .
