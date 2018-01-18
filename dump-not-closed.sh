#!/bin/bash 
#MongoDB shell version: 3.0.14
#connecting to: holocallcentre
echo "module.exports =" > list.js
mongo holocallcentre --eval 'printjson(db["callcentre-form-v1"].find({is_archived: {$ne: true}}, {fullname: 1, email: 1, created_at : 1} ).toArray())' | grep -v "MongoDB shell" | grep -v "connecting to:" >> list.js
docker run  --rm  -v `pwd`:`pwd` -w `pwd` node:carbon  node make-contact-list-csv.js  > list.csv
