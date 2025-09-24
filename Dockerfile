# Use the official Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for building native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copy package files first for better caching
COPY strapi/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application
COPY strapi/ .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001 -G nodejs

# Change ownership of the app directory to the strapi user
RUN chown -R strapi:nodejs /app

# Build the Strapi application
RUN npm run build

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'mkdir -p /app/public/uploads' >> /app/start.sh && \
    echo 'if [ "$(stat -c %u /app/public/uploads)" != "1001" ]; then' >> /app/start.sh && \
    echo '  echo "Fixing upload directory permissions..."' >> /app/start.sh && \
    echo '  chown -R 1001:1001 /app/public/uploads' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'exec su-exec strapi npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Install su-exec for proper user switching
RUN apk add --no-cache su-exec

# Expose the port Strapi runs on
EXPOSE 1337

# Run as root initially to fix permissions, then switch to strapi user
CMD ["/app/start.sh"]
