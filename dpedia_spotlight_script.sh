ARTICLE=$(cat /Users/davidedimeco/Desktop/anarchism.txt)

curl http://www.dbpedia-spotlight.com/en/annotate  \
  --data-urlencode "text=${ARTICLE}" \
  --data "confidence=0.5" \
  -H "Accept: application/json"
