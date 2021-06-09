FROM node:latest
MAINTAINER Gabriel Amorim
ENV PORT=3000
ENV DB_HOST=172.17.0.2
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=api-movies
COPY . /var/www
WORKDIR /var/www
RUN npm install
RUN npm run build
ENTRYPOINT npm start
EXPOSE $PORT
