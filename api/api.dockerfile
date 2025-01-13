# Use the latest Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package*.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Apply Prisma migrations during container startup
CMD ["sh", "-c", "npx prisma migrate deploy && yarn dev"]
