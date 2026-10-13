# =============================================================================
# Dockerfile — Notifier Microservice (Node.js)
# =============================================================================
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (Docker cache layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Render sets PORT env var
ENV PORT=8001
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["node", "src/index.js"]
