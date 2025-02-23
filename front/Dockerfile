FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Update package.json to fix React version conflicts
RUN npm install --legacy-peer-deps

COPY . .

# Add environment variable to avoid browser opening
ENV BROWSER=none

EXPOSE 3000

CMD ["npm", "start"]