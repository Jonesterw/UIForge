/* embed-controller.js
   Purpose: Provide a small helper that automatically embeds demos into card demo areas
   and starts/stops them on hover.

   Usage (example):
   - Call `attachEmbedController(container)` where `container` contains card elements.
   - Each card should have data attributes matching effect ids (e.g., data-effect="parallax-cards").

   Behavior:
   - On mouseenter: inject necessary HTML/CSS/JS scaffold (if not already), then call the related
     start/mount function exported by the demo (e.g., window.initParallax(), window.createTriangle(canvas).start(), window.mountPulse).
   - On mouseleave: call stop/unmount/destroy where available.

   Note: This is a helper for inline-embedding demos (not cross-origin iframes). For file:// usage
   loading scripts from disk might be blocked by some browsers. Use a simple static server if needed.
*/

(function(global){
  /* =========================== */
  /*      UTILITY FUNCTIONS      */
  /* =========================== */
  // Helper to load a script or stylesheet only once
  function loadScriptOnce(src){
    return new Promise((resolve, reject) =>{
      if(document.querySelector(`script[data-src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = false; // keep order
      s.setAttribute('data-src', src);
      s.onload = ()=> resolve();
      s.onerror = (e)=> reject(e);
      document.head.appendChild(s);
    });
  }

  function loadStyleOnce(href){
    if(document.querySelector(`link[data-href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.setAttribute('data-href', href);
    document.head.appendChild(l);
  }

  /* =========================== */
  /*       EFFECT REGISTRY       */
  /* =========================== */
  const registry = {
    'parallax-cards': {
      ensure(){ return loadScriptOnce('effects/parallax-cards/script.js'); },
      start(container){
        if(typeof global.initParallax === 'function'){
          const destroy = global.initParallax(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container){ if(container._effectDestroy){ container._effectDestroy(); container._effectDestroy = null; } }
    },
    'webgl-rotating-triangle': {
      ensure(){ loadStyleOnce('effects/webgl-rotating-triangle/style.css'); return loadScriptOnce('effects/webgl-rotating-triangle/script.js'); },
      start(container){
        const canvas = container.querySelector('#glcanvas');
        if(canvas && typeof global.createTriangle === 'function'){
          const controller = global.createTriangle(canvas);
          container._effectController = controller;
          if(controller && typeof controller.start === 'function') controller.start();
        }
      },
      stop(container){ const c = container._effectController; if(c && typeof c.stop === 'function'){ c.stop(); container._effectController = null; } }
    },
    'react-pulse-button': {
      ensure(){ loadStyleOnce('effects/react-pulse-button/style.css'); return loadScriptOnce('effects/react-pulse-button/PulseButton.jsx'); },
      start(container){ const root = container.querySelector('#react-root'); if(root && typeof global.mountPulse === 'function'){ const unmount = global.mountPulse(root); container._reactUnmount = unmount || null; } },
      stop(container){ if(container._reactUnmount){ container._reactUnmount(); container._reactUnmount = null; } }
    },
    'vue-flip-card': {
      ensure(){ loadStyleOnce('effects/vue-flip-card/style.css'); return loadScriptOnce('effects/vue-flip-card/flipcard.js'); },
      start(container){ const root = container.querySelector('#vue-root'); if(root && typeof global.mountFlip === 'function'){ const instance = global.mountFlip(root); container._vueInstance = instance || null; } },
      stop(container){ if(container._vueInstance && typeof container._vueInstance.unmount === 'function'){ container._vueInstance.unmount(); container._vueInstance = null; } }
    },
    'liquid-gradient-wave': {
      ensure(){ loadStyleOnce('effects/liquid-gradient-wave/style.css'); return Promise.resolve(); },
      start(container){ /* CSS handles hover */ },
      stop(container){ /* noop */ }
    },
    'radiant-hover-cards': {
      ensure(){ loadStyleOnce('effects/radiant-hover-cards/style.css'); return Promise.resolve(); },
      start(container){ /* CSS-only effect lives in styles */ },
      stop(container){}
    },
    'cursor-particle-trail': {
      ensure(){
        loadStyleOnce('effects/js/cursor-particle-trail/style.css');
        return loadScriptOnce('effects/js/cursor-particle-trail/script.js');
      },
      start(container){
        if (typeof global.initParticleTrail === 'function') {
          const destroy = global.initParticleTrail(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container){ if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; } }
    }
    ,
    'magnetic-hover-effect': {
      ensure(){ return Promise.resolve(); },
      start(container){
        if (typeof window.initMagneticHoverEffect === 'function') {
          const destroy = window.initMagneticHoverEffect(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container){ if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; } }
    },
    'confetti-burst-effect': {
      ensure(){ return Promise.resolve(); },
      start(container){
        if (typeof window.initConfettiBurstEffect === 'function') {
          const destroy = window.initConfettiBurstEffect(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container){ if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; } }
    },
    'typewriter-text-effect': {
      ensure(){ return Promise.resolve(); },
      start(container){
        if (typeof window.initTypewriterTextEffect === 'function') {
          const destroy = window.initTypewriterTextEffect(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container){ if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; } }
    },
    'expanding-search-bar': {
      ensure(){ return Promise.resolve(); },
      start(container) {
        // When the mouse enters the card, cancel any pending timer that was set to close the search bar.
        clearTimeout(container._searchCloseTimer);

        // If the effect isn't already running, initialize it.
        if (typeof window.initExpandingSearchBar === 'function' && !container._effectDestroy) {
          const destroy = window.initExpandingSearchBar(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container) {
        const searchBox = container.querySelector('.search-box');
        // If the search box is open when the mouse leaves the card, start a timer.
        if (searchBox && searchBox.classList.contains('active')) {
          clearTimeout(container._searchCloseTimer); // Clear any old timer.
          container._searchCloseTimer = setTimeout(() => {
            // After the delay, close the box and run the real cleanup.
            searchBox.classList.remove('active');
            if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; }
          }, 750);
        } else {
          // If the search box is already closed, clean up immediately.
          if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; }
        }
      }
    },
    'like-dislike-widget': {
      ensure(){ return Promise.resolve(); },
      start(container){
        if (typeof window.initLikeDislikeWidget === 'function') {
          const destroy = window.initLikeDislikeWidget(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container){ if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; } }
    },
    'glitch-text-effect': {
      ensure(){ return Promise.resolve(); },
      start(container){
        if (typeof window.initGlitchText === 'function') {
          const destroy = window.initGlitchText(container);
          container._effectDestroy = destroy || null;
        }
      },
      stop(container){ if (container._effectDestroy) { container._effectDestroy(); container._effectDestroy = null; } }
    }
  };

  /* =========================== */
  /*    MAIN CONTROLLER LOGIC    */
  /* =========================== */
  let effectsMap = null;

  function attachEmbedController(root){
    // On first run, build a Map from the global effects array for fast lookups.
    if (!effectsMap && global.allEffects) {
      effectsMap = new Map(global.allEffects.map(e => [e.id, e]));
    }
    if (!effectsMap) {
      console.error("Embed controller could not find window.allEffects. Make sure script.js exposes it.");
      return;
    }

    root = root || document;
    const cards = root.querySelectorAll('[data-effect]');

    cards.forEach(card => {
      const id = card.getAttribute('data-effect');
      const container = card.querySelector('.card-preview');
      if (!container) return;

      const effectData = effectsMap.get(id);
      const controller = registry[id]; // Specific JS controller, if any

      async function onEnter(){
        // Add a class to the preview container to trigger CSS-based hover animations.
        container.classList.add('active-preview');

        // If a JS controller is defined and it's already running (has a cleanup property attached), do nothing.
        if (controller && (container._effectDestroy || container._effectController || container._reactUnmount || container._vueInstance)) {
          return;
        }

        // Start the JS via its specific controller, if one exists.
        if (controller) {
          try {
            if (typeof controller.ensure === 'function') await controller.ensure();
            if (typeof controller.start === 'function') controller.start(container);
          } catch(e) { console.error(`Error starting effect "${id}":`, e); }
        }
      }

      function onLeave(e){
        // If this is a focusout event and focus is moving to another element
        // within the same card, we don't want to tear down the effect.
        // This is crucial for components with internal focusable elements, like an input field.
        if (e.type === 'focusout' && e.relatedTarget && card.contains(e.relatedTarget)) {
          return;
        }

        // Remove the active class to pause CSS animations.
        container.classList.remove('active-preview');

        // 1. Stop the JS controller to clean up listeners.
        if (controller && typeof controller.stop === 'function') {
          try { controller.stop(container); } catch(e) { console.error(`Error stopping effect "${id}":`, e); }
        }
        // Do not clear the innerHTML, so the "paused" state remains visible.
      }

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('focusin', onEnter);
      card.addEventListener('focusout', onLeave);

      card._embedControllerHandlers = { onEnter, onLeave };
    });
  }

  global.attachEmbedController = attachEmbedController;
})(window);