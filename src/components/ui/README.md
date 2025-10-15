# UI Component Library

This directory contains reusable UI components for the new-prototype application.

## Components

### AIInput

A customizable AI input component with action bar and popover menu.

#### Props

- `placeholder?: string` - Input placeholder text (default: "Try: @Copado what do you do? Or, @project Let's Go!")
- `onSendMessage?: (text: string) => void` - Callback when user sends a message
- `onUploadImage?: () => void` - Callback when upload image is clicked
- `onUploadDoc?: () => void` - Callback when upload document is clicked
- `onExamineSlack?: () => void` - Callback when examine Slack is clicked
- `onAddConfluence?: () => void` - Callback when add Confluence is clicked
- `onIntegrationsClick?: () => void` - Callback when integrations button is clicked
- `className?: string` - Additional CSS classes

#### Usage

```tsx
import { AIInput } from './ui';

<AIInput
  placeholder="Custom placeholder text"
  onSendMessage={(text) => console.log('Message:', text)}
  onIntegrationsClick={() => setShowModal(true)}
/>
```

### Modal

A base modal component with consistent design and behavior across the application.

#### Props

- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `children: React.ReactNode` - Modal content
- `title?: string` - Optional modal title (displays in header)
- `className?: string` - Additional CSS classes for content
- `overlayClassName?: string` - Additional CSS classes for overlay
- `contentClassName?: string` - Additional CSS classes for modal content container

#### Features

- **Consistent Design**: X button positioned outside the white modal box in top-right
- **Click Outside to Close**: Clicking outside the modal closes it
- **Keyboard Support**: ESC key closes the modal
- **Body Scroll Prevention**: Prevents background scrolling when modal is open
- **Accessible**: Proper focus management and ARIA attributes
- **Responsive**: Min-width of 320px for mobile compatibility

#### Design Specifications

- **Border Radius**: 12px rounded corners
- **Drop Shadow**: Medium drop shadow (0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05))
- **Padding**: 24pt padding around all content
- **Modal Background**: rgba(29, 45, 61, 0.5) (1D293D at 50% opacity)
- **Title Style**: text-2xl font-semibold text-center capitalize text-[#020618]
- **Body Text Style**: text-sm font-medium text-left text-[#45556c]

#### Usage

```tsx
import { Modal } from './ui';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="My Modal"
>
  <div>Modal content goes here</div>
</Modal>
```

### IntegrationsModal

A modal component for displaying and selecting integrations. Built on top of the base Modal component.

#### Props

- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `onConnect?: () => void` - Callback when connect button is clicked
- `integrations?: Integration[]` - Array of integration options
- `className?: string` - Additional CSS classes

#### Integration Interface

```tsx
interface Integration {
  name: string;
  icon: string;
  description: string;
}
```

#### Usage

```tsx
import { IntegrationsModal } from './ui';

const integrations = [
  { name: 'Slack', icon: '💬', description: 'Connect your Slack workspace' },
  { name: 'Github', icon: '🐙', description: 'Access repositories' }
];

<IntegrationsModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  integrations={integrations}
  onConnect={() => console.log('Connected!')}
/>
```

### Button Components

#### PrimaryButton

A primary button component with blue background and hover effects.

```tsx
import { PrimaryButton } from './ui';

<PrimaryButton onClick={() => console.log('Clicked!')}>
  Primary Action
</PrimaryButton>
```

**Specifications:**
- Background: `bg-blue-600`
- Shadow: `shadow-sm`
- Hover: `hover:bg-indigo-600 hover:shadow-md`

#### SecondaryButton

A secondary button component with white background and border.

```tsx
import { SecondaryButton } from './ui';

<SecondaryButton onClick={() => console.log('Clicked!')}>
  Secondary Action
</SecondaryButton>
```

**Specifications:**
- Background: `bg-white`
- Border: `border border-[#cad5e2]`
- Shadow: `0px 1px 2px 0 rgba(0,0,0,0.05)`
- Hover: `hover:bg-slate-100 hover:shadow-md`
- Text: `text-[#62748e]` (15px, font-medium, capitalize)

## Export

All components are exported from the index file:

```tsx
import { AIInput, IntegrationsModal, Modal, Button, PrimaryButton, SecondaryButton } from './ui';
```
