# Use Node.js 18 Alpine for a lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for Docker layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy application source code
COPY src/ ./src/

# Expose the port the app runs on
EXPOSE 5001

# Start the application
CMD ["node", "src/index.js"]
