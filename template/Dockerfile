FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN apk add --no-cache git

COPY . /home/node/app/
ENV NODE_ENV ='production'
RUN chown -R node:node /home/node

RUN npm ci --silent

USER node

RUN touch /home/node/app/start.sh
RUN chmod +x /home/node/app/start.sh
RUN echo -e " \n #!/bin/bash \n if [ $NODE_ENV = production ] \n then \n npm start \n else \n npx moleculer-runner --repl --hot   \n fi" > /home/node/app/start.sh

RUN cat /home/node/app/start.sh
CMD /home/node/app/start.sh
