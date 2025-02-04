# Components Documentation

## Table of Contents
- [BottomSheet](#bottomsheet)
- [TradeParam](#tradeparam)
- [TradeButton](#tradebutton)
- [Chart](#chart)
- [DurationOptions](#durationoptions)
- [AddMarketButton](#addmarketbutton)

## BottomSheet

A reusable bottom sheet component with drag-to-dismiss functionality.

### Key Features
- Single instance pattern using Zustand store
- Dynamic height support (%, px, vh)
- Theme-aware using Tailwind CSS variables
- Drag gesture support with proper event cleanup
- Content management through configuration

### Usage

```tsx
// 1. Configure content in bottomSheetConfig.tsx
export const bottomSheetConfig = {
  'my-key': {
    body: <MyContent />
  }
};

// 2. Place component at root level
<BottomSheet />

// 3. Control from anywhere using the store
const { setBottomSheet } = useBottomSheetStore();
setBottomSheet(true, 'my-key', '50%');
```

### State Management
```typescript
interface BottomSheetState {
  showBottomSheet: boolean;
  key: string | null;
  height: string;
  setBottomSheet: (show: boolean, key?: string, height?: string) => void;
}
```

### Recent Changes
- Removed click-outside-to-close behavior
- Added proper event listener cleanup
- Migrated to theme-aware colors using Tailwind CSS variables
- Improved touch event handling
- Added dynamic height support

## TradeParam

A card component for displaying trade parameters.

### Usage
```tsx
<TradeParam 
  label="Stake" 
  value="100" 
  onClick={handleClick} // Optional
/>
```

### Props
```typescript
interface TradeParamProps {
  label: string;
  value: string;
  onClick?: () => void;
}
```

### Recent Changes
- Made component purely presentational
- Added optional onClick handler
- Cursor pointer only shows when onClick is provided

## TradeButton

[Documentation for TradeButton component]

## Chart

[Documentation for Chart component]

## DurationOptions

[Documentation for DurationOptions component]

## AddMarketButton

[Documentation for AddMarketButton component]

---

## Component Design Principles

### 1. State Management
- Use Zustand for global state
- Keep components as pure as possible
- Pass event handlers from parent components

### 2. Styling
- Use Tailwind CSS with theme variables
- Follow design system color tokens
- Ensure dark mode compatibility

### 3. Performance
- Implement proper cleanup
- Use React.memo where beneficial
- Lazy load when appropriate

### 4. Accessibility
- Follow WCAG guidelines
- Ensure proper keyboard navigation
- Maintain appropriate color contrast

### 5. Testing
- Write comprehensive unit tests
- Test edge cases
- Mock external dependencies
