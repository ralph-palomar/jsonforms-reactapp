FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

RUN npm install serve -g

RUN mkdir public/webforms public/webforms/survey 

RUN cp -a /app/build/. /app/public/webforms/survey/

CMD serve -s /app/public/webforms/survey