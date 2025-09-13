// Basic script to render cards from effects.json, handle search, filters, toggles and copy

/* =========================== */
/*        DATA FETCHING        */
/* =========================== */
async function fetchEffects(){
  try{
    const res = await fetch('effects.json');
    if(!res.ok) throw new Error('Failed to load effects.json');
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
  let currentLang = null;

  function setCode(lang) {
    codeDisplay.hidden = false;
    currentLang = lang;
    codeBlock.textContent = effect[lang] || '';
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function hideCode() {
    codeDisplay.hidden = true;
    currentLang = null;
    langButtons.forEach(btn => btn.classList.remove('active'));
  }

  langButtons.forEach(btn => {
    const lang = btn.dataset.lang;
    if (!effect[lang]) {
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => {
        if (currentLang === lang) {
          hideCode();
        } else {
          setCode(lang);
        }
      });
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
