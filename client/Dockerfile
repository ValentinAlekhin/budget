FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY *.lock ./

RUN npm ci

COPY . .

ARG BRANCH
COPY ./docker/${BRANCH}.env .env

RUN npm run generate

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/.output/public .

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

LABEL com.centurylinklabs.watchtower.enable="true"

CMD ["nginx", "-g", "daemon off;"]