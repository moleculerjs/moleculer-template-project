FROM node:22-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["node", "node_modules/moleculer/bin/moleculer-runner.js"]
