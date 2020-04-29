#!/bin/bash

BABEL=../node_modules/.bin/babel
OUTDIR=../.temp

$BABEL ../ --only "../data/,../src/" \
    --extensions '.ts,.js' \
    -d $OUTDIR \
    --retain-lines \
    --source-maps inline

#    --verbose
cp ../firebaseConfig.json $OUTDIR

node $OUTDIR/data/FillDatabase.js
