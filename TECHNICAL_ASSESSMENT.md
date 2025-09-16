# Technical Assessment - Company Comparison Feature

## Objective

Implement a company comparison page that allows users to compare two companies side by side.

Please note that this feature does not make sense. It is just an excuse to test your technical (React, Next.js) skills.

## Task Description

Create a new page route `/entreprise/[siren1]/vs/[siren2]` that displays a basic comparison between two companies (aka `unites_legales`).

## Expected Implementation

### 1. Route Structure

- **Path**: `/app/(header-default)/entreprise/[siren1]/vs/[siren2]/page.tsx`
- **Dynamic routing** with two SIREN parameters
- **Error** handle invalid SIRENs or non-existent companies
- **SEO** use appropriate metadata

### 2. UI

Reuse existing components from the codebase such as `<TwoColumnTable>` or `<FullTable>` to display the comparison data. Focus on displaying only key information for each company:

- **SIREN number**
- **Company name**
- **Company headquarter address**
- **NAF / activity code**

### 3. Technical Requirements

- Use Next.js server components for initial data loading
- Reuse code as much as possible. Maybe startswith `models/core/unite-legale.ts`
- Follow existing code patterns and conventions
- Implement proper error handling with meaningful messages
- Add appropriate metadata for SEO
- Ensure performance optimization (lazy loading, memoization where appropriate)

## Time Estimate

**2-4 hours** should be enough for a complete implementation

## Getting Started

1. Analyze existing company pages (`/app/(header-default)/entreprise/[slug]/page.tsx`)
2. Study the data models in `/models/core/`
3. Review existing components `/components/section` and `/components/table`
