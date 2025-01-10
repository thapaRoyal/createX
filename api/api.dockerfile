# Use the latest Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Compile TypeScript code
RUN npx tsc

# Expose port 5000 for the application
EXPOSE 5000

# Start the application using the compiled JavaScript file
CMD ["yarn", "dev"]
