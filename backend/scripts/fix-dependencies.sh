#!/bin/bash
# Script to fix conflicting types and broken dependencies before running Turbo codemod

echo "Starting fix for conflicting types and broken dependencies..."

# Step 1: Uninstall conflicting types for jest and mocha if present
npm uninstall @types/jest @types/mocha || true

# Step 2: Install vitest if not installed
npm install -D vitest

# Step 3: Ensure tsconfig.json includes "vitest" in types (manual check recommended)

# Step 4: Fix react-router-dom version conflicts
npm uninstall @types/react-router @types/react-router-dom || true
npm install react-router-dom@7

# Step 5: Fix react-toastify version conflicts
npm install react-toastify@latest
npm uninstall @types/react-toastify || true

# Step 6: Fix @prisma-multi-tenant/shared missing module
# Try to install it from npm, if fails, user should check local package linking
npm install @prisma-multi-tenant/shared || echo "Warning: Could not install @prisma-multi-tenant/shared. Please check if it is a local package and link it properly or comment out the import."

# Step 7: Commit changes
git add .
git commit -m "fix: cleanup conflicting types and broken dependencies"

echo "Fix script completed. Please verify the changes and run your Turbo codemod."
