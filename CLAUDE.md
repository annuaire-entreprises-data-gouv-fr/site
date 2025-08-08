# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

L'Annuaire des Entreprises is a French government service that provides open data about companies, associations, and administrations with SIREN/SIRET numbers. The site aggregates data from various partner administrations and makes it accessible to citizens and government agents.

## Development Commands

### Basic Development
```bash
# Install dependencies
npm i

# Copy environment file
cp .env.dev .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Testing
```bash
# Run linter
npm run lint

# Run unit tests
npm run test:unit

# Run unit tests in debug mode
npm run test:unit:debug

# Run end-to-end tests
npm run test:end2end:run

# Open Cypress for interactive e2e testing
npm run test:end2end:open

# Run API client tests
npm run test:api-clients

# Update API client test snapshots
npm run test:api-clients:update-snapshots
```

### Pre-commit Hook
The project automatically runs `npm run lint && npm run test:unit` before commits via simple-git-hooks.

## Architecture Overview

### Next.js App Router Structure
The project uses Next.js 15 with the App Router pattern. Routes are organized using route groups:

- `(header-compte)` - Account-related pages for authenticated users
- `(header-connexion)` - Authentication and connection pages  
- `(header-default)` - Main public pages with standard header
- `(header-home)` - Homepage and landing pages
- `(header-minimal)` - Pages with minimal header (forms, etc.)
- `(header-public)` - Public information pages
- `(header-search)` - Search-related pages

### Key Directories

#### `/models/`
Contains the core business logic and data models:
- `authentication/` - User authentication, groups, roles, and scopes
- `core/` - Core entities (entreprise, établissement, unite-legale)
- `certifications/` - Various business certifications and labels
- `espace-agent/` - Protected data accessible only to government agents
- `search/` - Search functionality and filters

#### `/clients/`
External API integrations with comprehensive testing:
- Each client has snapshot tests in `_test/` directories
- Integrates with INSEE, INPI, various government APIs
- Includes rate limiting and authentication strategies

#### `/components/` and `/components-ui/`
- `/components/` - Business-specific React components
- `/components-ui/` - Reusable UI components (buttons, modals, etc.)

#### `/utils/`
Utility functions organized by domain:
- `cookies/` - Cookie management
- `headers/` - Security headers (CSP)
- `network/` - Network utilities
- `session/` - Session management
- `sentry/` - Error tracking

### TypeScript Configuration
The project uses path aliases for cleaner imports:
- `#clients/*` → `./clients/*`
- `#components/*` → `./components/*`
- `#components-ui/*` → `./components-ui/*`
- `#models/*` → `./models/*`
- `#utils/*` → `./utils/*`

### Authentication System
Two-tier authentication system:
- **FranceConnect** - For citizens
- **ProConnect/AgentConnect** - For government agents with elevated permissions

### Data Fetching Pattern
Uses a structured data fetching system in `/app/api/data-fetching/` with:
- Route handlers for different data scopes
- Centralized API client management
- Error handling and monitoring via Sentry

### Testing Strategy
- **Unit tests** - Jest with snapshot testing for API clients
- **E2E tests** - Cypress with mocking support via MSW
- **API tests** - Dedicated test suite for external API integrations

### Error Handling
Structured error handling with Sentry integration:
- Use `Exception` class for business errors
- Use `InternalError` for unexpected code paths
- Use `FetchRessourceException` for API failures
- Include contextual information in error reports

### SEO and Static Generation
Dedicated SEO script generates:
- Sitemaps for ~8M legal units
- Static result pages for better search indexing
- Compressed artifacts deployed with the application

## Development Notes

- Node.js 20+ required
- Uses conventional commits with commitlint
- Automatic deployment to staging on main branch merges
- Manual production deployment via GitHub Actions
- Redis used for session storage and rate limiting
- Content Security Policy enforced via custom headers