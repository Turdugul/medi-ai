# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies

RUN npm install --legacy-peer-deps


# Copy the entire backend source code
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to start the backend
CMD ["node", "src/server.js"]
