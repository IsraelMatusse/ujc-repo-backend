FROM node:22-bullseye AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma ./prisma

# Instalar dependências SEM o registry mirror (o mirror pode estar causando problemas com binários do Prisma)
RUN yarn install --frozen-lockfile --network-timeout 600000

# Deletar node_modules do Prisma e reinstalar
RUN rm -rf node_modules/@prisma node_modules/.prisma && \
    yarn add @prisma/client prisma --network-timeout 600000

# Gerar cliente Prisma
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