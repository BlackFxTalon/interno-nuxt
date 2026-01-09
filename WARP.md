# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

This is a Nuxt 4 project that requires Node.js 20.19.0 or higher. The critical dependencies are handled in the `.nvmrc` file.

### Setup
```bash
# Install dependencies
npm install

# Or with other package managers
pnpm install
yarn install
bun install
```

### Development
```bash
# Start development server at http://localhost:3000
npm run dev
```

### Build & Production
```bash
# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

### Code Quality
```bash
# Lint code
npm run lint

# Lint and fix issues
npm run lint:fix
```

## Project Structure

This is a Nuxt 4 application for a mattress and sleep product e-commerce site (Интерно) based in Russia:

### Core Architecture
- **Framework**: Nuxt 4 with Vue 3 using composition API
- **Styling**: TailwindCSS with custom theme and primary color (#0580C7)
- **UI Components**: Custom UI components in `components/ui/` for reusable elements
- **Deployment**: Netlify with static site generation

### Key Directories
- `components/`: Vue components organized with subdirectories
  - `ui/`: Reusable UI elements (UiButton, UiInput, UiLabel, UiSelect)
  - `header/`: Navigation and header components
  - `findYourPerfectMatrass/`: Product finder components
- `pages/`: File-based routing, includes product detail pages (`product/[id].vue`)
- `layouts/`: Application layout structure
- `server/api/`: Server-side API endpoints (products, etc.)

### Component Structure
- UI components follow consistent prop patterns and styling
- Components use composition API with `<script setup>`
- Primary color theme throughout application
- Custom animations for modals and logo elements

### Data Management
- Product data is loaded from JSON files via server API endpoints
- `server/api/products.get.ts` aggregates product data from multiple JSON files

### Configuration
- `nuxt.config.ts`: Core Nuxt configuration with module imports
  - TailwindCSS, Image optimization, ESLint
  - Route rules for prerendering key pages
- `tailwind.config.ts`: Custom theme with Inter font and primary color
- `netlify.toml`: Deployment configuration with Node.js 20.19.0 specification

### Key Features
- Product catalog with details pages
- Image carousels and product sliders
- Modal forms for inquiries and orders
- Responsive design with mobile menu
- Static site generation for SEO optimization
