FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

RUN npm install serve -g

RUN mkdir public/app public/app/webformbuilder 

RUN cp -r build/* public/app/webformbuilder/

RUN rm -r build

CMD serve -p 8080