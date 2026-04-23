# Use Node.js as the base image
FROM node:20-slim

# Install system dependencies for Playwright and Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libgbm-dev \
    libnss3 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend-simples package.json and install its dependencies
COPY backend-simples/package*.json ./backend-simples/
RUN cd backend-simples && npm install

# Install Playwright browsers
RUN npx playwright install chromium

# Copy the rest of the application
COPY . .

# Install Python dependencies if any
# RUN pip3 install -r requirements.txt

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "backend-simples/server.js"]
