# TabToggle Component

Animated toggle component for switching between tabs with count badges and smooth transitions.

## Features

- ✅ **Smooth animations** - Uses Framer Motion for fluid tab transitions
- ✅ **Count badges** - Optional count numbers for each tab
- ✅ **Size variants** - `xs`, `sm`, `default`
- ✅ **Color variants** - `default` (white) or `blue`
- ✅ **Responsive** - Adapts to screen size automatically
- ✅ **Auto-updates everywhere** - Changes to this component automatically appear in all places it's used

## Usage

```tsx
import { TabToggle } from '../components/ui';

<TabToggle
  tabs={[
    { id: 'recent', label: 'Recent', count: 5 },
    { id: 'favorites', label: 'Favorites', count: 12 },
    { id: 'suggested', label: 'Suggested Templates' }
  ]}
  activeTab={activeTab}
  onTabChange={(id) => setActiveTab(id)}
  size="default"
  variant="blue"
/>
```

## Where It's Used

- **HomePage** - Recent/Favorites/Suggested Templates toggle
- **AIInput** - Ask/Make mode toggle

## Auto-Update Pattern

Since TabToggle is a shared React component, **any updates to this component automatically appear everywhere it's embedded**. No need to manually update each usage - just update `TabToggle.tsx` and the changes propagate automatically.

