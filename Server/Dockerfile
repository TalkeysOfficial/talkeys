# --- Stage 1: Builder ---
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# --- Stage 2: Final image ---
FROM node:18-alpine

WORKDIR /app

# Copy production dependencies and source code from builder
COPY --from=builder /app .

EXPOSE 8000

CMD ["node", "src/server.js"]

