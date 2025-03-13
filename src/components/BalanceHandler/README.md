# BalanceHandler Component

## Overview

The `BalanceHandler` component is responsible for subscribing to the balance stream API and updating the client store with the latest balance data. It doesn't render any UI elements and is designed to be used as a background service component.

## Usage

```tsx
import { BalanceHandler } from '@/components/BalanceHandler';

// Inside your component
return (
  <>
    {token && <BalanceHandler token={token} />}
    {/* Rest of your UI */}
  </>
);
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| token | string | Authentication token for the user |

## Functionality

1. Subscribes to the balance stream API using the `useAccountBalanceStream` hook
2. Updates the client store with the latest balance data when it changes
3. Automatically unsubscribes when the component unmounts

## Dependencies

- `useClientStore`: For accessing and updating the client's balance information
- `useAccountBalanceStream`: For subscribing to the balance stream API