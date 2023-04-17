FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY *.lock ./

RUN yarn install

COPY . .

ENV BASE_URL 11.5.0.6:3000

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.output .

CMD ["node", "./server/index.mjs"]