# Toolbar Components

This directory contains componentized toolbar functionality for the slide editor.

## Structure

### Configuration (`../toolbar-options.ts`)

JSON-based configuration for toolbar options:

- `ELEMENT_CREATION_OPTIONS` - Element creation buttons (heading, text, list, image, shape)
- `ELEMENT_OPERATIONS` - Basic operations (duplicate, delete)
- `ELEMENT_ALIGNMENT_OPTIONS` - Element alignment options (left, center, right, top, middle, bottom)
- `TEXT_ALIGNMENT_OPTIONS` - Text alignment options (left, center, right)
- `FONT_SIZE_OPTIONS` - Available font sizes
- `PREDEFINED_COLORS` - Color palette
- `TEXT_ELEMENT_TYPES` - Elements that support text formatting

### Components

#### `ToolbarButtonGroup`

Reusable component that renders a group of toolbar buttons based on configuration.

**Props:**

- `options: ToolbarOption[]` - Array of button configurations
- `onAction: (action: string, option: ToolbarOption) => void` - Action handler
- `activeStates?: Record<string, boolean>` - Active button states
- `disabled?: boolean` - Disable all buttons

#### `ColorPicker`

Complex component for color selection with predefined colors and custom color input.

**Props:**

- `currentColor?: string` - Currently selected color
- `onColorChange: (color: string) => void` - Color change handler
- `disabled?: boolean` - Disable the picker

#### `FontSizePicker`

Component for font size selection from predefined options.

**Props:**

- `currentSize?: string` - Currently selected size
- `onSizeChange: (size: string) => void` - Size change handler
- `disabled?: boolean` - Disable the picker

## Usage

```tsx
import { ToolbarButtonGroup, ColorPicker, FontSizePicker } from './toolbar'
import { ELEMENT_CREATION_OPTIONS } from './toolbar-options'

// Simple button group
<ToolbarButtonGroup
  options={ELEMENT_CREATION_OPTIONS}
  onAction={handleAction}
/>

// Color picker
<ColorPicker
  currentColor="#000000"
  onColorChange={handleColorChange}
/>

// Font size picker
<FontSizePicker
  currentSize="24px"
  onSizeChange={handleFontSizeChange}
/>
```

## Benefits

1. **Maintainability** - Options are centralized in JSON configuration
2. **Reusability** - Components can be used across different toolbars
3. **Consistency** - Uniform styling and behavior
4. **Extensibility** - Easy to add new options or modify existing ones
5. **Type Safety** - Full TypeScript support with proper interfaces
