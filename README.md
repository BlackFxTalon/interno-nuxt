# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Node.js Version Requirements

This project requires **Node.js version 20.19.0 or higher** due to dependencies like `oxc-parser@0.80.0` and `vite@7.1.1`.

**Current Node.js version in package.json:** `>=20.19.0`

### For Local Development:
- Ensure you have Node.js 20.19.0+ installed
- Use `.nvmrc` file: `nvm use` (if using nvm)
- Or manually switch: `nvm install 20.19.0 && nvm use 20.19.0`

### For Deployment (Netlify):
- The `netlify.toml` file automatically sets Node.js version to 20.19.0
- If issues persist, manually set environment variable: `NODE_VERSION = "20.19.0"`

### For Other Platforms:
- Set Node.js version to 20.19.0+ in your deployment configuration
- Use the `.nvmrc` or `.node-version` files if supported

## MCP (Codex) Checks

Quick smoke checks to confirm MCP is configured for this repo.

### 1) Config file is present

PowerShell:
```powershell
Test-Path .codex/config.toml
Get-Content .codex/config.toml
```

Bash/Zsh:
```bash
test -f .codex/config.toml && cat .codex/config.toml
```

### 2) Required env vars are set (non-empty)

PowerShell:
```powershell
Write-Output $env:FIRECRAWL_API_KEY
Write-Output $env:CONTEXT7_API_KEY
```

Bash/Zsh:
```bash
echo "$FIRECRAWL_API_KEY"
echo "$CONTEXT7_API_KEY"
```

If any output is empty, set the variable in your shell before starting Codex.

## Roadmap

<ul>
<li>
сгенерить картинки для слайдера (под шапкой)
</li>
</ul>

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
