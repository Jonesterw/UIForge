// Basic script to render cards from effects.json, handle search, filters, toggles and copy

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
function renderTags(container,tags){container.innerHTML='';tags.forEach(t=>{const el=document.createElement('span');el.className='tag';el.textContent=t;container.appendChild(el)})}

/* =========================== */
/*     CARD RENDERING LOGIC    */
/* =========================== */
function createCard(effect){
  const tpl = document.getElementById('card-template');
  const node = tpl.content.cloneNode(true);
  const cardRoot = node.querySelector('.effect-card');
  cardRoot.dataset.effect = effect.id;

  node.querySelector('.effect-title').textContent = effect.title;
  node.querySelector('.effect-desc').textContent = effect.description;
  renderTags(node.querySelector('.tags'), effect.tags || []);
  
  // --- 1. Render the live preview ---
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
  let hideTimer = null; // Timer to add a delay before hiding

  function showCode(lang) {
    // If a hide action is pending, cancel it
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    currentLang = lang;
    codeBlock.textContent = effect[lang] || '';
    codeDisplay.classList.add('visible');
  }

  function hideCode() {
    currentLang = null;
    codeDisplay.classList.remove('visible');
  }

  langButtons.forEach(btn => {
    const lang = btn.dataset.lang;
    if (!effect[lang]) {
      btn.disabled = true;
    } else {
      btn.addEventListener('mouseenter', () => {
        showCode(lang);
      });
    }
  });

  // When leaving the entire actions area, start a timer to hide the popover
  actionsContainer.addEventListener('mouseleave', () => {
    hideTimer = setTimeout(() => {
      hideCode();
    }, 300); // 300ms delay gives the user time to move to the popover
  });

  // If the user moves back into the actions area (including the popover), cancel the hide timer
  actionsContainer.addEventListener('mouseenter', () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  });


  // --- 3. Set up copy button ---
  copyBtn.addEventListener('click', () => {
    if (!currentLang) return;
    const codeToCopy = effect[currentLang] || '';
    if (codeToCopy) navigator.clipboard.writeText(codeToCopy).then(() => alert('Code copied to clipboard'));
  });

  return node;
}

/* =========================== */
/*   INITIALIZATION FUNCTION   */
/* =========================== */
async function init(){
  const effects = await fetchEffects();
  const gallery = document.getElementById('gallery');

  function renderGallery(){
    gallery.innerHTML='';
    effects.forEach(e => gallery.appendChild(createCard(e)));

    // Attach the embed controller to the newly rendered cards
    if (window.attachEmbedController) {
      window.attachEmbedController(gallery);
    }
  }

  renderGallery();
}

window.addEventListener('DOMContentLoaded', init);