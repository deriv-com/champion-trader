# UI Components

## Overview
This directory contains reusable UI components built with React, TypeScript, and TailwindCSS. Each component follows atomic design principles and maintains consistent styling across the application.

### Toast Component

A reusable toast notification component for displaying success and error messages.

#### Features
- Fixed positioning at the top of the viewport
- Auto-dismissal with configurable duration
- Success and error variants with appropriate styling
- Smooth fade and slide animations
- High z-index (999) to ensure visibility
- Icon indicators for success/error states

#### Props
```typescript
interface ToastProps {
  message: string;          // Message to display
  type: 'success' | 'error'; // Toast variant
  onClose: () => void;      // Callback when toast closes
  duration?: number;        // Optional display duration in ms (default: 3000)
}
```

#### Usage
```tsx
import { Toast } from '@/components/ui/toast';

// Success toast
<Toast
  message="Operation successful!"
  type="success"
  onClose={() => setShowToast(false)}
/>

// Error toast with custom duration
<Toast
  message="An error occurred"
  type="error"
  onClose={() => setShowToast(false)}
  duration={5000}
/>
```

#### Styling
The component uses TailwindCSS with:
- Fixed positioning at top center
- High z-index (999) for overlay visibility
- Success (emerald) and error (red) color variants
- Smooth fade and slide animations
- Rounded corners and shadow for depth
- Consistent padding and text styling

## Components

### Skeleton Component

A reusable UI component that provides a visual placeholder while content is loading, using a background-only pulse animation to avoid unwanted border effects.

#### Features
- Background-only pulse animation
- Customizable via className props (TailwindCSS)
- Dark mode support
- Configurable animation colors via CSS variables
- No unwanted border effects

#### Props
```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}
```

The component accepts all standard HTML div attributes plus:

| Prop | Type | Description |
|------|------|-------------|
| className | string | TailwindCSS classes for styling |
| style | React.CSSProperties | Additional inline styles |
| [other div props] | any | Any standard HTML div attributes |

#### Usage
```tsx
import { Skeleton } from '@/components/ui/skeleton';

// Basic usage
<Skeleton className="h-4 w-full rounded-md" />

// Circle skeleton (e.g., for avatars)
<Skeleton className="h-12 w-12 rounded-full" />

// Card with multiple skeletons
<div className="p-4 border rounded-lg">
  <Skeleton className="h-6 w-3/4 rounded-md mb-4" />
  <Skeleton className="h-4 w-full rounded-md mb-2" />
  <Skeleton className="h-4 w-full rounded-md mb-2" />
  <Skeleton className="h-4 w-2/3 rounded-md mb-4" />
</div>
```

#### Customization

The component uses CSS variables for animation colors:

```tsx
// Custom colors
<Skeleton 
  className="h-4 w-full rounded-md"
  style={{
    "--skeleton-bg-from": "rgb(200, 200, 200)",
    "--skeleton-bg-to": "rgb(160, 160, 160)"
  }}
/>
```

#### Animation

Uses a custom `animate-pulse-bg` animation that only affects the background color, preventing unwanted border or glow effects.

### Chip Component

A reusable chip/tag component that supports selection states and click interactions.

#### Features
- Selectable state with visual feedback
- Consistent height and padding
- Smooth transitions
- Shadow and ring effects for depth
- Mobile-friendly touch target

#### Props
```typescript
interface ChipProps {
  children: React.ReactNode;    // Content to display inside the chip
  isSelected?: boolean;         // Optional selection state
  onClick?: () => void;         // Optional click handler
}
```

#### Usage
```tsx
import { Chip } from '@/components/ui/chip';

// Basic usage
<Chip>Label</Chip>

// With selection state
<Chip isSelected={true}>Selected</Chip>

// With click handler
<Chip onClick={() => console.log('clicked')}>Clickable</Chip>
```

#### Styling
The component uses TailwindCSS with:
- Fixed height (32px)
- Rounded full corners
- IBM Plex font
- Transitions for all properties
- Different styles for selected/unselected states:
  - Selected: Black background with white text
  - Unselected: White background with semi-transparent black text, subtle ring and shadow

#### Example in Duration Component
```tsx
<Chip 
  isSelected={selectedType === 'minute'} 
  onClick={() => onTypeSelect('minute')}
>
  Minutes
</Chip>
```

### PrimaryButton Component

A styled button component that extends the base Button component with primary action styling.

#### Features
- Full width by default
- Black background with hover state
- Consistent padding and rounded corners
- Semibold text weight
- Forward ref support
- Extends all HTML button attributes

#### Props
```typescript
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;    // Content to display inside the button
  className?: string;          // Optional additional classes
}
```

#### Usage
```tsx
import { PrimaryButton } from '@/components/ui/primary-button';

// Basic usage
<PrimaryButton>
  Submit
</PrimaryButton>

// With custom className
<PrimaryButton className="mt-4">
  Save Changes
</PrimaryButton>

// With onClick handler
<PrimaryButton onClick={() => console.log('clicked')}>
  Click Me
</PrimaryButton>
```

#### Styling
The component uses TailwindCSS with:
- Full width layout
- Large padding (py-6)
- Base text size
- Semibold font weight
- Black background with slightly transparent hover state
- Large border radius (rounded-lg)
- Supports className prop for additional customization

#### Example in Duration Component
```tsx
<PrimaryButton onClick={handleSave}>
  Save
</PrimaryButton>
```
