# Stage 1: Build stage
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Declare build argument for environment (dev, stg, prod)
ARG BUILD_ENV=prod

# Build the project using the selected build script (build:dev, build:stg, build:prod)
RUN bun run build:${BUILD_ENV}

# Stage 2: Serve stage with Nginx
FROM nginx:1.27.2-alpine

COPY --from=builder /app/dist /var/www
COPY ./nginx /etc/nginx

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

