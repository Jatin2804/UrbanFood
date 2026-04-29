---
inclusion: always
---

# UrbanFood — Code Structure Rules

Always follow these conventions when writing or editing code in this project.

## Folder Responsibilities

| Folder | Purpose |
|---|---|
| `app/` | Expo Router screens only — no inline styles, no business logic |
| `components/<feature>/` | Reusable UI components, one per file |
| `styles/screens/` | StyleSheet for each screen file in `app/` |
| `styles/components/` | StyleSheet for each component in `components/` |
| `src/types/components.ts` | Prop interfaces for all components |
| `src/types/` | All TypeScript types and interfaces |
| `src/constants/` | App-wide constants (numbers, strings, config) |
| `src/hooks/` | Custom React hooks |
| `src/features/` | Redux slices, thunks, and feature-specific types |
| `src/services/` | API calls and external service wrappers |
| `src/data/` | Static data arrays/objects |

## Rules

### Styles
- **Never** write `StyleSheet.create({})` inside a screen or component file.
- Always create a matching style file:
  - Screen `app/checkout.tsx` → `styles/screens/checkoutStyles.ts`
  - Component `components/cart/PlaceOrderSheet.tsx` → `styles/components/placeOrderSheetStyles.ts`
- Export the styles as a named const: `export const checkoutStyles = StyleSheet.create({...})`
- Import theme tokens from `@/constants/theme` — never hardcode colors or spacing values.

### Types / Interfaces
- All component prop interfaces go in `src/types/components.ts`.
- Feature-specific types (Redux state, API shapes) go in `src/features/<feature>/<feature>Types.ts`.
- Re-export public types from `src/types/index.ts`.

### Constants
- Magic numbers and strings go in `src/constants/<domain>.ts`.
- Example: `DELIVERY_FEE` lives in `src/constants/cart.ts`.

### Hooks
- Custom hooks go in `src/hooks/use<Name>.ts`.
- Hooks must be pure — no JSX, no StyleSheet.

### Components
- One component per file.
- Import styles from the matching styles file.
- Import prop types from `src/types/components.ts`.
- Use `ThemedText` and `ThemedView` instead of raw `Text`/`View` where theming is needed.

### Screens (app/)
- Screens are thin — they wire hooks and components together.
- No `StyleSheet.create` in screen files.
- No inline business logic — delegate to hooks.

## Naming Conventions
- Style exports: `camelCase` + `Styles` suffix → `checkoutStyles`, `placeOrderSheetStyles`
- Style height constants exported alongside styles: `PLACE_ORDER_SHEET_HEIGHT`
- Hooks: `useLocation`, `useCart`, `useAuth`
- Components: PascalCase → `PlaceOrderSheet`, `CheckoutBar`
- Screens: PascalCase default export → `export default function Checkout()`
