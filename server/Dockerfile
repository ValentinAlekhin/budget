FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN touch .env

CMD ["npm", "run", "start:prod"]
