# Trade Fields Components

This directory contains components used for trade parameter inputs and displays.

## TradeParam Component

A versatile component for displaying trade parameters like duration and stake values.

### Features

- Responsive layout that takes full available width
- Consistent left-aligned text following typography standards
- Interactive state with button functionality when onClick is provided
- Accessible keyboard navigation
- Semantic HTML structure

### Typography Specifications

The component follows the project's typography system using IBM Plex Sans:

#### Label Text
```css
font-family: IBM Plex Sans;
font-size: 12px;
font-weight: 400;
line-height: 18px;
text-align: left;
```

#### Value Text
```css
font-family: IBM Plex Sans;
font-size: 16px;
font-weight: 400;
line-height: 24px;
text-align: left;
```

### Usage

```tsx
import TradeParam from './TradeParam';

// Basic usage
<TradeParam
  label="Duration"
  value="1 minute"
/>

// With click handler
<TradeParam
  label="Stake"
  value="10 USD"
  onClick={() => setBottomSheet(true, 'stake')}
/>

// With custom className
<TradeParam
  label="Duration"
  value="1 minute"
  className="landscape:w-full"
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| label | string | The parameter label (e.g., "Duration", "Stake") |
| value | string | The parameter value to display |
| onClick | () => void | Optional click handler that makes the component interactive |
| className | string | Optional additional CSS classes |

### Testing

The component is thoroughly tested with Jest and React Testing Library:

- Rendering of label and value
- Click event handling
- Keyboard navigation
- Duration value formatting
- Custom class application
- ARIA label accessibility

See `__tests__/TradeParam.test.tsx` for test examples.

## ToggleButton Component

A toggle switch component used for boolean trade parameters like "Allow equals".

[Documentation for ToggleButton to be added...]
