FROM node:alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["npm", "start"]


# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# COPY package.json /usr/src/app/

# RUN npm install

# ADD src /usr/src/app/src
# ADD public /usr/src/app/public

# RUN npm build

# CMD [ "npm", "start" ]