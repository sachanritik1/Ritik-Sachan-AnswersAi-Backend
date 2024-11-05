
FROM node:alpine AS base
WORKDIR /usr/src/app
COPY package* .
RUN npm install

FROM base AS dev
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]

FROM base AS prod
COPY . .
EXPOSE 8000
CMD [ "npm", "run", "start" ]

