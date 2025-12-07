# Use Node.js base image
FROM node:18-alpine

# Working folder inside container
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of backend code
COPY . .

# Expose your backend port (adjust if not 3000)
EXPOSE 3000

# Start server
CMD ["npm", "start"]
