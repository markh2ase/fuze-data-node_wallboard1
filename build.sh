docker build -t fuze/node-web-app .
docker run \
--rm \
-p 49160:8080 \
-e NODE_ENV='PROD' \
-e WARDEN_TOKEN='2.gqgSKMjMWZxWUuU.dXNlcjpOWDZNanp4YVVWOmVQTHN6ZTdnaVc' \
-d fuze/node-web-app \
node calls.js
