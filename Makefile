.PHONY=all debug clean mrproper


DOC_ROOT=/srv/http/whsminecraft.de/


SRC_FILES := $(wildcard webroot/*)
SRC_FILES := $(filter-out webroot/map, $(SRC_FILES))

PARTIALS := _templates/blog_entry.mustache


POSTVIEWDIR := _views/news

POSTS := $(wildcard posts/*)
POSTS := $(basename $(POSTS))
POSTS := $(notdir $(POSTS))
POSTVIEWS := $(addsuffix .json, $(POSTS))
POSTVIEWS := $(addprefix $(POSTVIEWDIR)/, $(POSTVIEWS))

POSTS := $(addprefix webroot/news/, $(POSTS))
POSTS := $(addsuffix /index.html, $(POSTS))




# Default
all: webroot/index.html webroot/news/index.html $(POSTS)

publish:
	@echo Copying files to live web server...
	cp -r ${SRC_FILES} ${DOC_ROOT}


clean:
	@echo Cleaning old views...
	rm -rf $(POSTVIEWDIR)
	rm -rf _views/*.json

mrproper: clean
	@echo Deleting generated HTMLs...
	rm -rf $(dir $(POSTS))
	rm -rf webroot/news/index.html
	rm -rf webroot/index.html



# Views
$(POSTVIEWS): | $(POSTVIEWDIR)

$(POSTVIEWDIR):
	mkdir $(POSTVIEWDIR)

$(POSTVIEWDIR)/%.json: posts/%.md
	_tools/generateBlogView.js $< > $@

_views/bloglist.json: $(POSTVIEWS)
	_tools/generateBlogListView.js > $@

_views/latestblog.json: _views/bloglist.json
	_tools/generateBlogLatestEntryView.js > $@

# HTMLs
webroot/news/%/index.html: $(POSTVIEWDIR)/%.json
	mkdir -p $(dir $@)
	mustache $< _templates/blog_page.mustache > $@


webroot/news/index.html: _views/bloglist.json
	mustache $< _templates/blog_list.mustache -p $(PARTIALS) > $@


webroot/index.html: _views/latestblog.json
	mustache $< _templates/homepage.mustache -p $(PARTIALS) > $@

