FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm build

COPY . .

EXPOSE 4000

CMD [ "node", "." ]
