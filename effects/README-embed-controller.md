Gallery iframe preview behavior

- The gallery injects a small `iframe` into each card's `.card-preview` area.
- To avoid heavy CPU usage and keep the page responsive, the iframe's `src` is assigned only when the user hovers or keyboard-focuses the preview. When the user leaves, the iframe is unloaded (set to `about:blank`).
- This keeps the main gallery static while letting users preview effects inline. If you prefer the live demo to stay running after hover, remove the `pointerleave`/`focusout` unload listeners in `script.js`.

Note: Some browsers restrict autoplay or cross-origin resources when opening files locally; serve the folder with a local server (e.g., VS Code Live Server) for the best experience.
