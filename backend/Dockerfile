FROM node:20-slim

WORKDIR /server

COPY . /server/

RUN npm ci

ENTRYPOINT ["node", "server.js"]
