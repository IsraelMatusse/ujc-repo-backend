FROM node:22-bullseye AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma ./prisma


RUN yarn install --frozen-lockfile --network-timeout 1000000

RUN yarn prisma generate

COPY . .

RUN mkdir -p /usr/src/app/logs && chown -R node:node /usr/src/app

FROM node:22-bullseye-slim 

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist 

RUN mkdir -p logs uploads && chown -R node:node logs uploads

USER node
EXPOSE 4002
CMD ["yarn", "dev"]