# Deployment Guide

## Render CLI Installation

You can install the Render CLI using one of the following methods:

### Homebrew (Linux/MacOS)
```bash
brew install render
```

### Direct Download
Download the latest release from the [Render CLI GitHub releases](https://github.com/render-oss/cli/releases) page for your platform.

### Build from Source
We recommend building from source only if no other installation method works for your system.

1. Install the Go programming language if you haven't already.
2. Clone and build the CLI project:
```bash
git clone git@github.com:render-oss/cli.git
cd cli

```

After installation completes, open a new terminal tab and run `render` with no arguments to confirm.

## Authentication

The Render CLI uses a CLI token to authenticate with the Render platform.

### Login via CLI
Run:go build -o render
```bash
render login
```
This opens your browser to authorize the CLI. After generating the token, the CLI saves it locally and prompts you to set your active workspace.

You can switch workspaces anytime with:
```bash
render workspace set
```

### API Key Authentication (for CI/CD)
Generate an API key in the Render Dashboard for automated environments.

Set the environment variable:
```bash
export RENDER_API_KEY=rnd_your_api_key_here
```

API keys take precedence over CLI tokens.

## Common Commands

- `render login`  
  Authorize the CLI and generate a token.

- `render workspace set`  
  Set the active workspace.

- `render services`  
  List all services and datastores in the active workspace.

- `render deploys list [SERVICE_ID]`  
  List deploys for a service.

- `render deploys create [SERVICE_ID]`  
  Trigger a deploy for a service.

- `render psql [DATABASE_ID]`  
  Open a psql session to a PostgreSQL database.

- `render ssh [SERVICE_ID]`  
  Open an SSH session to a running service instance.

## Non-Interactive Mode (CI/CD)

Use these flags for non-interactive usage:

- `-o / --output`  
  Set output format (`json`, `yaml`, `text`, or `interactive`).

- `--confirm`  
  Skip confirmation prompts.

Example to list services in JSON:
```bash
render services --output json --confirm
```

## Example: GitHub Actions Workflow

```yaml
name: Render CLI Deploy
on:
  push:
    branches:
      - main
jobs:
  Deploy-Render:
    runs-on: ubuntu-latest
    steps:
      - name: Install Render CLI
        run: |
          curl -L https://github.com/render-oss/cli/releases/download/v1.1.0/cli_1.1.0_linux_amd64.zip -o render.zip
          unzip render.zip
          sudo mv cli_v1.1.0 /usr/local/bin/render
      - name: Trigger deploy with Render CLI
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
          CI: true
        run: |
          render deploys create ${{ secrets.RENDER_SERVICE_ID }} --output json --confirm
```

## Local Configuration

By default, the CLI stores its config at:
```
$HOME/.render/cli.yaml
```
You can change this by setting:
```
RENDER_CLI_CONFIG_PATH
```

## Managing CLI Tokens

CLI tokens expire periodically. Re-authenticate with `render login` if needed.

View and revoke tokens in your Render Dashboard Account Settings.

For security, use API keys only in automated environments.

---

## Integration in Solia Project

### NPM Scripts for Render CLI (in `apps/api/package.json`)

To simplify usage, the following npm scripts have been added:

- `npm run render:login`  
  Launches `render login` to authenticate.

- `npm run render:services`  
  Lists your Render services.

- `npm run deploy:api`  
  Deploys the API service using the Render CLI.  
  Requires the environment variable `RENDER_SERVICE_ID` to be set.

- `npm run render:logs`  
  Shows logs for the API service.  
  Requires `RENDER_SERVICE_ID`.

Example usage:
```bash
RENDER_SERVICE_ID=your_service_id npm run deploy:api
```

### GitHub Actions Workflows

Two workflows have been created to automate deployments on push to the `main` branch:

- **API Deployment**:  
  Located at `apps/api/.github/workflows/deploy-api.yml`  
  Uses secrets `RENDER_API_KEY` and `RENDER_SERVICE_ID`.

- **Frontend Deployment**:  
  Located at `apps/web/.github/workflows/deploy-frontend.yml`  
  Uses secrets `RENDER_API_KEY` and `RENDER_FRONTEND_SERVICE_ID`.

### Setting GitHub Secrets

Add the following secrets in your GitHub repository settings:

- `RENDER_API_KEY` : Your Render API key from [Render Dashboard > Account Settings > API Keys](https://dashboard.render.com/account)
- `RENDER_SERVICE_ID` : The service ID for the API service (from `render services`)
- `RENDER_FRONTEND_SERVICE_ID` : The service ID for the frontend service

### Testing Locally

You can test the Render CLI commands locally via npm scripts, for example:

```bash
npm run render:login
npm run render:services
RENDER_SERVICE_ID=your_service_id npm run deploy:api
```

### Notes

- Ensure you have installed the Render CLI locally or rely on the GitHub Actions workflows for automated deployment.
- Keep your API keys secure and do not commit them to source control.
