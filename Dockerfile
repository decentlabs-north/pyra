FROM node:16-slim


EXPOSE 80
EXPOSE 443
WORKDIR /app
ENV PORT=80
ENV NODE_ENV=production

COPY .git ./.git
RUN apt-get update && apt-get install -y \
  git \
  && apt-get clean && rm -rf /var/lib/apt/lists/* \
  && git reset --hard \
  && yarn install --production=false \
  && yarn build

CMD yarn start
