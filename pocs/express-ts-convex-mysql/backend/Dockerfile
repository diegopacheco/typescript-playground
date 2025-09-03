FROM node:24-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
EXPOSE 3210

CMD ["npm", "run", "dev"]