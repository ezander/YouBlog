#!/bin/bash

temp=$(mktemp -p. --suffix=.js)
../node_modules/.bin/babel FillDatabase.js > $temp

node $temp




# #https://mediatemple.net/blog/web-development-tech/you-should-probably-blog-in-markdown/

# export APIKEY="AIzaSyAQTVQFCvpyWy9KDXTz2NZcHllUsaNWdvY"
# export AUTHDOMAIN="youblog-814ae.firebaseapp.com"
# export DATABASEURL="https://youblog-814ae.firebaseio.com"
# export PROJECT_ID="youblog-814ae"


# function write_post_realtime() {
#     content=$(cat $5 | sed 's/"/\\\"/g' | sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g')
#     url="https://${PROJECT_ID}.firebaseio.com/blog_entries.json"
#     json=$(cat <<EOF
# {
#     "author" : "$1", 
#     "author_id" : "$2", 
#     "title" : "$4", 
#     "date" : "$3", 
#     "text" : "$content",
#     "image_url" : "$6"
# }
# EOF
# )
#     curl -vvv -X POST -d "$json" "$url"
    
# }

# function write_post_firestore() {
#     content=$(cat $5 | sed 's/"/\\\"/g' | sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g')
#     collection="blog_entries"
#     name="projects/${PROJECT_ID}/databases/(default)/documents/${collection}?documentId=$5"
#     url="https://firestore.googleapis.com/v1/$name"
#     json=$(cat <<EOF
# {
#     "fields": {
#         "author" : {"stringValue": "$1"},
#         "author_id" : {"stringValue": "$2"},
#         "title" : {"stringValue": "$4"},
#         "date" : {"timestampValue": "$3T00:00:00Z"},
#         "text" : {"stringValue": "$content"},
#         "image_url" : {"stringValue": "$6"}
#         }
# }
# EOF
# )
#     # echo curl -X POST -d "$json" "$url"
#     curl -X POST -H "Content-Type: application/jsons" -d "$json" "$url"
# }

# function write_post() {
#     write_post_firestore "$@"
#     # write_post_realtime "$@"
# }

# write_post "Chris Coyier" "_cc" "2016-04-27" "You Should Probably Blog in Markdown" "blog_markdown.md" "https://mediatemple.net/blog/wp-content/uploads/2016/04/chris-coyier-4-960x406.png"
# write_post "Jeffrey Uberstine" "_ju" "2020-04-10" "Linux Administration For Web Developers: Part 1" "linux_admin_web_dev1.md" "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part1.-960x407.png"
# write_post "Jeffrey Uberstine" "_ju" "2020-04-10" "Linux Administration For Web Developers: Part 2" "linux_admin_web_dev2.md" "https://mediatemple.net/blog/wp-content/uploads/2020/04/1665x705-Part2-960x407.png"
# write_post "Alex Alabbas" "_aa" "2020-04-22" "Logs And Metrics: How Important Are They?" "logs_and_metrics.md" "https://mediatemple.net/blog/wp-content/uploads/2020/04/3330x1410-1-960x407.png"

