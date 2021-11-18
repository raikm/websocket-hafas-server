FROM node:14

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 4000

CMD [ "ts-node", "./src/index.ts" ]
