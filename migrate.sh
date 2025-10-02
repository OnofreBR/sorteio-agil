#!/bin/bash

# Migration script for Next.js structure

# Move directories from src/ to root
mv src/components components
mv src/lib lib
mv src/integrations integrations
mv src/services services
mv src/hooks hooks
mv src/types types

# Create styles directory and move CSS files
mkdir -p styles
mv src/index.css styles/globals.css
mv src/App.css styles/App.css

# Remove Vite-specific files
rm vite.config.ts
rm index.html

# Rename environment file
mv .env .env.local

# Stage all changes
git add .

# Commit changes
git commit -m "refactor: migrar estrutura para Next.js"

# Push to repository
git push

echo "Migration completed successfully!"