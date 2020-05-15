#!/bin/sh

adb shell am start -W -a android.intent.action.VIEW -d "exp://192.168.178.25:19000/--/$1"
