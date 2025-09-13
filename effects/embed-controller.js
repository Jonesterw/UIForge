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
      if(document.querySelector(`script[data-src=\"${src}\"]`)) return resolve();
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
    if(document.querySelector(`link[data-href=\"${href}\"]`)) return;
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
    }
  };

  /* =========================== */
  /*    MAIN CONTROLLER LOGIC    */
  /* =========================== */
  function attachEmbedController(root){
    // root: element that contains cards; each card should have attribute data-effect with effect id
    root = root || document;
    const cards = root.querySelectorAll('[data-effect]');

    cards.forEach(card => {
      const id = card.getAttribute('data-effect');
      if(!registry[id]) return;
      let mounted = false;
      const container = card.querySelector('.demo') || card; // `.demo` area optional

      async function onEnter(){
        if(mounted) return; // avoid double-mount
        mounted = true;
        try{
          if(registry[id] && typeof registry[id].ensure === 'function') await registry[id].ensure();
          if(registry[id] && typeof registry[id].start === 'function') registry[id].start(container);
        }catch(e){ console.error('start error', e); }
      }

      function onLeave(){
        if(!mounted) return;
        mounted = false;
        try{ if(registry[id] && typeof registry[id].stop === 'function') registry[id].stop(container); }catch(e){ console.error('stop error', e); }
      }

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('focus', onEnter);
      card.addEventListener('blur', onLeave);

      // store handlers to allow detach if needed
      card._embedControllerHandlers = { onEnter, onLeave };
    });
  }

  global.attachEmbedController = attachEmbedController;
})(window);
