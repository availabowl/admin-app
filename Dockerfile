# Stage 1: Install dependencies and build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy next config file
COPY next.config.mjs ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Define build-time variables (ARG)
ARG DATABASE_URL

# Use ARG to set ENV variable for build steps
RUN export DATABASE_URL=${DATABASE_URL} && npx prisma generate

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 2: Set up the final image
FROM node:20-alpine AS runner

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy the build output and node_modules from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.env ./.env

# Expose port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]