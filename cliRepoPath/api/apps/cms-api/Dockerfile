# syntax=docker/dockerfile:1.7-labs
FROM 896720489482.dkr.ecr.ap-south-1.amazonaws.com/node:24-alpine AS base
WORKDIR /app

# Stage 1: Setup dependencies context (SSH keys + Package manifests)
FROM base AS deps-setup
COPY package*.json id_rsa ./
RUN apk add --no-cache git openssh-client && \
        mkdir /root/.ssh && \
        mv id_rsa /root/.ssh/ && \
        chmod 600 /root/.ssh/id_rsa && \
        ssh-keyscan -T 60 bitbucket.org >> /root/.ssh/known_hosts

# Stage 2: Install Production Dependencies
FROM deps-setup AS prod-deps
RUN apk add --no-cache git openssh-client && \
    npm ci --omit=dev

# Stage 3: Build the application
FROM deps-setup AS build
RUN apk add --no-cache git openssh-client && \
    npm ci
COPY . .
RUN npm run build cms-api
    
# Stage 4: Final Production Image
FROM base AS production
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --parents apps/cms-api/.env newrelic.js views/templates ./
CMD [ "node", "-r", "newrelic", "dist/apps/cms-api/main" ]
