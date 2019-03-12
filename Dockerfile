FROM node:alpine
LABEL maintainer="Omaida Glez <omi.gongar@gmail.com>"

RUN mkdir -p /app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV


# default to port 80 for node
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

WORKDIR /app
COPY package.json package-lock.json* ./

RUN npm install
COPY . /app

CMD [ "npm","run", "start" ]