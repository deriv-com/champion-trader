# HowToTrade Component

A component that provides interactive guidance and tutorials for users on how to use the trading platform effectively.

## Features

- Step-by-step tutorials
- Interactive guides
- Modal presentation
- Progress tracking
- Responsive design
- Customizable content

## Component Structure

```
HowToTrade/
├── GuideModal.tsx    # Modal component for guides
├── HowToTrade.tsx   # Main component
├── index.ts         # Exports
└── README.md        # This file
```

## Usage

```tsx
import { HowToTrade } from '@/components/HowToTrade';

function TradingView() {
  return (
    <div>
      <HowToTrade
        onComplete={() => console.log('Tutorial completed')}
        initialStep={0}
      />
    </div>
  );
}
```

## Props

### HowToTrade

| Prop | Type | Description |
|------|------|-------------|
| onComplete? | () => void | Callback when tutorial is completed |
| initialStep? | number | Starting step number |
| className? | string | Optional CSS classes |

### GuideModal

| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Modal visibility state |
| onClose | () => void | Close handler |
| step | number | Current tutorial step |
| onNext | () => void | Next step handler |
| onPrev | () => void | Previous step handler |

## Features

### Tutorial Steps
- Clear instructions
- Visual guides
- Interactive elements
- Progress indicators
- Skip option

### Content Types
- Text explanations
- Image guides
- Video tutorials
- Interactive demos
- Practice exercises

### User Progress
- Step tracking
- Completion status
- Resume capability
- History tracking

## Styling

The component uses TailwindCSS for styling:
- Modal design
- Step indicators
- Navigation buttons
- Content layout
- Responsive sizing

## Tutorial Content

Example structure:
```typescript
const tutorialSteps = [
  {
    title: 'Select a Market',
    content: 'Choose from a variety of markets...',
    image: '/tutorial/market-selection.png',
  },
  {
    title: 'Set Trade Parameters',
    content: 'Configure your trade settings...',
    image: '/tutorial/trade-params.png',
  },
  // ...
];
```

## Best Practices

1. Keep instructions clear
2. Use visual aids
3. Allow skipping/resuming
4. Track completion
5. Follow atomic design principles
6. Maintain test coverage

## Accessibility

The component implements:
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels
- High contrast support

## Related Components

- MarketSelector: Market selection
- TradeButton: Trade execution
- Duration: Trade duration setting
- Stake: Trade amount setting
