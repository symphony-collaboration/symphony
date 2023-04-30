FROM node:19.4.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema="app/db/prisma/schema.prisma"

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
