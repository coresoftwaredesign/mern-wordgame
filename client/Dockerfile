# syntax=docker/dockerfile:1

# load dependencies before code, as they don't change as frequently as code. Docker then can reuse those layers from the cache.
# .dockerignore will filter out files we don't want to copy (i.e. node_modules)
# build local docker image: docker build -t "wordgame-client" .

#
# BUILD STAGE
#
ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine as build

# install client dependencies
WORKDIR /app/client
COPY package*.json ./
RUN npm install

# copy client and server source code and assets
# .dockerignore should filter out node_modules, etc.
COPY . .

# build optimized production client (React -> build)
RUN npm run build


#
# PRODUCTION STAGE
#
FROM nginx as production-client
COPY --from=build /app/client/build/ /usr/share/nginx/html
EXPOSE 80
