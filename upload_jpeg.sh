#!/bin/bash

OBJECT_CONTENT_TYPE="image/jpg"
OBJECT_LOCATION="$1"
BUCKET_NAME="youblog-814ae.appspot.com"
OBJECT_NAME="$2"
TOKEN="" # not needed any more, otherwise get from oauth2 playground

# set -x
curl -X POST --data-binary "@$OBJECT_LOCATION" \
-H "Content-Type: $OBJECT_CONTENT_TYPE" \
"https://storage.googleapis.com/upload/storage/v1/b/$BUCKET_NAME/o?uploadType=media&name=$OBJECT_NAME"

# set +x
# -H "Authorization: Bearer $TOKEN" \
