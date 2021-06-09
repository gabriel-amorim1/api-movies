FROM node:lts-alpine
MAINTAINER Gabriel Amorim
ENV PORT=3000
COPY . /var/www
WORKDIR /var/www
RUN npm install
RUN npm run build
ENTRYPOINT npm start
EXPOSE $PORT
