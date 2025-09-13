import React from 'react';
import { createRoot } from 'react-dom/client';

function Pulse(){
  return (
    React.createElement('div',{style:{display:'flex',gap:12,flexDirection:'column',alignItems:'center'}},
      React.createElement('button',{className:'pulse-btn'},'Pulse'),
      React.createElement('div',{className:'pulse'})
    )
  )
}

// Auto-mount for simple demo; it is lightweight and harmless.
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(Pulse));

export default Pulse;
