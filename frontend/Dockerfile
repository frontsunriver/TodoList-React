FROM node:14-alpine

WORKDIR /frontend

COPY package.json package-lock.json ./
RUN npm install

ENV API_URL  $API_URL 
CMD ["npm", "start"]
