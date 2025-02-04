# Chart Component

The Chart component displays market data using a WebSocket connection. It is responsible for:

- **Real-Time Price Updates:** Receiving and displaying live market prices.
- **Connection Status:** Indicating whether the WebSocket connection is active or disconnected.
- **Error Handling:** Displaying errors when the WebSocket encounters issues.
- **Customization:** Accepting an optional `className` prop for styling.

## Usage

```tsx
import { Chart } from "@/components/Chart";

function App() {
  return (
    <div>
      <Chart className="custom-chart-class" />
    </div>
  );
}
```

## Props

| Prop      | Type   | Description                           |
|-----------|--------|---------------------------------------|
| className | string | Optional CSS class for the component. |

## Implementation Details

- The component uses the `useMarketWebSocket` hook with a hardcoded instrument ID of `"R_100"`.
- WebSocket events such as connection, price updates, and errors are logged to the console.
- The UI displays the current market price, a disconnected message when the connection is lost, and any error messages.

## Future Enhancements

- Integrate a visual charting library for dynamic price visualization.
- Add configurable instrument IDs and callback functions via props.
