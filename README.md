# Web Art Museum 

A community-driven gallery of creative web effects, layouts, and interactive experiments — designed for learning, inspiration, reference and collaboration.

Whether you’re a junior developer, a curious beginner, or someone who loves to experiment with web design, this is a place to share, explore, and learn from each other. Think of this project as a museum, library, and playground all in one.

## Why This Project Exists

This project was started by a junior developer building front-end skills, who wanted a space where:

-   People can showcase effects, layouts, UIs, or UX concepts.
-   Contributors explain their code with comments so others can understand.
-   Everyone can collaborate, learn, and make friends in the web dev community.
-   A reference place for ui components.

## How the Gallery Works: An In-Depth Look

Understanding the project's architecture is key to contributing effectively. Here’s a breakdown of how the gallery comes to life:

### End-to-End Flow

1.  **Load:** The browser loads `index.html`, which defines the basic page structure (header, footer, and an empty gallery container).
2.  **Execute Scripts:** `script.js` and `embed-controller.js` run.
3.  **Fetch Data:** `script.js` fetches the list of all effects from `effects.json`.
4.  **Render Cards:** For each effect in the JSON data, `script.js` clones the `<template id="card-template">`, fills it with metadata (title, description, tags), and injects the effect's `html` and `css` into the preview area. This displays a static "first frame" of each effect.
5.  **Attach Controllers:** `embed-controller.js` attaches listeners to each card to manage its interactive state.
6.  **Explore and Learn:** The gallery is now live. When a user hovers over a card, `embed-controller.js` activates the preview:
    *   **CSS animations** are un-paused (`animation-play-state: running`).
    *   **JavaScript animations** are started.
    *   On mouse leave, animations are paused or stopped to save resources.
    *   Users can view and copy the source code using the `HTML`, `CSS`, and `JS` buttons.

### Core Architectural Files

-   **`index.html`**: The skeleton of the site. Its most important feature is the `<template id="card-template">`, an invisible blueprint that `script.js` uses to efficiently create each card in the gallery.
-   **`effects.json`**: The project's "database." It's an array of objects, where each object defines a card. It holds all the metadata (title, description) and the source code (`html`, `css`, `js`, etc.) for each effect.
-   **`script.js`**: The "brain" of the gallery. It reads `effects.json`, dynamically builds all the cards, and handles user interactions like search, filtering, toggling code views, and copying to the clipboard.
-   **`styles.css`**: The "skin" of the gallery. It defines the entire look and feel, including the dark theme (using CSS variables for easy customization), the responsive grid layout, and the styling for every part of the cards.
-   **`embed-controller.js`**: A smart helper script that manages the lifecycle of all previews. It ensures that animations only run when a user is actively interacting with a card. For CSS effects, it toggles a class to play/pause animations. For JavaScript effects, it starts and stops the scripts on hover/leave, keeping the main page fast and responsive.

## How to Contribute

This project is meant to be a **learning playground**. You are not just adding effects — you are welcome to **experiment with layouts, gallery structure, and UI/UX ideas**. This is a collaborative space where your creativity is encouraged!

For detailed instructions and best practices, please read our **[CONTRIBUTING.md](CONTRIBUTING.md)** guide.

## Project Structure

The project is organized to keep the core gallery logic separate from the individual effects, making it modular and easy to maintain.

```
/effects
   /css          → CSS-only effects (hover, animations, transitions)
   /js           → JavaScript-based interactions
   /webgl        → WebGL demos, shaders, 3D graphics
   /react        → React components/examples
   /vue          → Vue components/examples
   /experimental → Experimental effects (scroll-jacking, generative art, etc.)
/assets         → Images, icons, and shared resources
index.html      → Main gallery page
styles.css      → Global styles (layout, theme, animations)
script.js       → Renders cards, handles filtering/search
effects.json    → Data for all effects in the gallery
CONTRIBUTING.md → Contribution guidelines
README.md
```

## Goals

-   Inspire developers with a diverse gallery of effects and layouts.
-   Encourage a collaborative, friendly community of web developers.
-   Show the artistic side of front-end development.

## License

This project is licensed under the MIT License.

The MIT License allows anyone to view, learn from, copy, and contribute freely. This ensures the project remains educational and collaborative, while giving proper credit to contributors.

## Links

-   **GitHub Repo**: [Jonesterw/WebArt-Gallery](https://github.com/Jonesterw/WebArt-Gallery)
-   **Live Demo**: [Web Art Museum](https://jonesterw.github.io/WebArt-Museum/) 
