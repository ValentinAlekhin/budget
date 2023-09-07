FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY *.lock ./

RUN npm ci

COPY . .

ENV BASE_URL 11.5.0.6:3000

RUN npm run generate

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/.output/public .

COPY ./nginx/conf.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]