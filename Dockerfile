FROM node:14-alpine

WORKDIR /app

COPY . .

RUN yarn install && npm run build


CMD [ "sh", "-c", "yarn run start:prod" ]
