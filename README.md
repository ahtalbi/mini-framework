# Mini Framework

A lightweight, modular JavaScript framework for building modern web applications with reactive state management and client-side routing.

## Features

- **🎨 DOM Abstraction** - Simple and intuitive API for creating and rendering DOM elements
- **⚡ Reactivity System** - Fine-grained reactive state management with signals and effects
- **🧭 Client-Side Routing** - Built-in router for single-page application navigation
- **🧩 Component-Based** - Build UIs with reusable, composable components
- **📦 JSX Support** - Write declarative UI code with JSX syntax
- **🔧 Event Handling** - Flexible event delegation pattern for efficient event management

---

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
  - [Creating Elements](#creating-elements)
  - [Adding Attributes](#adding-attributes)
  - [Nesting Elements](#nesting-elements)
  - [Event Handling](#event-handling)
- [Reactivity](#reactivity)
  - [Signals](#signals)
  - [Effects](#effects)
- [Routing](#routing)
- [How It Works](#how-it-works)
- [Example Project](#example-project)
- [Development](#development)

---

## Installation

```bash
# Clone the repository
git clone https://learn.zone01oujda.ma/git/obenmbar/mini-framework.git

# Install dependencies
npm install
```

---

## Getting Started

Import the framework modules in your JavaScript files:

```javascript
import { createElement, render } from "./framework/dom.js";
import { createSignal, createEffect } from "./framework/reactivity.js";
import router from "./framework/mini-framework.js";
```

---

## Core Concepts

### Creating Elements

Use `createElement()` to create DOM elements programmatically:

```javascript
import { createElement, render } from "./framework/dom.js";

// Create a simple div element
const myDiv = createElement("div", null, "Hello World!");

// Render it to the DOM
render(myDiv, document.getElementById("root"));
```

You can also use JSX syntax (requires Babel configuration):

```jsx
const myDiv = <div>Hello World!</div>;
render(myDiv, document.getElementById("root"));
```

### Adding Attributes

Pass attributes as the second argument to `createElement()`:

```javascript
// Using createElement
const button = createElement(
  "button",
  { 
    id: "my-btn", 
    class: "primary-btn",
    "data-action": "submit"
  },
  "Click Me"
);

// Using JSX
const button = (
  <button id="my-btn" class="primary-btn" data-action="submit">
    Click Me
  </button>
);
```

### Nesting Elements

Pass child elements as additional arguments after the props:

```javascript
// Using createElement
const container = createElement(
  "div",
  { class: "container" },
  createElement("h1", null, "Title"),
  createElement("p", null, "Paragraph text"),
  createElement("button", { class: "btn" }, "Action")
);

// Using JSX (recommended for readability)
const container = (
  <div class="container">
    <h1>Title</h1>
    <p>Paragraph text</p>
    <button class="btn">Action</button>
  </div>
);
```

### Event Handling

The framework provides an event delegation utility for efficient event management:

```javascript
import { on } from "./examples/todo/src/logic/events.js";

// Set up delegated event listener
const root = document.getElementById("root");

// Listen for clicks on elements matching the selector
const unsubscribe = on(root, "click", ".delete-btn", (event, target) => {
  console.log("Delete button clicked:", target);
  // Handle delete logic
});

// Clean up when needed
unsubscribe();
```

You can also use standard event listeners:

```javascript
const button = createElement(
  "button",
  { 
    class: "btn",
    onclick: () => console.log("Clicked!")
  },
  "Click Me"
);
```

---

## Reactivity

The framework includes a fine-grained reactivity system inspired by Solid.js.

### Signals

Signals are reactive primitives that track and notify changes:

```javascript
import { createSignal } from "./framework/reactivity.js";

// Create a signal with initial value
const [count, setCount] = createSignal(0);

// Read the current value
console.log(count()); // 0

// Update the value
setCount(5);
console.log(count()); // 5
```

### Effects

Effects automatically re-run when their dependent signals change:

```javascript
import { createSignal, createEffect } from "./framework/reactivity.js";

const [name, setName] = createSignal("World");

// Effect will re-run whenever 'name' changes
createEffect(() => {
  console.log(`Hello, ${name()}!`);
});

setName("Developer"); // Logs: "Hello, Developer!"
```

---

## Routing

The built-in router enables client-side navigation for single-page applications:

```javascript
import router from "./framework/mini-framework.js";
import { render } from "./framework/dom.js";
import HomePage from "./pages/home.jsx";
import AboutPage from "./pages/about.jsx";

// Define routes
router
  .on("/", () => {
    render(<HomePage />, document.getElementById("root"));
  })
  .on("/about", () => {
    render(<AboutPage />, document.getElementById("root"));
  });

// Start the router
router.listen(() => {
  // 404 handler
  render(<div>Page not found</div>, document.getElementById("root"));
});

// Navigate programmatically
router.navigate("/about");
```

---

## How It Works

### DOM Module (`dom.js`)

The DOM module provides two core functions:

1. **`createElement(type, props, ...children)`** - Creates DOM elements either from strings (HTML tags) or component functions. It:
   - Handles component functions by calling them with props and children
   - Creates native DOM elements using `document.createElement()`
   - Sets attributes from the props object
   - Flattens and appends children (filtering out null/undefined/false values)

2. **`render(element, container)`** - Renders an element into a container by replacing all existing children.

### Reactivity Module (`reactivity.js`)

The reactivity system uses a dependency tracking mechanism:

1. **Signals** - Created with `createSignal(initialValue)`, returns a tuple `[read, write]`:
   - `read()` - Returns the current value and tracks the dependency if inside an effect
   - `write(newValue)` - Updates the value and triggers all dependent effects

2. **Effects** - Created with `createEffect(fn)`:
   - Executes the function and tracks which signals are accessed
   - Automatically re-executes when any tracked signal changes
   - Supports cleanup of previous effect runs

3. **Dependency Tracking** - Uses an effect stack and active effect pattern to automatically collect dependencies during effect execution.

### Router Module (`router.js`)

The router uses the Navigation API for modern client-side routing:

1. **`on(path, handler)`** - Registers a route handler (chainable)
2. **`navigate(path, options)`** - Programmatically navigate to a route
3. **`resolve(path)`** - Manually resolve a path to its handler
4. **`listen(onError404)`** - Starts listening for navigation events

---

## Example Project

Check out the [TodoMVC example](./examples/todo/) for a complete implementation:

```bash
# Build and run the example
npm run dev
```

The example demonstrates:
- Component-based architecture with JSX
- State management with signals
- Event handling with delegation
- Routing between pages

### Example Structure

```
examples/todo/
├── src/
│   ├── app.js           # Main entry point with router setup
│   ├── pages/
│   │   └── todo.jsx     # Todo page component
│   ├── components/
│   │   ├── header.jsx   # Header component
│   │   ├── footer.jsx   # Footer component
│   │   └── todo-item.jsx # Todo item component
│   └── logic/
│       ├── todo.js      # Todo state management
│       └── events.js    # Event delegation utility
└── assets/
    └── style.css        # TodoMVC styling
```

---

## Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

This command builds the project and serves the TodoMVC example.

---

## Project Structure

```
mini-framework/
├── framework/
│   ├── dom.js            # DOM creation and rendering
│   ├── reactivity.js     # Signals and effects system
│   ├── router.js         # Client-side routing
│   └── mini-framework.js # Main entry point (exports router)
├── examples/
│   └── todo/             # TodoMVC example application
├── package.json
├── webpack.config.js
└── README.md
```

---

## Team

- **Othmane Benmbarek**
- **Mohamed Nouri**
- **Ahmed Talbi**

---

## License

MIT
