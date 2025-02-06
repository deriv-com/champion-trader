# UI Components

## Overview
This directory contains reusable UI components built with React, TypeScript, and TailwindCSS. Each component follows atomic design principles and maintains consistent styling across the application.

## Components

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
