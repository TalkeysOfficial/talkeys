# Vercel is the production host for the Client; this image is for local or self-hosting.
# BACKEND_URL and NEXT_PUBLIC_* are inlined at build time, so they are build args.

# --- Stage 1: build (Bun installs, Node runs next build) ---
FROM node:24-slim AS build
COPY --from=oven/bun:1.4.4 /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_CONVENIENCE_FEE
ARG NEXT_PUBLIC_EVENT_CREATE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV BACKEND_URL=$BACKEND_URL \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_CONVENIENCE_FEE=$NEXT_PUBLIC_CONVENIENCE_FEE \
    NEXT_PUBLIC_EVENT_CREATE_URL=$NEXT_PUBLIC_EVENT_CREATE_URL \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \
    NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# --- Stage 2: runtime (Node, non-root) ---
FROM node:24-slim
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["node", "server.js"]
