# Use an official Node.js 20 base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire server codebase
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to start your app
CMD ["node", "start.js"]
