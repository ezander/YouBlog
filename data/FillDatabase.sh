#!/bin/bash

# BABEL=../node_modules/.bin/babel
# OUTDIR=../.temp

# $BABEL ../ --only "../data/,../src/" \
#     --extensions '.ts,.js' \
#     -d $OUTDIR \
#     --retain-lines \
#     --source-maps inline

# #    --verbose
# cp ../firebaseConfig.json $OUTDIR

# node --async-stack-traces --enable-source-maps $OUTDIR/data/FillDatabase.js

../node_modules/.bin/ts-node-dev ./FillDatabase.ts
