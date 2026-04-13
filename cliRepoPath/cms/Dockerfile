FROM  896720489482.dkr.ecr.ap-south-1.amazonaws.com/node:22.4.0-alpine AS frontend_builder

WORKDIR /frontend

COPY package*.json ./
COPY . .
RUN yarn install


RUN yarn run build

FROM 896720489482.dkr.ecr.ap-south-1.amazonaws.com/nginx:alpine3.21
WORKDIR /usr/share/nginx/html
COPY --from=frontend_builder /frontend/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN apk add --no-cache git openssh-client
EXPOSE 80
