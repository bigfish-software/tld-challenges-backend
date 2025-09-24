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
USER strapi

# Create upload directory and ensure permissions (Railway volume will mount here)
RUN mkdir -p /app/public/uploads

# Build the Strapi application
RUN npm run build

# Expose the port Strapi runs on
EXPOSE 1337

# Fix volume permissions on startup, then start Strapi
CMD ["sh", "-c", "sudo chown -R strapi:nodejs /app/public/uploads 2>/dev/null || true && npm start"]
