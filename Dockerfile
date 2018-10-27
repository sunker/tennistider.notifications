FROM mhart/alpine-node:9

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && \
    yarn cache cleanug
    

COPY . .

CMD ["node", "app.js"]
