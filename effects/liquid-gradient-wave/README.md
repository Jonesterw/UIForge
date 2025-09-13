Liquid Gradient Wave

- Type: CSS-only
- Files: `index.html`, `style.css`
- Behavior: A layered colorful gradient that slowly drifts to create a 'liquid' look. Animations are paused by default and only run when the user hovers or keyboard-focuses the `.panel` element. This makes the effect accessible and prevents CPU usage until the user interacts.

How it works (beginner-friendly):
- Two pseudo-elements (`::before` and `::after`) sit behind the panel content and have large blurred gradients.
- The `background-position` of these gradients is animated with `@keyframes wave`.
- `animation-play-state: paused` keeps the animation still. We switch it to `running` when the panel is hovered or focused using the `:hover` and `:focus-visible` selectors.

Accessibility:
- The `.panel` is `tabindex="0"` so keyboard users can focus it and trigger the animation via `:focus-visible`.

Try:
- Open `index.html` and hover the panel or press Tab to focus it and see the animation run.
