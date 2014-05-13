compress_svg = ./node_modules/.bin/svgo ./src/assets/$(1) -o ./assets/$(1)

svg:
	$(call compress_svg,"head.svg")
	$(call compress_svg,"icon-graph.svg")
	$(call compress_svg,"icon-heart-c.svg")
	$(call compress_svg,"icon-heart.svg")
	$(call compress_svg,"icon-human.svg")
	$(call compress_svg,"icon-network.svg")
	$(call compress_svg,"logo-brain-dna-variation.svg")
	$(call compress_svg,"logo-brain-dna.svg")
	$(call compress_svg,"logo-brain.svg")
	$(call compress_svg,"logo-dna.svg")
