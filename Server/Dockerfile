# --- Stage 1: Builder ---
FROM node:18-buster-slim AS builder

COPY package.json .
RUN npm install
COPY . .

# --- Stage 2: Runtime ---
FROM node:18-buster-slim
COPY --from=builder . .

CMD ["node", "src/server.js"]
