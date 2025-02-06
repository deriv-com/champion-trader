# SideNav Component

## Overview
A responsive navigation sidebar component that appears in landscape mode, providing easy access to main application routes.

## Features
- Landscape-mode specific display
- Active route highlighting
- Icon and label navigation
- React Router integration
- Responsive design with Tailwind CSS

## Usage

### Basic Usage
```tsx
import { SideNav } from "@/components/SideNav";

function MainLayout() {
  return (
    <div className="flex">
      <SideNav />
      {/* Other content */}
    </div>
  );
}
```

## Navigation Structure

```typescript
interface NavigationItem {
  path: string;        // Route path
  icon: LucideIcon;    // Lucide icon component
  label: string;       // Navigation label
}

// Available routes
const routes = [
  { path: '/trade', icon: BarChart2, label: 'Trade' },
  { path: '/positions', icon: Clock, label: 'Positions' },
  { path: '/menu', icon: Menu, label: 'Menu' }
];
```

## Dependencies
```typescript
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useOrientationStore } from "@/stores/orientationStore";
```

## Responsive Behavior
Uses hooks for orientation-based display:
- `useDeviceDetection`: Detects if the device is mobile
- `useOrientationStore`: Manages orientation state
- Conditionally rendered based on device type and orientation
- Fixed width: `w-16`
- Full height: `h-[100dvh]`

## Styling
Uses Tailwind CSS with conditional classes:
```tsx
// Container
className={`${isLandscape ? 'flex' : 'hidden'} flex-col h-[100dvh] sticky top-0 w-16 border-r bg-white overflow-y-auto`}

// Navigation buttons
className="flex flex-col items-center gap-1"

// Active route highlighting
className="text-primary"  // Active route
className="text-gray-500" // Inactive route
```

## Implementation Details

### Route and State Handling
```typescript
const navigate = useNavigate();
const location = useLocation();
const { isMobile } = useDeviceDetection();
const { isLandscape } = useOrientationStore();

// Active route check
const isActive = location.pathname === '/route';
```

### Button Structure
```tsx
<button 
  onClick={() => navigate('/route')}
  className={`flex flex-col items-center gap-1 ${
    isActive ? 'text-primary' : 'text-gray-500'
  }`}
>
  <Icon className="w-5 h-5" />
  <span className="text-xs">Label</span>
</button>
```

## Example

```tsx
import { SideNav } from "@/components/SideNav";

function App() {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1">
        {/* Main content */}
      </main>
    </div>
  );
}
