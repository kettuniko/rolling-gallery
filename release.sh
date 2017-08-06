#!/usr/bin/env bash

git fetch --all
git checkout gh-pages
git reset origin/master
yarn build
git add --force dist
git commit -m 'Release'
git push --force
git checkout -
