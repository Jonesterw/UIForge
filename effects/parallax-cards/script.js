// Parallax Interactive Cards
// Activates on pointerenter / focus and deactivates on leave/blur
(function(){
  const root = document.querySelector('.cards');
  if(!root) return;
  let raf=0; let active=false;
  function onPointerMove(e){
    if(!active) return;
    const rect = root.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx)/rect.width;
    const dy = (e.clientY - cy)/rect.height;
    root.querySelectorAll('.card').forEach((card,i)=>{
      const tx = dx * (10 + i*4);
      const ty = dy * (10 + i*4);
      card.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${ -dy*6 }deg) rotateY(${ dx*6 }deg)`;
    });
  }
  function onEnter(){ active=true; root.querySelectorAll('.card').forEach(c=>c.classList.add('is-active')) }
  function onLeave(){ active=false; root.querySelectorAll('.card').forEach(c=>{c.classList.remove('is-active'); c.style.transform='none'}) }
  root.addEventListener('pointerenter', onEnter);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('focusin', onEnter);
  root.addEventListener('focusout', onLeave);
  root.addEventListener('pointermove', (e)=>{ if(raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(()=> onPointerMove(e)) });
})();
