# Component Quick Reference

## Import Paths

```tsx
import {
  // Buttons
  Button,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  TextButton,
  ButtonLockup,
  
  // Navigation
  TopNav,
  
  // Cards
  TemplateCard,
  TemplateCardLoggedIn,
  TemplateCardLoggedOut,
  
  // Modals
  Modal,
  AuthModal,
  SignInModal,
  SignUpModal,
  FindTemplatesModal,
  IntegrationsModal,
  TemplateDetailModal,
  
  // Input
  AIInput,
} from '@/components/ui';
```

---

## Buttons

### PrimaryButton
```tsx
<PrimaryButton onClick={() => {}}>
  Get Started
</PrimaryButton>
```
**When to use**: Main call-to-action, submit forms, primary actions

---

### SecondaryButton
```tsx
<SecondaryButton onClick={() => {}}>
  Cancel
</SecondaryButton>
```
**When to use**: Secondary actions, cancel buttons, alternative options

---

### IconButton
```tsx
// Primary
<IconButton variant="primary" size="md" rounded>
  <Plus className="w-5 h-5" />
</IconButton>

// Secondary
<IconButton variant="secondary" size="md">
  <Settings className="w-5 h-5" />
</IconButton>

// Ghost (minimal)
<IconButton variant="ghost" size="md">
  <Menu className="w-5 h-5" />
</IconButton>
```
**Props**: 
- `variant`: `primary` | `secondary` | `ghost`
- `size`: `sm` | `md` | `lg`
- `rounded`: `boolean` (for circular buttons)

**When to use**: Toolbar actions, compact UIs, icon-only interactions

---

### TextButton
```tsx
<TextButton onClick={() => {}} underline>
  Learn More
</TextButton>
```
**Props**: `underline?: boolean`

**When to use**: Tertiary actions, inline links, "show more" links

---

### ButtonLockup
```tsx
<ButtonLockup
  primaryText="Continue"
  secondaryText="Cancel"
  orientation="horizontal"
  onPrimaryClick={() => {}}
  onSecondaryClick={() => {}}
/>
```
**Props**:
- `orientation`: `horizontal` | `vertical`
- `primaryText`: string
- `secondaryText`: string
- `onPrimaryClick`: function
- `onSecondaryClick`: function
- `primaryDisabled`: boolean
- `secondaryDisabled`: boolean

**When to use**: Modal footers, form actions, confirmation dialogs

---

## Navigation

### TopNav
```tsx
<TopNav
  state="logged-in-major"
  userName="John Doe"
  notificationCount={3}
  onSignIn={() => {}}
  onSignUp={() => {}}
  onNewProject={() => {}}
  onProfileClick={() => {}}
  onSettingsClick={() => {}}
  onNotificationsClick={() => {}}
  onLogout={() => {}}
/>
```

**States**:
- `logged-out`: Shows Sign In + Sign Up
- `logged-in-major`: Full features (New Project, Notifications, Settings)
- `logged-in-minor`: Minimal (Profile + Menu)

**When to use**:
- `logged-out`: Landing pages, public content
- `logged-in-major`: Dashboard, main app
- `logged-in-minor`: Chat, focused work areas

---

## Cards

### TemplateCardLoggedIn
```tsx
<TemplateCardLoggedIn
  category="Automation"
  categoryColor="purple"
  savedHours={5}
  title="Automate Rollback & Co-Builds"
  description="Automatically rollback deployments..."
  favorites={42}
  views={128}
  icon={<Sparkles className="w-5 h-5" />}
  isFavorited={false}
  isBookmarked={false}
  onFavorite={() => {}}
  onBookmark={() => {}}
  onShare={() => {}}
  onClick={() => {}}
/>
```

**Props**:
- `category`: string
- `categoryColor`: `purple` | `amber` | `blue` | `green`
- `savedHours`: number (optional)
- `title`: string
- `description`: string
- `favorites`: number
- `views`: number
- `icon`: ReactNode (optional)
- `isFavorited`: boolean
- `isBookmarked`: boolean
- `onFavorite`: function
- `onBookmark`: function
- `onShare`: function
- `onClick`: function

**When to use**: Template browsing for authenticated users

---

### TemplateCardLoggedOut
```tsx
<TemplateCardLoggedOut
  category="Automation"
  categoryColor="purple"
  savedHours={5}
  title="Automate Rollback & Co-Builds"
  description="Automatically rollback deployments..."
  favorites={42}
  views={128}
  icon={<Sparkles className="w-5 h-5" />}
  onSignIn={() => {}}
  onSignUp={() => {}}
/>
```

**Props**: Same as LoggedIn, but with:
- `onSignIn`: function (replaces interaction props)
- `onSignUp`: function

**When to use**: Template browsing for non-authenticated users, soft-gating

---

### TemplateCard (Original)
```tsx
<TemplateCard
  category="Automation"
  categoryColor="purple"
  savedHours={5}
  title="Template Title"
  description="Template description"
  favorites={42}
  views={128}
  onClick={() => {}}
/>
```
**When to use**: General template display (simpler than logged in/out variants)

---

## Modals

### Modal (Base)
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Optional Title"
  showLogo={true}
>
  {/* Your content */}
</Modal>
```

**Props**:
- `isOpen`: boolean
- `onClose`: function
- `children`: ReactNode
- `title`: string (optional)
- `showLogo`: boolean (default: true)
- `className`: string (content wrapper)
- `contentClassName`: string (modal card)
- `overlayClassName`: string (overlay)

**Features**:
- ESC key to close
- Click outside to close
- Body scroll lock
- Responsive sizing

---

### AuthModal, SignInModal, SignUpModal
```tsx
<SignInModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```
Pre-built authentication modals using the base Modal.

---

## Color Reference

### Category Colors
```tsx
categoryColor="purple" // Indigo/Purple tint
categoryColor="amber"  // Orange/Amber tint
categoryColor="blue"   // Blue tint
categoryColor="green"  // Green tint
```

### Brand Colors
```tsx
className="bg-copado-blue"    // #0070D2
className="text-copado-blue"  // #0070D2
className="bg-copado-dark"    // #032D60
```

### Text Colors
```tsx
className="text-slate-950"  // Headings (#020618)
className="text-slate-600"  // Body text (#45556c)
```

---

## Common Patterns

### Modal with Button Lockup
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Confirm Action">
  <p className="text-sm text-slate-600 mb-6">
    Are you sure you want to continue?
  </p>
  <ButtonLockup
    primaryText="Continue"
    secondaryText="Cancel"
    onPrimaryClick={handleContinue}
    onSecondaryClick={onClose}
  />
</Modal>
```

---

### Card Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <TemplateCardLoggedIn {...props1} />
  <TemplateCardLoggedIn {...props2} />
  <TemplateCardLoggedIn {...props3} />
</div>
```

---

### Icon Button Group
```tsx
<div className="flex gap-2">
  <IconButton variant="ghost" size="sm">
    <Edit className="w-4 h-4" />
  </IconButton>
  <IconButton variant="ghost" size="sm">
    <Trash className="w-4 h-4" />
  </IconButton>
  <IconButton variant="ghost" size="sm">
    <Share className="w-4 h-4" />
  </IconButton>
</div>
```

---

### Full Page Layout
```tsx
<div className="min-h-screen flex flex-col">
  <TopNav state="logged-in-major" {...navProps} />
  
  <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
    {/* Your content */}
  </main>
</div>
```

---

## Icon Sizes

Consistent sizing with Lucide React icons:

```tsx
<Icon className="w-3.5 h-3.5" /> // Stats icons (14px)
<Icon className="w-4 h-4" />     // Small buttons (16px)
<Icon className="w-5 h-5" />     // Medium buttons (20px)
<Icon className="w-6 h-6" />     // Large buttons (24px)
```

---

## Responsive Patterns

### Mobile-First Spacing
```tsx
className="gap-4 sm:gap-6"        // Larger gap on desktop
className="px-4 sm:px-6 lg:px-8"  // Progressive padding
className="text-sm sm:text-base"  // Responsive text
```

### Grid Breakpoints
```tsx
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Conditional Display
```tsx
className="hidden sm:inline"      // Show on desktop
className="sm:hidden"             // Show on mobile only
```

---

## Examples

All components have working examples in `/src/components/ui/examples/`:

```tsx
import {
  TopNavExample,
  ButtonsExample,
  TemplateCardsExample,
} from '@/components/ui/examples';
```

Run the dev server and navigate to these examples to see components in action.
