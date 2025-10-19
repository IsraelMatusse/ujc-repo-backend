FROM node:22-bullseye AS builder

WORKDIR /usr/src/app

RUN yarn config set registry https://registry.npmmirror.com --global && \
    yarn config set disturl https://npmmirror.com/dist --global && \
    yarn config set network-timeout 600000 --global

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 600000

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN mkdir -p /usr/src/app/logs /usr/src/app/uploads && \
    chown -R node:node /usr/src/app

FROM node:22-bullseye

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

RUN mkdir -p logs uploads && chown -R node:node logs uploads

USER node

EXPOSE 4002

CMD ["yarn", "dev"]