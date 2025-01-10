# Use Node.js Alpine as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all files
COPY . .

# Expose development server port
EXPOSE 3000

# Start the Next.js development server
CMD ["yarn", "dev"]
