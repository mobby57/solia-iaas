# PowerShell script to fix npm "Invalid Version" error by cleaning lock files, cache, and reinstalling dependencies

Write-Host "Closing any running dev servers, editors, or programs using the project files is recommended before running this script."

# Run PowerShell as Administrator before executing this script

# Define the project root path
$projectRoot = "solia"

# Delete lock files if they exist
Write-Host "Deleting package-lock.json and pnpm-lock.yaml if they exist..."
Remove-Item -Path "$projectRoot\package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$projectRoot\pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue

# Delete node_modules folder
Write-Host "Deleting node_modules folder..."
Remove-Item -Path "$projectRoot\node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Clear npm cache
Write-Host "Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
Write-Host "Reinstalling dependencies..."
cd $projectRoot
npm install

Write-Host "Done. Please try running your npm command again."
