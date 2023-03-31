FROM node:16-alpine

EXPOSE 5000
WORKDIR /app

COPY .git ./.git
RUN apk add git \
  && git reset --hard \
  && yarn

CMD yarn start
