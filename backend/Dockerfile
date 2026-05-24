# Stage 1: Dependency builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production runtime
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src/ ./src
COPY test.js ./

# Expose port 5000
EXPOSE 5000

# Start Express Server
CMD ["npm", "start"]
