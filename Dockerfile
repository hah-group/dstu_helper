FROM node:14-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN npm run build

FROM node:14-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD [ "npm", "run", "start:prod" ]
