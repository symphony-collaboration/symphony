FROM node:19.4.0

WORKDIR /usr/server/app

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "dev"]
