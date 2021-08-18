FROM node:14-alpine

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk update && \
    apk upgrade && \
    apk add git

RUN npm install -g @types/node \
    && npm install -g typescript

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . ./

RUN tsc -b

ENV PORT ""
ENV TITLE ""
ENV POWERED ""

ENV TWITCH_USERNAME ""
ENV TWITCH_TOKEN ""
ENV TWITCH_CHANNELS ""

EXPOSE 56812

CMD [ "node", "./build/Main.js" ]