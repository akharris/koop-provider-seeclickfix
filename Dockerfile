FROM node:10
run mkdir -p /srv/www/koop
add package.json /srv/www/koop
workdir /srv/www/koop
run npm install
add . /srv/www/koop
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/node", "/srv/www/koop/server.js"]
