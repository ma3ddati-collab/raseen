FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install

COPY . .
RUN npm run prisma:generate --workspace backend
RUN npm run build:backend

EXPOSE 4000
CMD ["npm", "--workspace", "backend", "run", "start"]
