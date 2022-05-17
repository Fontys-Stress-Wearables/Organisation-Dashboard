### STAGE 1: Build ###
FROM node:16-alpine as build
ARG REACT_APP_ENVIRONMENT
ENV REACT_APP_ENVIRONMENT $REACT_APP_ENVIRONMENT

WORKDIR /app

#copy any files that start with "package" and have a ".json" extension
COPY  package*.json ./

#install the node dependencies
RUN npm install

#copy the rest of the files from the frontend to the app folder
COPY . .

#build the frontend
RUN npm run build

#add a second step based on nginx
FROM nginx:alpine

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

#copy the build output from the build step to the hosting folder of nginx
COPY --from=build /app/build /usr/share/nginx/html