FROM node:18-buster-slim

COPY package.json .
RUN npm install
COPY . .
CMD ["node", "src/server.js"]
