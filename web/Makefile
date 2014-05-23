all: js css html
	
js:
	browserify src/index.js -o index.js

css:
	stylus --include ../node_modules/nib/lib ./src/css/index.styl -o .

html:
	jade src/views/index.jade -o .
	jade src/views/home.jade -o ./views
	jade src/views/page.jade -o ./views
	jade src/views/signin.jade -o ./views
	jade src/views/components/description-only.jade -o ./views/components
	jade src/views/components/description-gallery.jade -o ./views/components
	jade src/views/components/youtube-embed.jade -o ./views/components
