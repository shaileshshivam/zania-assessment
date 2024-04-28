FROM node:20.8.0-alpine as build
WORKDIR /drop-cats
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
EXPOSE 8080
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "8080"]