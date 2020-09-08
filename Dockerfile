FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

RUN npm install serve -g

RUN mkdir public public/webforms public/webforms/survey 

COPY build/. public/webforms/survey/