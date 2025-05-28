# PowerShell script to fix EPERM unlink error for esbuild.exe on Windows

Write-Host "Closing any running dev servers, editors, or programs using the project files is recommended before running this script."

# Run PowerShell as Administrator before executing this script

# Define the path to the problematic esbuild.exe file
$esbuildPath = "solia\node_modules\@esbuild\win32-x64\esbuild.exe"
$esbuildFolder = "solia\node_modules\@esbuild"

# Attempt to delete the esbuild.exe file
Write-Host "Attempting to delete esbuild.exe..."
Remove-Item -Path $esbuildPath -Force -ErrorAction SilentlyContinue

# If esbuild.exe still exists, try deleting the entire @esbuild folder
if (Test-Path $esbuildPath) {
    Write-Host "esbuild.exe still exists. Attempting to delete the entire @esbuild folder..."
    Remove-Item -Path $esbuildFolder -Recurse -Force -ErrorAction SilentlyContinue
}

# If the folder still exists, suggest deleting the entire node_modules folder and lock files
if (Test-Path $esbuildFolder) {
    Write-Host "The @esbuild folder still exists. Deleting the entire node_modules folder and lock files..."
    Remove-Item -Path "solia\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "solia\package-lock.json" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "solia\pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
}

Write-Host "Reinstalling dependencies..."
cd solia
npm install

Write-Host "Done. Please try running your npm command again."
