# Contributing to Web Art Museum 

Welcome! This project is all about **sharing, learning, and inspiring**. It's designed to be **open, flexible, and educational**. Whether you’re a beginner, junior developer, or experienced coder, your contributions help make this museum **fun and valuable for everyone**.

---

## How You Can Contribute

There are a few main ways to contribute:

1.  **Adding New Effects**: This is the most common way to contribute.
2.  **Improving the Site**: You are encouraged to change the site structure if you think it improves the layout or user experience.
3.  **Improving Documentation**: Helping us keep our guides clear and helpful.

### 1. Adding a New Effect

Here’s the step-by-step process for adding your own creative effect to the gallery:

1.  **Fork the Repository**
    - Click the **Fork** button on GitHub to create your own copy of the project.

2.  **Create Your Effect**
    - **For simple, self-contained effects** (HTML/CSS in one block), you can add them directly to `effects.json`.
    - **For more complex effects**, create a new folder for your effect under the correct category in `/effects/` (e.g., `/effects/css/my-cool-effect/`). Your folder should contain an `index.html` and any other necessary files (`style.css`, `script.js`).

3.  **Update `effects.json`**
    - Add a new JSON object for your effect. Make sure it has a unique `id` and fill in the other details.

      ```json
      {
        "id": "my-cool-effect",
        "title": "My Cool Effect",
        "category": "css",
        "description": "A glowing hover animation example.",
        "author": "Your Name",
        "link": "#",
        "tags": ["hover", "animation", "glow"],
        "explanation": "This effect changes the background color on hover...",
        "html": "<div class=\"my-effect\">Hover Me</div>",
        "css": ".my-effect { background: blue; }",
        "js": "// Optional: only if your effect needs it.",
        "ts": "// Optional: for TypeScript source.",
        "scss": "// Optional: for SCSS source."
      }
      ```

4.  **Submit a Pull Request (PR)**
    - Double-check your code, comments, and the `effects.json` entry.
    - Push your changes to your fork and then open a Pull Request.
    - A maintainer will review your contribution.

### 2. Improving the Site Structure

This project is about experimenting together! Feel free to get creative with the structure. You are encouraged to **change the site structure** if you think it improves the layout or user experience.

Examples include:
- Rearranging folders for better organization.
- Changing the gallery layout in `styles.css`.
- Adding new categories for effects.
- Proposing new interactive sections for the site.

If you make structural changes, please describe them in your Pull Request and make sure any moved or renamed effects are updated correctly in `effects.json`.

### 3. Guidelines & Best Practices

To keep the gallery consistent, educational, and performant, please follow these guidelines:

-   **Comment Your Code**: Make it easy for others to learn from your effect. Explain *what* your code does and *why*.
-   **Idle Until Hover**: For performance, animations and JavaScript should only run when the user hovers over or focuses on the effect.
-   **Keep it Readable**: Use vanilla HTML/CSS/JS where possible. If you use a library, please include a CDN link.
-   **Self-Contained Effects**: All files for a complex effect should be in its own folder. Simple effects can live entirely in `effects.json`.
-   **Test Everything**: Make sure your effect works correctly on its own and within the main gallery.
-   **Accessibility Matters**: Where appropriate, use `tabindex="0"` and `:focus-visible` so keyboard users can interact with your effect.
-   **Use Accurate Tags**: Good tags help others discover your work.

---

##  Community Spirit

- Be supportive and respectful of other contributors.
- Share tips, ask questions, and collaborate.
- The goal is to **learn and grow together**.

```


```

-## Goals
+## Collaboration & Pull Requests
+
+We welcome contributions via GitHub Pull Requests (PRs). The typical workflow is:
+1.  **Fork** the repository to your own GitHub account.
+2.  Create a new **branch** for your changes.
+3.  Add your new effect or make your improvements.
+4.  **Test** your changes locally to ensure nothing is broken.
+5.  **Commit** your changes with a clear message and push them to your fork.
+6.  Submit a **Pull Request** to the main repository. The PR template in `.github/pull_request_template.md` will guide you.
+
+A maintainer will review your PR, provide feedback if necessary, and merge it once it's ready.
+
+## Tips for Contributors
+
+-   **Check `effects.json` Carefully:** A single missing comma or quote can prevent the gallery from loading.
+-   **Prioritize Performance:** For JS-heavy effects, use the `embed-controller.js` pattern to ensure animations only run on hover/focus.
+-   **Keep Effects Self-Contained:** An effect should not depend on styles or scripts from another effect.
+-   **Test Before You Push:** Always open `index.html` locally and check the browser's console for errors after making changes.
+
+## Project Goals

-   Inspire developers with a diverse gallery of effects and layouts.
-   Help juniors and beginners learn from real, commented code.
-   Encourage a collaborative, friendly community of web developers.
-   Show the artistic side of front-end development.

## License

This project is licensed under the MIT License.

The MIT License allows anyone to view, learn from, copy, and contribute freely. This ensures the project remains educational and collaborative, while giving proper credit to contributors.

## Links

-   **GitHub Repo** – Contribute on GitHub!


