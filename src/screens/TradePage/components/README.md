# Trade Page Components

## TradeFormController

The TradeFormController is a dynamic form component that renders trade fields and buttons based on the current trade type configuration.

### Features

- Config-driven rendering of trade fields and buttons
- Responsive layout support (mobile/desktop)
- Lazy loading of form components
- Integrated with trade actions and store

### Usage

```tsx
import { TradeFormController } from "./components/TradeFormController";

// In your component:
<TradeFormController isLandscape={isLandscape} />
```

### Architecture

The component follows these key principles:

1. **Configuration-Driven**
   - Uses trade type configuration from `src/config/tradeTypes.ts`
   - Dynamically renders fields and buttons based on config
   - Supports different layouts per trade type

2. **Lazy Loading**
   - Components are lazy loaded using React.lazy
   - Suspense boundaries handle loading states
   - Preloading based on metadata configuration

3. **Store Integration**
   - Uses useTradeStore for trade type and form values
   - Uses useTradeActions for button click handlers
   - Maintains reactive updates to store changes

### Component Structure

```typescript
interface TradeFormControllerProps {
  isLandscape: boolean;  // Controls desktop/mobile layout
}

// Lazy loaded components
const DurationField = lazy(() => import("@/components/Duration"));
const StakeField = lazy(() => import("@/components/Stake"));
const EqualTradeController = lazy(() => import("@/components/EqualTrade"));

export const TradeFormController: React.FC<TradeFormControllerProps>
```

### Layout Modes

1. **Desktop Layout (isLandscape: true)**
   - Vertical stack of fields
   - Full-width trade buttons
   - Fixed width sidebar

2. **Mobile Layout (isLandscape: false)**
   - Grid layout for fields
   - Bottom-aligned trade buttons
   - Full-width container

### Adding New Fields

To add a new field type:

1. Create the field component
2. Add it to the lazy loaded components
3. Update the trade type configuration
4. Add rendering logic in the controller

Example:
```typescript
// 1. Create component
const NewField = lazy(() => import("@/components/NewField"));

// 2. Update config
{
  fields: {
    newField: true
  }
}

// 3. Add rendering
{config.fields.newField && (
  <Suspense fallback={<div>Loading...</div>}>
    <NewField />
  </Suspense>
)}
```

### Testing

The component should be tested for:

1. **Configuration Changes**
   - Different trade types render correctly
   - Fields appear/disappear as expected
   - Buttons update properly

2. **Interactions**
   - Field interactions work
   - Button clicks trigger correct actions
   - Loading states display properly

3. **Responsive Behavior**
   - Desktop layout renders correctly
   - Mobile layout renders correctly
   - Transitions between layouts work

4. **Performance**
   - Lazy loading works as expected
   - Preloading triggers correctly
   - No unnecessary re-renders

Example test:
```typescript
describe('TradeFormController', () => {
  it('renders correct fields for trade type', () => {
    const { setTradeType } = useTradeStore();
    setTradeType('rise_fall');
    
    render(<TradeFormController isLandscape={true} />);
    
    expect(screen.getByTestId('duration-field')).toBeInTheDocument();
    expect(screen.getByTestId('stake-field')).toBeInTheDocument();
  });
});
