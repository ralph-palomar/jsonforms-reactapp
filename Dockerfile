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

RUN cp -r build/* public/webforms/survey/

RUN rm -r build

CMD serve -p 8080