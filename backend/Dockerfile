# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Copy the service account key file into the container.
COPY ocr-text-key.json /usr/src/app/

# Run the web service on container startup.
CMD [ "node", "index.js" ]

# Inform Docker that the container listens on port 8080.
EXPOSE 8080
