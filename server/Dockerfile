FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

RUN touch .env

EXPOSE 443

CMD ["npm", "run", "start:prod"]
