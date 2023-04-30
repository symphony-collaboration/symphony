FROM node:19.4.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV PORT=8081

EXPOSE 8081

CMD [ "npm", "start" ]
