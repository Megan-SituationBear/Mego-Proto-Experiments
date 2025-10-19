# Copado AI Design System

This document outlines the design system extracted from the UI mockups and implemented in our component library.

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
  - [Navigation](#navigation)
  - [Buttons](#buttons)
  - [Cards](#cards)
  - [Modals](#modals)

---

## Color Palette

### Primary Colors
```css
--color-copado-blue: #0070D2    /* Primary brand color, main CTAs */
--color-copado-dark: #032D60    /* Dark brand variant */
```

### Semantic Colors
```css
/* Card & UI Colors */
--color-card-border: #cad5e2    /* Card borders */
--color-pill-bg: #e0e7ff        /* Category pill backgrounds */
--color-pill-text: #62748e      /* Category pill text */
--color-saved-hours: #ad46ff    /* Saved hours highlight */

/* Text Colors */
--color-text-primary: #020618   /* Headings, primary text */
--color-text-secondary: #45556c /* Body text, secondary info */
```

### Tailwind Equivalents
- **Primary Blue**: `bg-copado-blue` / `text-copado-blue`
- **Indigo Hover**: `hover:bg-indigo-600`
- **Slate Text**: `text-slate-950` (headings), `text-slate-600` (body)
- **Gray Borders**: `border-gray-300`

---

## Typography

### Font Families
```css
--font-family-inter: 'Inter', system-ui, sans-serif;   /* Body text */
--font-family-roboto: 'Roboto', system-ui, sans-serif; /* Headers */
```

### Font Styles

#### Headers (Roboto)
- **Font**: Roboto, 600 weight (semibold)
- **Letter Spacing**: -0.03em (-3% tracking)
- **Color**: `#020618` (slate-950)
- **Classes**: `.font-roboto`, `.tracking-header`

#### Body Text (Inter)
- **Font**: Inter, 400 weight (regular)
- **Size**: 15px
- **Line Height**: 24px (1.6)
- **Color**: `#45556c` (slate-600)
- **Classes**: `.font-inter`, `.text-body`

#### Size Scale
```
h1: 28px (text-[28px])
h2: 24px (text-2xl)
h3: 16px (text-base)
Body: 15px (text-[15px])
Small: 13px (text-[13px])
Tiny: 11px (text-[11px])
```

---

## Spacing & Layout

### Spacing Scale
Based on Tailwind's spacing scale (4px base):
- **xs**: 0.5rem (8px) - `gap-2`
- **sm**: 0.75rem (12px) - `gap-3`
- **md**: 1rem (16px) - `gap-4`
- **lg**: 1.5rem (24px) - `gap-6`
- **xl**: 2rem (32px) - `gap-8`

### Border Radius
- **Small**: `rounded-lg` (8px) - Buttons, small cards
- **Medium**: `rounded-xl` (12px) - Cards, modals
- **Full**: `rounded-full` - Icon buttons, avatars

### Shadows
```css
/* Subtle elevation */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)

/* Card hover */
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)

/* Modal */
shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

---

## Components

### Navigation

#### TopNav
**States**: `logged-out` | `logged-in-major` | `logged-in-minor`

**Logged Out**
- Minimal: Logo + Sign In + Sign Up buttons
- Use for: Landing pages, marketing content

**Logged In Major**
- Full features: New Project, Notifications, Settings, Profile, Logout
- Use for: Dashboard, main app areas

**Logged In Minor**  
- Reduced: Profile + Menu only
- Use for: Focused work areas, chat interfaces

```tsx
import { TopNav } from '@/components/ui';

<TopNav 
  state="logged-in-major"
  userName="John Doe"
  notificationCount={3}
  onNewProject={() => {}}
/>
```

---

### Buttons

#### Primary Button
- **Color**: Copado Blue (#0070D2)
- **Hover**: Indigo 600
- **Use**: Main actions (Submit, Create, Save)

```tsx
<PrimaryButton onClick={handleSubmit}>
  Get Started
</PrimaryButton>
```

#### Secondary Button
- **Color**: White with gray border
- **Hover**: Light gray background
- **Use**: Alternative actions (Cancel, Back)

```tsx
<SecondaryButton onClick={handleCancel}>
  Cancel
</SecondaryButton>
```

#### Icon Button
**Variants**: `primary` | `secondary` | `ghost`  
**Sizes**: `sm` | `md` | `lg`  
**Shape**: Standard rounded or `rounded={true}` for circular

- **Primary**: Action buttons (Add, Favorite)
- **Ghost**: Toolbar actions, minimal impact

```tsx
<IconButton variant="primary" size="md" rounded>
  <Plus className="w-5 h-5" />
</IconButton>
```

#### Text Button
- **Color**: Copado Blue
- **Optional**: Underline
- **Use**: Tertiary actions, links (Learn More, View All)

```tsx
<TextButton underline>
  Learn More
</TextButton>
```

#### Button Lockup
Combined Primary + Secondary for forms/modals

```tsx
<ButtonLockup
  primaryText="Continue"
  secondaryText="Cancel"
  orientation="horizontal" // or "vertical"
  onPrimaryClick={handleContinue}
  onSecondaryClick={handleCancel}
/>
```

---

### Cards

#### Template Card (Logged In)
**Features**:
- Full interaction enabled
- Hover shows quick actions (Bookmark, Share)
- Clickable favorite button
- Border changes to blue on hover

**Use**: Authenticated users browsing templates

```tsx
<TemplateCardLoggedIn
  category="Automation"
  categoryColor="purple"
  savedHours={5}
  title="Automate Rollback"
  description="..."
  favorites={42}
  views={128}
  isFavorited={false}
  isBookmarked={false}
  onFavorite={() => {}}
  onBookmark={() => {}}
  onShare={() => {}}
  onClick={() => {}}
/>
```

#### Template Card (Logged Out)
**Features**:
- Preview mode with lock overlay on hover
- Encourages authentication
- Shows Sign In / Sign Up buttons

**Use**: Non-authenticated users, soft-gating content

```tsx
<TemplateCardLoggedOut
  category="Automation"
  categoryColor="purple"
  savedHours={5}
  title="Automate Rollback"
  description="..."
  favorites={42}
  views={128}
  onSignIn={() => {}}
  onSignUp={() => {}}
/>
```

**Category Colors**: `purple` | `amber` | `blue` | `green`

---

### Modals

#### Base Modal
**Features**:
- Semi-transparent gray overlay (#8E9BAD)
- Optional logo header with close button
- Click outside or ESC to close
- Body scroll locked when open
- Max width: 400px

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  showLogo={true}
>
  {/* Modal content */}
</Modal>
```

**Props**:
- `showLogo`: Toggle Copado AI header
- `title`: Optional title below header
- `className`: Content wrapper classes
- `contentClassName`: Modal card classes
- `overlayClassName`: Overlay classes

---

## Design Patterns

### Hover States
- **Cards**: Border color changes, shadow increases
- **Buttons**: Background darkens, shadow increases
- **Icons**: Color changes to brand blue
- **Transition**: 200ms duration

### Focus States
- **Ring**: 2px offset ring
- **Color**: Brand color or gray depending on variant
- **All interactive elements** should have visible focus states

### Disabled States
- **Opacity**: 50%
- **Cursor**: `cursor-not-allowed`
- **No hover effects**

### Transitions
```css
transition-all duration-200  /* Standard interactions */
transition-colors           /* Color-only changes */
transition-opacity          /* Fade effects */
```

---

## Accessibility

### Required Patterns
1. **Semantic HTML**: Use proper elements (`<button>`, `<nav>`, etc.)
2. **ARIA Labels**: All icon-only buttons need `aria-label`
3. **Keyboard Navigation**: All interactive elements accessible via keyboard
4. **Focus Visible**: Clear focus indicators on all interactive elements
5. **Color Contrast**: Minimum WCAG AA compliance

### Example
```tsx
<button
  onClick={handleClose}
  aria-label="Close modal"
  className="..."
>
  <X className="w-5 h-5" />
</button>
```

---

## Usage Examples

See the `/examples` folder for complete working examples:
- `TopNav.example.tsx` - All navigation states
- `Buttons.example.tsx` - All button variants
- `TemplateCards.example.tsx` - Card variants with state

Import examples:
```tsx
import { 
  TopNavExample,
  ButtonsExample,
  TemplateCardsExample 
} from '@/components/ui/examples';
```

---

## Best Practices

### Do's ✅
- Use semantic color names (`copado-blue` not `blue-600`)
- Maintain consistent spacing (use scale)
- Follow hover/focus patterns
- Use appropriate button types for actions
- Keep icon sizes consistent (w-4/h-4, w-5/h-5, w-6/h-6)

### Don'ts ❌
- Don't mix font families (headers = Roboto, body = Inter)
- Don't create custom spacing values
- Don't skip hover/focus states
- Don't use bare colors (always use design tokens)
- Don't nest interactive elements

---

## Contributing

When adding new components:
1. Follow existing patterns and conventions
2. Use design tokens from `index.css`
3. Include TypeScript types
4. Add hover, focus, and disabled states
5. Create an example file
6. Update this documentation
7. Test accessibility (keyboard + screen reader)
