#DOC_ROOT=/srv/http/whsminecraft.de/
DOC_ROOT=/home/ruben/whsminecraft.de/

SRC_FILES := $(wildcard webroot/*)
SRC_FILES := $(filter-out webroot/map, $(SRC_FILES))


clean:
	@echo Cleaning old views...
	rm -rf _views/tmp/*

posts: clean
	@./render_blogs

publish:
	@echo Copying files to live web server...
	cp -r ${SRC_FILES} ${DOC_ROOT}

