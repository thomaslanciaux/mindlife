BIN=./node_modules/.bin
APPICON_SRC=./src/app-icon
APPICON_DIST=./assets/app-icon
APPICON_COLOR="\#34495e"

all: js minjs css html
	
js:
	$(BIN)/browserify src/index.js -o dist/index.js

minjs:
	$(BIN)/ngmin dist/index.js dist/index.js
	$(BIN)/uglifyjs dist/index.js -o dist/index.js

css:
	$(BIN)/stylus -c --include ./node_modules/nib/lib ./src/css/index.styl -o dist/

html:
	$(BIN)/jade src/views/index.jade -o .
	$(BIN)/jade src/views/*.jade -o ./views/
	$(BIN)/jade src/views/components/*.jade -o ./views/components
	$(BIN)/jade src/views/components/form/* -o ./views/components/form

favicon:
	inkscape -f $(APPICON_SRC)/favicon.svg -w 16 -e $(APPICON_DIST)/favicon-16x16.png
	inkscape -f $(APPICON_SRC)/favicon.svg -w 32 -e $(APPICON_DIST)/favicon-32x32.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 96 -e $(APPICON_DIST)/favicon-96x96.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 160 -e $(APPICON_DIST)/favicon-160x160.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 196 -e $(APPICON_DIST)/favicon-196x196.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 57 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-57x57.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 60 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-60x60.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 72 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-72x72.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 76 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-76x76.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 114 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-114x114.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 120 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-120x120.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 144 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-144x144.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 152 -b $(APPICON_COLOR) -e $(APPICON_DIST)/apple-touch-icon-152x152.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 70 -e $(APPICON_DIST)/mstile-70x70.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 144 -e $(APPICON_DIST)/mstile-144x144.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 150 -e $(APPICON_DIST)/mstile-150x150.png
	inkscape -f $(APPICON_SRC)/app-icon.svg -w 310 -e $(APPICON_DIST)/mstile-310x310.png
