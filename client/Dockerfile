FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY *.lock ./

RUN npm i

COPY . .

ENV PORT 80

RUN npm run build

CMD ["node", ".output/server/index.mjs"]
