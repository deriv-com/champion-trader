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

## Responsive Behavior
- Hidden by default on portrait mode: `hidden`
- Visible in landscape mode: `landscape:flex`
- Fixed width: `w-16`
- Full height: `h-full`

## Styling
Uses Tailwind CSS for styling:
```tsx
// Container
className="hidden landscape:flex flex-col h-full w-16 border-r bg-white"

// Navigation buttons
className="flex flex-col items-center gap-1"

// Active route highlighting
className="text-primary"  // Active route
className="text-gray-500" // Inactive route
```

## Implementation Details

### Route Handling
```typescript
const navigate = useNavigate();
const location = useLocation();

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
