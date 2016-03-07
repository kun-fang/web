#! /bin/bash
DEFAULT_DIR=~/venv

pip install virtualenvwrapper
export WORKON_HOME=${2:-$DEFAULT_DIR}
mkdir -p $WORKON_HOME
source /usr/local/bin/virtualenvwrapper.sh
mkvirtualenv $1
