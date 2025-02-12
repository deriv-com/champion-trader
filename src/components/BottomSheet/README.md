# BottomSheet Component

## Overview
A reusable bottom sheet component that provides a mobile-friendly interface with smooth animations, drag-to-dismiss functionality, and theme-aware styling.

## Features
- Single instance pattern using Zustand store
- Dynamic height support (%, px, vh)
- Theme-aware using Tailwind CSS variables
- Smooth animations for enter/exit transitions
- Drag gesture support with callback
- Content management through configuration
- Responsive overlay with fade effect
- Text selection prevention during drag
- Performance-optimized animations

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

### Text Selection Prevention
- Prevents text selection during drag operations
- Automatically re-enables text selection when:
  - Drag ends
  - Bottom sheet closes
  - Component unmounts
- Ensures smooth user experience during interactions

### Performance Optimizations
- Uses requestAnimationFrame for smooth drag animations
- Proper cleanup of styles and event listeners
- Handles edge cases like pointer leaving window
- Efficient event handling and state management
- Smooth transitions and transforms

### Event Cleanup
- Event listeners added only when sheet is shown
- Proper cleanup on sheet close and unmount
- Style cleanup (transform, userSelect) on all exit paths

## Testing
The component includes comprehensive test coverage for:
- Touch and mouse drag behaviors
- Text selection prevention
- Animation and style cleanup
- Desktop vs mobile interactions
- Edge cases and error states
- Event listener cleanup
- Performance optimization verification

## Styling
Uses Tailwind CSS for theme-aware styling and animations:
```tsx
// Theme colors
className="bg-background"    // Theme background
className="bg-muted"         // Theme muted color
className="bg-black/80"      // Semi-transparent overlay

// Animations
className="animate-in fade-in-0"           // Fade in animation
className="slide-in-from-bottom"           // Slide up animation
className="duration-300"                   // Animation duration
className="transition-transform"           // Smooth transform transitions

// Layout
className="rounded-t-[16px]"              // Rounded top corners
className="max-w-[800px]"                 // Maximum width
className="overflow-hidden"               // Content overflow handling
```

## Implementation Details

### Touch Event Handling
```typescript
const handleTouchMove = useCallback((e: TouchEvent) => {
  if (!sheetRef.current || !isDragging.current) return;

  const touch = e.touches[0];
  const deltaY = touch.clientY - dragStartY.current;
  currentY.current = deltaY;

  if (deltaY > 0) {
    sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    onDragDown?.();
  }
}, [onDragDown]);
```

### Mouse Event Handling
```typescript
const handleMouseMove = useCallback((e: MouseEvent) => {
  if (!sheetRef.current || !isDragging.current) return;

  requestAnimationFrame(() => {
    const deltaY = e.clientY - dragStartY.current;
    currentY.current = deltaY;

    if (deltaY > 0) {
      sheetRef.current!.style.transform = `translateY(${deltaY}px)`;
      onDragDown?.();
    }
  });
}, [onDragDown]);
```

### Overlay Handling
```tsx
<div
  className="fixed inset-0 bg-black/80 z-[60] animate-in fade-in-0"
  onClick={() => {
    onDragDown?.();
    setBottomSheet(false);
  }}
/>
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
