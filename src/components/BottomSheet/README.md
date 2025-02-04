# BottomSheet Component

## Overview
A bottom sheet component that slides up from the bottom of the screen with drag-to-dismiss functionality. Uses Zustand for state management and a configuration-based approach for content.

## Internal Working

### 1. State Management
```typescript
// bottomSheetStore.ts
interface BottomSheetState {
  showBottomSheet: boolean;  // Controls visibility
  key: string | null;        // Content identifier
  height: string;           // Sheet height
  setBottomSheet: (show: boolean, key?: string, height?: string) => void;
}
```

The component uses Zustand to maintain a single source of truth for:
- Visibility state
- Current content key
- Sheet height

### 2. Content Configuration
```typescript
// bottomSheetConfig.tsx
interface BottomSheetConfig {
  [key: string]: {
    body: ReactNode;
  }
}
```

Content is configured through a central config file, allowing for:
- Reusable content definitions
- Type-safe content management
- Easy content updates

### 3. Gesture Handling

#### Touch Start
```typescript
const handleTouchStart = (e: React.TouchEvent) => {
  dragStartY.current = e.touches[0].clientY;
  currentY.current = 0;
  isDragging.current = true;
}
```
- Captures initial touch position
- Sets up dragging state

#### Touch Move
```typescript
const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.current) return;
  
  const deltaY = e.touches[0].clientY - dragStartY.current;
  if (deltaY > 0) {
    sheetRef.current.style.transform = `translateY(${deltaY}px)`;
  }
}
```
- Calculates drag distance
- Updates sheet position
- Only allows downward dragging

#### Touch End
```typescript
const handleTouchEnd = () => {
  if (currentY.current > 100) {
    setBottomSheet(false);
  }
  // Reset position and state
}
```
- Checks if drag distance exceeds threshold
- Closes sheet if threshold met
- Resets position and state

### 4. Event Cleanup
```typescript
useEffect(() => {
  if (showBottomSheet) {
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }
}, [showBottomSheet, handleTouchMove, handleTouchEnd]);
```
- Adds event listeners when sheet is shown
- Removes listeners when sheet is closed
- Prevents memory leaks

### 5. Height Management
```typescript
const processedHeight = height.endsWith('%') 
  ? `${parseFloat(height)}vh` 
  : height;
```
Supports multiple height formats:
- Percentage (converted to vh)
- Pixels
- Viewport height

### 6. Styling
Uses Tailwind CSS variables for theme-aware styling:
```tsx
<div className="bg-background"> // Theme background
<div className="bg-muted">      // Theme muted color
```

## Usage Example

```tsx
// 1. Configure content
// bottomSheetConfig.tsx
export const bottomSheetConfig = {
  'trade-options': {
    body: <TradeOptionsContent />
  }
};

// 2. Place component
// App.tsx
<BottomSheet />

// 3. Control sheet
// AnyComponent.tsx
const { setBottomSheet } = useBottomSheetStore();

// Open with 50% height
setBottomSheet(true, 'trade-options', '50%');

// Close
setBottomSheet(false);
```

## Key Features

1. **Single Instance**
   - One bottom sheet instance for entire app
   - Content switched through configuration
   - Prevents multiple sheets

2. **Gesture Support**
   - Drag to dismiss
   - Smooth animations
   - Touch event cleanup

3. **Theme Integration**
   - Uses Tailwind CSS variables
   - Dark mode support
   - Consistent styling

4. **Dynamic Height**
   - Percentage values
   - Pixel values
   - Viewport height

5. **Performance**
   - Event listener cleanup
   - Optimized re-renders
   - Efficient state updates
