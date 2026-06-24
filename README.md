# @skrull-labs/ui

A highly reusable, performant React component library built by Skrull Labs. Currently features specialized components for data visualization and complex table rendering.

## Installation

Install the library using your preferred package manager:

```bash
npm install @skrull-labs/ui
# or
yarn add @skrull-labs/ui
# or
pnpm add @skrull-labs/ui
```

### Peer Dependencies

This library requires a few peer dependencies to function correctly. Make sure you have them installed in your project:

```bash
npm install react react-dom @tanstack/react-virtual lucide-react xlsx-js-style
```

- `react` (v18 or v19)
- `react-dom` (v18 or v19)
- `@tanstack/react-virtual` (for high-performance virtualized tables)
- `lucide-react` (for icons)
- `xlsx-js-style` (for Excel export functionality in tables)

## Usage

To use the components, you first need to import the CSS styles into your application's root component or entry point (e.g., `main.tsx`, `App.tsx`, or `_app.tsx`):

```tsx
// Import the core CSS
import '@skrull-labs/ui/styles.css';
```

Then, you can import and use any of the provided components:

```tsx
import React from 'react';
import { Table, DeltaPill } from '@skrull-labs/ui';

function App() {
  const data = [
    { id: 1, name: 'Revenue', delta: 12.5 },
    { id: 2, name: 'Expenses', delta: -4.2 }
  ];

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name' },
    { 
      header: 'Change', 
      accessorKey: 'delta',
      cell: ({ row }) => <DeltaPill value={row.original.delta} />
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard overview</h1>
      <Table 
        data={data} 
        columns={columns} 
      />
    </div>
  );
}

export default App;
```

## Available Components

### `Table`
A robust data table component designed for performance and flexibility. It supports advanced features like:
- Excel export capabilities (via `xlsx-js-style`)
- Virtualization for handling large datasets smoothly
- Custom cell rendering
- Responsive design

### `DeltaPill`
A visual indicator component designed to represent positive, negative, or neutral changes (deltas). Commonly used inside table cells or dashboard statistic cards.

## License

[MIT](./LICENSE)
