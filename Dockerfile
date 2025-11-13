## Multi-stage Dockerfile for the Node static server
# Build minimal production image that runs server.js

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Use production environment
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Start the Node server
CMD ["node", "server.js"]
