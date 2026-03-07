# Build frontend
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production server
FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./package.json

# Expose the server port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Run the server (assumes server.js serves dist if needed, though vite handles static built files)
# To serve dist, server.js should have app.use(express.static('dist'))
CMD ["node", "server/server.js"]
