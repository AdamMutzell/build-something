ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION}

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm install
RUN npm install primeng @primeuix/themes

# Copy source (or rely on volume mount instead)
COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host=0.0.0.0"]
