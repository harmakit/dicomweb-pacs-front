FROM node:10.13-alpine as dev
WORKDIR /app
CMD echo "getting latest npm modules" \
    && npm install \
    && echo "installation complete, starting" \
    && npm start

FROM node:10.13-alpine as build
RUN apk add --no-cache autoconf automake libtool nasm build-base
WORKDIR /app
COPY ./package*.json ./
COPY . .
RUN npm install
RUN npm run build

# multistage build...
# this runs a lil nginx instance to serve the app
FROM nginx:alpine as prod
EXPOSE 4000
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
