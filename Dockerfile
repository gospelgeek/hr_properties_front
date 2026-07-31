# HR Properties Frontend — Vite + React SPA
# Multi-stage: build with node:20-slim, serve with nginx-unprivileged

# ---- Build stage ----
FROM node:20-slim AS builder

WORKDIR /app

# Copy manifests first for layer caching
# No package-lock.json found — using npm install instead of npm ci.
# WARNING: builds won't be deterministic. Generate package-lock.json for reproducibility.
COPY package.json ./

RUN npm install

# Copy source
COPY . .

# Build-time env vars (baked into the bundle at build time)
# VITE_API_BASE_LOCAL: URL of the backend API (public URL via Cloudflare Tunnel)
ARG VITE_API_BASE_LOCAL
ENV VITE_API_BASE_LOCAL=$VITE_API_BASE_LOCAL

# VITE_GOOGLE_CLIENT_ID: Google OAuth client ID for the frontend
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# ---- Runtime stage (nginx serving static files) ----
FROM nginxinc/nginx-unprivileged:alpine AS runtime

# Copy built static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config: SPA routing only
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx-unprivileged runs as UID 101 and listens on 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget --spider -q http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]