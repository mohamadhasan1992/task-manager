FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Install ALL dependencies (including dev) for build
RUN npm ci
RUN npm install -g @swc/cli @swc/core

COPY . .

# Build the app (needs devDependencies like swc)
RUN npm run build

# Remove dev dependencies for production image
RUN npm prune --production

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]