# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app will run on (default is 3000)
EXPOSE 3000

# Set the environment variable for the app
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "start"]
