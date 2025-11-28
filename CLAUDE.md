# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Medipath Admin Portal** (formerly drfasttrack), a Next.js 14 admin application for managing hospitals, procedures, patients, and bookings in a healthcare platform. The project uses TypeScript, Tailwind CSS, and React Query for state management.

## Key Commands

### Development
```bash
npm run dev              # Start development server on port 3007
npm run dev:next         # Start dev server on default port (3000)
npm run build            # Production build with sitemap generation
npm start                # Start production server
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run format           # Fix linting issues and format JSON/YAML
npm run check-types      # Type check without emitting files
npm test                 # Run Jest tests
```

### Utilities
```bash
npm run clean            # Remove .next, .swc, out, and coverage directories
npm run build-stats      # Analyze bundle size
npm run commit           # Interactive commit with Commitizen
```

## Architecture

### Core Structure

- **Next.js App Router**: Uses the `src/app/` directory for file-based routing
- **Custom Axios Instance**: Located at `src/utils/axiosInstance.ts`, handles authentication with automatic token refresh on 401 responses
- **React Query**: All API calls use TanStack Query (React Query) for data fetching and caching
- **Custom Hooks**: Business logic is encapsulated in hooks under `src/hooks/`

### Authentication Flow

The app uses OTP-based authentication with JWT tokens:

1. User requests OTP via email (`sendOTP`)
2. User verifies OTP (`verifyOTP`)
3. Receives `accessToken` and `refreshToken` stored in localStorage
4. Axios interceptor (`src/utils/axiosInstance.ts`) automatically:
   - Attaches access token to all requests
   - Refreshes token on 401 errors
   - Signs out user if refresh fails

**Important**: The axios instance includes a custom header `'ngrok-skip-browser-warning': 'true'` for development.

### State Management Pattern

All data fetching follows this pattern:
- API functions are defined in hook files (e.g., `src/hooks/useAuth.ts`, `src/hooks/useHospital.ts`)
- React Query hooks wrap API calls with `useQuery` or `useMutation`
- Components consume these hooks for data access

Example from `src/hooks/useAuth.ts:148`:
```typescript
export const useGetAdminDetails = () => {
  return useQuery({
    queryKey: [`admin-details`],
    queryFn: () => getAdminDetails(),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
```

### Key Hooks

- `useAuth`: OTP authentication, admin details
- `useHospital`: Hospital CRUD operations, team member management
- `useHospitalProcedure`: Hospital-specific procedures
- `useProcedure`: Global procedure management
- `useDepartment`: Department operations
- `useMember`: Team member operations
- `useBooking`: Patient booking management

### Component Organization

Components are organized by feature:
- `src/components/Modal/`: Reusable modal components
- `src/components/Table/`: Data table components (uses ag-grid)
- `src/components/Card/`: Card-based UI components
- `src/components/SkeletonLoader/`: Loading states
- `src/components/WithAuth/`: HOC for protected routes

### Routing Structure

- `/` - Login/home page
- `/hospitals` - Hospital management
- `/hospitals/add` - Add new hospital
- `/hospitals/add/[id]` - Edit hospital details
- `/hospitals/add/[id]/procedures` - Manage hospital procedures
- `/procedures` - Global procedures management
- `/patients` - Patient list
- `/patients/[id]` - Patient details

## Environment Variables

Required environment variables (see `.env`):
- `NEXT_PUBLIC_BASE_URL`: Backend API base URL
- `NEXT_PUBLIC_APP_URL`: Frontend app URL
- Additional optional vars for banking integration, PostHog analytics

**Note**: The `BASE_URL` is also available as `process.env.BASE_URL` in the app via `next.config.js` env mapping.

## Code Style & ESLint

- Follows Airbnb TypeScript style guide
- Prettier for formatting (single quotes, auto line endings)
- Import sorting via `eslint-plugin-simple-import-sort`
- Unused imports are automatically detected and must be removed
- Tailwind CSS class ordering enforced
- Path aliases: `@/*` maps to `src/*`, `@/public/*` maps to `public/*`

## TypeScript Configuration

- Strict mode enabled with comprehensive checks
- `noUncheckedIndexedAccess: true` - always check array/object access
- All unused locals and parameters must be addressed
- Path aliases configured in `tsconfig.json:40-42`

## Image Handling

Next.js Image component is configured to allow remote images from AWS S3 buckets:
- `drfasttrackno-dev.s3.eu-central-1.amazonaws.com`
- `drfasttrack-dev.s3.eu-north-1.amazonaws.com`
- `dev-drfastrack.s3.eu-central-1.amazonaws.com`

## Important Implementation Notes

1. **React Strict Mode is disabled** (`next.config.js:16`) - be aware of potential issues this may hide
2. **Axios baseURL**: Always use the configured axios instance from `src/utils/axiosInstance.ts`, not raw axios
3. **Token Storage**: Access and refresh tokens are stored in localStorage with keys `access_token` and `refresh_token`
4. **Sign Out**: Use `handleSignout()` from `src/utils/axiosInstance.ts` to properly clear auth state
5. **Error Handling**: API errors follow a consistent structure with nested error objects (see `ServerError` type in `useAuth.ts:17-27`)
6. **Form Validation**: Uses react-hook-form with Zod schemas (via `@hookform/resolvers`)

## Testing

- Jest is configured but test files not yet present
- Run tests with `npm test`

## Git Workflow

- Husky pre-commit hooks run lint-staged
- Commitizen configured for conventional commits
- Use `npm run commit` for guided commit messages
