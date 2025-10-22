FROM node:22-bullseye AS builder

WORKDIR /usr/src/app

RUN yarn config set registry https://registry.npmmirror.com --global && \
    yarn config set disturl https://npmmirror.com/dist --global && \
    yarn config set network-timeout 600000 --global

COPY package.json yarn.lock ./
COPY prisma ./prisma

# Instalar dependências com yarn
RUN yarn install --frozen-lockfile --network-timeout 600000

# Gerar cliente Prisma usando npx (mais confiável)
RUN npx prisma generate --schema=./prisma/schema.prisma

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