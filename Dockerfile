FROM node:22-bullseye AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install --frozen-lockfile --network-timeout 600000

RUN rm -rf node_modules/@prisma node_modules/.prisma && \
    yarn add @prisma/client prisma --network-timeout 600000

RUN yarn prisma generate

COPY . .

RUN mkdir -p /usr/src/app/logs && \
    chown -R node:node /usr/src/app

FROM node:22-bullseye

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

RUN mkdir -p logs && chown -R node:node logs
RUN mkdir -p /usr/src/app/uploads && chown -R node:node /usr/src/app/uploads

USER node
EXPOSE 4002
CMD ["yarn", "dev"]