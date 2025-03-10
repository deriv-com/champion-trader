# Rise/Fall Trade Type - Business Specification

## Overview

The Rise/Fall trade type is a fundamental binary options trading mechanism in the Champion Trader application. It allows users to speculate on whether the market price will rise or fall from its current level within a specified time period. This document outlines the business logic, user journey, and technical implementation of the Rise/Fall trade type.

## Business Definition

### Core Concept

Rise/Fall is a binary options trade type where:

- **Rise**: The user predicts that the market price will be **higher** than the entry price at the end of the selected duration.
- **Fall**: The user predicts that the market price will be **lower** than the entry price at the end of the selected duration.

### Key Parameters

1. **Duration**: The time period for the trade, after which the outcome is determined.
   - Available units: Ticks, Seconds, Minutes, Hours, Days
   - Each unit has configurable minimum and maximum values

2. **Stake**: The amount of money the user wishes to risk on the trade.
   - Configurable minimum and maximum values
   - Default: 10 units of the selected currency

3. **Allow Equals** (Optional): When enabled, the user also wins if:
   - For Rise: The exit price is equal to the entry price
   - For Fall: The exit price is equal to the entry price

### Outcome Determination

- **Win Condition (Rise)**: Exit spot price > Entry spot price
- **Win Condition (Fall)**: Exit spot price < Entry spot price
- **Win Condition with "Allow Equals" (Rise)**: Exit spot price ≥ Entry spot price
- **Win Condition with "Allow Equals" (Fall)**: Exit spot price ≤ Entry spot price
- **Payout**: Predetermined at the time of purchase, displayed on the trade buttons

## User Journey

### 1. Market Selection

1. User navigates to the Trade page
2. User selects a market (e.g., "Volatility 75 Index")
3. The system loads the Rise/Fall trade type by default
4. The system fetches and applies the product configuration for the selected market

### 2. Trade Parameter Configuration

1. **Duration Selection**:
   - User clicks on the Duration field
   - A duration selector opens (bottom sheet on mobile, dropdown on desktop)
   - User selects a duration type (e.g., Minutes)
   - User selects a specific value (e.g., 5)
   - User confirms the selection

2. **Stake Configuration**:
   - User clicks on the Stake field
   - A stake input opens (bottom sheet on mobile, dropdown on desktop)
   - User enters or adjusts the stake amount
   - System validates the stake against minimum and maximum limits
   - User confirms the selection

3. **Optional: Allow Equals Configuration**:
   - If available, user can toggle the "Allow Equals" option
   - This modifies the win conditions as described above

### 3. Real-time Price Updates

1. The system continuously fetches real-time price data for the selected market
2. The chart displays the current market price and historical data
3. The system calculates and displays potential payouts for both Rise and Fall options
4. Payout values are updated in real-time based on market conditions

### 4. Trade Execution

1. User reviews the trade parameters and potential payouts
2. User decides whether to predict Rise or Fall
3. User clicks the corresponding button (Rise or Fall)
4. The system validates the user's account status and balance
5. The system executes the trade with the specified parameters
6. A confirmation notification appears showing the trade details

### 5. Trade Monitoring

1. The system adds the trade to the user's positions list
2. On desktop, the positions sidebar automatically opens
3. The user can monitor the trade progress on the chart
4. The system tracks the price movement until the trade duration expires

### 6. Outcome Determination

1. At the end of the duration period, the system compares the exit price to the entry price
2. The system determines if the trade is a win or loss based on the selected direction and "Allow Equals" setting
3. The system updates the user's balance accordingly
4. The trade is moved to the user's trade history

## Technical Implementation

### Configuration Structure

The Rise/Fall trade type is defined in the application's configuration system with the following structure:

```typescript
rise_fall: {
  fields: {
    duration: true,
    stake: true,
    allowEquals: false,
  },
  metadata: {
    preloadFields: true,
    preloadActions: true,
  },
  payouts: {
    max: true,
    labels: {
      buy_rise: "Payout (Rise)",
      buy_fall: "Payout (Fall)",
    },
  },
  buttons: [
    {
      title: "Rise",
      label: "Payout",
      className: "bg-color-solid-emerald-700 hover:bg-color-solid-emerald-600",
      position: "right",
      actionName: "buy_rise",
      contractType: "CALL",
    },
    {
      title: "Fall",
      label: "Payout",
      className: "bg-color-solid-cherry-700 hover:bg-color-solid-cherry-600",
      position: "left",
      actionName: "buy_fall",
      contractType: "PUT",
    },
  ],
}
```

### API Integration

The Rise/Fall trade type integrates with the trading API through:

1. **Product Configuration API**:
   - Endpoint: `/v1/market/products/rise_fall/config`
   - Provides market-specific configuration for durations, stake limits, etc.

2. **Price Stream**:
   - Uses Server-Sent Events (SSE) to receive real-time price updates
   - Updates payout values based on current market conditions

3. **Trade Execution API**:
   - Endpoint: `/buy`
   - Request Parameters:
     - `price`: Stake amount
     - `duration`: Formatted duration (e.g., "5m" for 5 minutes)
     - `instrument`: Market identifier
     - `trade_type`: "CALL" for Rise, "PUT" for Fall
     - `currency`: Trading currency
     - `payout`: Expected payout amount
     - `strike`: Strike price

### State Management

The application uses Zustand stores to manage the trade state:

1. **Trade Store**: Manages trade parameters (stake, duration, trade type)
2. **Client Store**: Manages user-specific data (currency, account)
3. **Market Store**: Manages selected market information
4. **Product Config Store**: Manages market-specific configuration

## User Interface Components

The Rise/Fall trade interface consists of:

1. **Chart**: Displays real-time and historical price data
2. **Trade Form**: Contains duration and stake input fields
3. **Trade Buttons**: Rise (green) and Fall (red) buttons with payout information
4. **How to Trade**: Educational content explaining the Rise/Fall mechanism

## Responsive Design

The interface adapts to different device orientations and screen sizes:

1. **Mobile (Portrait)**:
   - Vertical layout with chart at the top
   - Trade parameters and buttons at the bottom
   - Bottom sheets for parameter selection

2. **Desktop/Tablet (Landscape)**:
   - Horizontal layout with chart on the left
   - Trade parameters and buttons on the right
   - Dropdown/popup selectors for parameters

## Educational Content

The application provides educational content to help users understand the Rise/Fall trade type:

1. **How to Trade Guide**:
   - Accessible via a link on the trade page
   - Explains the Rise and Fall concepts with animations
   - Includes video tutorial

2. **Visual Animations**:
   - Rise animation shows an upward price movement
   - Fall animation shows a downward price movement

## Error Handling

The application handles various error scenarios:

1. **Invalid Stake**: Validates stake against minimum and maximum limits
2. **API Errors**: Displays user-friendly error messages
3. **Connection Issues**: Automatically attempts to reconnect to price streams
4. **Trade Execution Failures**: Shows detailed error notifications

## Performance Optimization

The Rise/Fall implementation includes performance optimizations:

1. **Preloaded Fields**: Components are preloaded for faster interaction
2. **Lazy Loading**: Non-critical components are loaded on demand
3. **Debounced Updates**: Prevents excessive API calls during user input
4. **Cached Configurations**: Product configurations are cached to reduce API calls

## Conclusion

The Rise/Fall trade type provides a straightforward yet powerful trading mechanism for users to speculate on market direction. Its intuitive interface, real-time updates, and comprehensive configuration options make it suitable for both novice and experienced traders. The implementation follows best practices for performance, responsiveness, and user experience.
