# Side Navigation and Menu Sidebar

## Overview
This directory contains components related to the application's side navigation, including:
- `SideNav.tsx`: The main navigation bar.
- `MenuSidebar.tsx`: A collapsible sidebar for menu options.

## Menu Sidebar
The `MenuSidebar` component provides additional navigation options and settings, including:
- A **theme toggle** switch.
- Navigation links for **Home** and **Logout**.
- Automatic closing when clicking outside.

## Behavior
- The sidebar is **only visible on desktop**.
- When opened, it **shrinks the main content area** to prevent overlap.
- Clicking outside the sidebar **automatically closes it**.

## Usage
Ensure `MenuSidebar` is included in `MainLayout.tsx` and controlled via `isMenuOpen`:
```tsx
<MenuSidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
```

## Testing
- Ensure the sidebar **opens and closes correctly**.
- Verify the **theme toggle switch updates state**.
- Check that **clicking outside closes the sidebar**.
