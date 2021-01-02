#!/bin/bash

set -e

DOC_ROOT=/srv/http/whsminecraft.de/

GLOBIGNORE="$(basename $BASH_SOURCE):.git:.gitignore:templates:map"

cp -r * "$DOC_ROOT"
