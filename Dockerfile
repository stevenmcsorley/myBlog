FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

EXPOSE 5173 8002

CMD ["npm", "run", "dev"]