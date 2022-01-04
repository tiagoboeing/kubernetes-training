# Node server
FROM node:12-alpine as node-server
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../

COPY . .
COPY . /usr/src/app/server

EXPOSE 3000

CMD ["node", "index.js"]
