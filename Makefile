.PHONY=all debug clean mrproper dev-start dev-stop


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


dev-start: server.pid

server.pid:
	python -m http.server --directory webroot/ > /dev/null 2>&1 & echo $$! > server.pid

dev-stop: server.pid
	kill $$(cat $<) && rm $<


publish:
	@echo Copying files to live web server...
	cp -r ${SRC_FILES} ${DOC_ROOT}


clean:
	@echo Deleting generated HTMLs...
	rm -rf webroot/news/
	rm -rf webroot/index.html

mrproper: clean
	@echo Cleaning old views...
	rm -rf _views/*


# Views
$(POSTVIEWS): | $(POSTVIEWDIR)

$(POSTVIEWDIR):
	mkdir -p $(POSTVIEWDIR)

$(POSTVIEWDIR)/%.json: posts/%.md
	_tools/generateBlogView.js $< > $@

_views/bloglist.json: $(POSTVIEWS)
	_tools/generateBlogListView.js > $@

_views/latestblog.json: _views/bloglist.json
	_tools/generateBlogLatestEntryView.js > $@

# HTMLs
webroot/news/%/index.html: $(POSTVIEWDIR)/%.json _templates/blog_page.mustache
	mkdir -p $(dir $@)
	mustache $< _templates/blog_page.mustache > $@


webroot/news/index.html: _views/bloglist.json _templates/blog_list.mustache $(PARTIALS)
	mkdir -p $(dir $@)
	mustache $< _templates/blog_list.mustache -p $(PARTIALS) > $@


webroot/index.html: _views/latestblog.json _templates/homepage.mustache $(PARTIALS)
	mustache $< _templates/homepage.mustache -p $(PARTIALS) > $@

