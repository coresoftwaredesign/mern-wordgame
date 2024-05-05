# syntax=docker/dockerfile:1
# build local docker image: docker build -t "wordgame-server" .
#
# BUILD STAGE
#
ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine as build

# install server dependencies
WORKDIR /app/server
COPY package*.json ./
RUN npm install typescript -g
RUN npm install

# copy server source code and assets
# .dockerignore should filter out node_modules, etc.
COPY . .

# build server (Typescript -> dist)
RUN npm run build


#
# PRODUCTION STAGE
#
FROM node:${NODE_VERSION}-alpine as production
ENV NODE_ENV=production

# install express/node production dependencies
WORKDIR /app/server
COPY --from=build /app/server/package*.json ./
RUN npm install --only=production

# copy built server files
WORKDIR /app/server/dist
COPY --from=build /app/server/dist .

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application as a non-root user.
USER node

# Run the application.
WORKDIR /app/server
CMD npm start
