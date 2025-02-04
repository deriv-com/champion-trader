# BottomSheet Component

## Overview
A reusable bottom sheet component with drag-to-dismiss functionality and drag callback support.

## Features
- Single instance pattern using Zustand store
- Dynamic height support (%, px, vh)
- Theme-aware using Tailwind CSS variables
- Drag gesture support with callback
- Content management through configuration

## Usage

### Basic Usage
```tsx
const { setBottomSheet } = useBottomSheetStore();

// Show bottom sheet
setBottomSheet(true, 'content-key', '50%');

// Hide bottom sheet
setBottomSheet(false);
```

### With Drag Callback
```tsx
const handleDragDown = () => {
  console.log('Bottom sheet is being dragged down');
  // Your drag down logic here
};

setBottomSheet(true, 'content-key', '50%', handleDragDown);
```

## State Management

```typescript
interface BottomSheetState {
  showBottomSheet: boolean;  // Controls visibility
  key: string | null;        // Content identifier
  height: string;           // Sheet height
  onDragDown?: () => void;  // Optional drag callback
  setBottomSheet: (
    show: boolean, 
    key?: string, 
    height?: string,
    onDragDown?: () => void
  ) => void;
}
```

## Height Support
- Percentage: '50%' (converted to vh)
- Pixels: '380px'
- Viewport height: '75vh'

## Gesture Handling

### Drag to Dismiss
- Drag down on handle bar to dismiss
- Threshold: 100px vertical distance
- Smooth animation on release
- Optional callback during drag

### Event Cleanup
- Event listeners added only when sheet is shown
- Proper cleanup on sheet close and unmount

## Styling
Uses Tailwind CSS variables for theme support:
```tsx
className="bg-background"    // Theme background
className="bg-muted"         // Theme muted color
```

## Implementation Details

### Touch Event Handling
```typescript
const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.current) return;

  const deltaY = e.touches[0].clientY - dragStartY.current;
  if (deltaY > 0) {
    // Update sheet position
    sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    // Call drag callback if provided
    onDragDown?.();
  }
};
```

### Height Processing
```typescript
const processedHeight = height.endsWith('%') 
  ? `${parseFloat(height)}vh` 
  : height;
```

## Example

```tsx
import { useBottomSheetStore } from "@/stores/bottomSheetStore";

function MyComponent() {
  const { setBottomSheet } = useBottomSheetStore();

  const handleDragDown = () => {
    // Handle drag down event
  };

  const showSheet = () => {
    setBottomSheet(true, 'my-content', '50%', handleDragDown);
  };

  return (
    <button onClick={showSheet}>
      Show Bottom Sheet
    </button>
  );
}
