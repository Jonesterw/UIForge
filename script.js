// Basic script to render cards from effects.json, handle search, filters, toggles and copy

/* =========================== */
/*        GLOBAL STATE         */
/* =========================== */
let allEffects = [];
let currentFilters = {
  search: '',
  tag: 'all'
};
/* =========================== */
/*        DATA FETCHING        */
/* =========================== */
async function fetchEffects(){
  try{
    const res = await fetch('effects.json');
    if(!res.ok) throw new Error('failed to fetch effects');
    return await res.json();
  }catch(e){console.error(e);return []}
}

/* =========================== */
/*      UTILITY FUNCTIONS      */
/* =========================== */
function createCard(effect){
  const tpl = document.getElementById('card-template');
  const node = tpl.content.cloneNode(true);
  const cardRoot = node.querySelector('.effect-card');
  cardRoot.dataset.effect = effect.id;
  if (effect.layout) {
    cardRoot.classList.add(...effect.layout.split(' '));
  }

  const preview = node.querySelector('.card-preview');
  const fullCode = (effect.html || '') + `<style>${effect.css || ''}</style>`;
  preview.innerHTML = fullCode;

  // --- 2. Set up code view toggling ---
  const codeDisplay = node.querySelector('.code-display');
  const codeBlock = node.querySelector('.code-block');
  const copyBtn = node.querySelector('.copy-code');
  const langButtons = node.querySelectorAll('[data-lang]');
  const actionsContainer = node.querySelector('.card-actions');
  let currentLang = null;
  let hideTimer = null;

  function showCode(lang) {
    clearTimeout(hideTimer); // Always cancel hide timer when showing
    currentLang = lang;
    codeBlock.textContent = effect[lang] || `// No ${lang.toUpperCase()} code provided for this effect.`;

    // Make the popover visible so we can measure it
    codeDisplay.classList.add('visible');
    cardRoot.classList.add('is-active-popover');

    // Defer the position check to the next frame to ensure layout is calculated
    requestAnimationFrame(() => {
      // Reset alignment before checking
      codeDisplay.classList.remove('align-right');

      const popoverRect = codeDisplay.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const buffer = 16; // A small buffer from the edge

      // If the popover (in its default left-aligned position) overflows the right edge...
      if (popoverRect.right > (viewportWidth - buffer)) {
        // ...flip its alignment to the right side of the button container.
        codeDisplay.classList.add('align-right');
      }
    });
  }

  function hideCode() {
    currentLang = null;
    codeDisplay.classList.remove('visible');
    cardRoot.classList.remove('is-active-popover');
    codeDisplay.classList.remove('align-right'); // Ensure reset on hide
  }

  function startHideTimer() {
    hideTimer = setTimeout(hideCode, 300); // Delay to allow moving to the popover
  }

  langButtons.forEach(btn => {
    const lang = btn.dataset.lang;
    if (!effect[lang]) {
      btn.disabled = true;
    } else {
      btn.addEventListener('mouseenter', () => showCode(lang));
      btn.addEventListener('mouseleave', startHideTimer);
    }
  });

  // If the user's mouse enters the popover, cancel the timer so it stays open.
  codeDisplay.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  // If the mouse leaves the popover, start the timer to hide it.
  codeDisplay.addEventListener('mouseleave', startHideTimer);


  // --- 3. Set up copy button ---
  copyBtn.addEventListener('click', () => {
    if (!currentLang) return;
    const codeToCopy = effect[currentLang] || '';
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy Code'; }, 2000);
      });
    }
  });

  return node;
}

/* =========================== */
/*  FILTER & RENDER FUNCTIONS  */
/* =========================== */
function renderGallery(effectsToRender) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  if (effectsToRender.length === 0) {
    gallery.innerHTML = `
      <div class="no-results">
        <h4>No Matches Found</h4>
        <p>Try a different search term or filter.</p>
      </div>
    `;
    return;
  }

  effectsToRender.forEach(e => gallery.appendChild(createCard(e)));

  // Attach the embed controller to the newly rendered cards
  if (window.attachEmbedController) {
    window.attachEmbedController(gallery);
  }
}

function applyFilters() {
  let filtered = allEffects;
  const searchTerm = currentFilters.search.toLowerCase().trim();

  // 1. Filter by search term (title or tags)
  if (searchTerm) {
    filtered = filtered.filter(effect =>
      effect.title.toLowerCase().includes(searchTerm) ||
      (effect.tags && effect.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }

  // 2. Filter by active tag
  if (currentFilters.tag !== 'all') {
    filtered = filtered.filter(effect =>
      effect.tags && effect.tags.includes(currentFilters.tag)
    );
  }

  renderGallery(filtered);
}

function renderFilterButtons() {
  const filtersContainer = document.getElementById('filters-container');
  if (!filtersContainer) return;

  // 1. Collect all unique tags
  const tags = new Set(['all']);
  allEffects.forEach(effect => {
    if (effect.tags) {
      effect.tags.forEach(tag => tags.add(tag));
    }
  });
  
  const sortedTags = [...tags].sort();
  const midPoint = Math.ceil(sortedTags.length / 2);
  const firstRowTags = sortedTags.slice(0, midPoint);
  const secondRowTags = sortedTags.slice(midPoint);

  filtersContainer.innerHTML = '';

  // Function to create a marquee row
  function createMarqueeRow(tagList) {
    if (tagList.length === 0) return null;

    const row = document.createElement('div');
    row.className = 'filters-row';

    const track = document.createElement('div');
    track.className = 'filters-track';

    tagList.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = tag;
      btn.textContent = tag;
      if (tag === currentFilters.tag) btn.classList.add('active');
      track.appendChild(btn);
    });

    // Add the track twice for a seamless marquee effect
    row.appendChild(track);
    row.appendChild(track.cloneNode(true));
    
    return row;
  }

  const firstRow = createMarqueeRow(firstRowTags);
  const secondRow = createMarqueeRow(secondRowTags);

  if (firstRow) filtersContainer.appendChild(firstRow);
  if (secondRow) filtersContainer.appendChild(secondRow);
}

/* =========================== */
/*   INITIALIZATION FUNCTION   */
/* =========================== */
async function init(){
  allEffects = await fetchEffects();

  // Shuffle the array for a random layout on each load
  for (let i = allEffects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allEffects[i], allEffects[j]] = [allEffects[j], allEffects[i]];
  }

  window.allEffects = allEffects; // Expose for embed-controller
  const searchInput = document.getElementById('search-input');
  const filtersContainer = document.getElementById('filters-container');

  // Initial render
  renderFilterButtons();
  renderGallery(allEffects);

  // Setup search listener
  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value;
    applyFilters();
  });

  // Setup filter button listener using event delegation
  if (filtersContainer) {
    filtersContainer.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn')) {
        const tag = e.target.dataset.filter;
        if (currentFilters.tag === tag) return; // No change

        // Update active state on all buttons (original and clone)
        filtersContainer.querySelectorAll('.filter-btn.active').forEach(activeBtn => {
          activeBtn.classList.remove('active');
        });
        filtersContainer.querySelectorAll(`.filter-btn[data-filter='${tag}']`).forEach(clickedBtn => {
          clickedBtn.classList.add('active');
        });

        currentFilters.tag = tag;
        applyFilters();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', init);