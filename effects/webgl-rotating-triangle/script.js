// Minimal WebGL rotating colored triangle that only animates while hovered
(function(){
  const canvas = document.getElementById('glcanvas');
  if(!canvas) return;
  const gl = canvas.getContext('webgl');
  if(!gl) return;
  // simple shaders
  const vs = `attribute vec2 aPos; attribute vec3 aColor; varying vec3 vColor; uniform float uRot; void main(){ float c = cos(uRot); float s = sin(uRot); vec2 pos = vec2(aPos.x * c - aPos.y * s, aPos.x * s + aPos.y * c); gl_Position = vec4(pos, 0.0, 1.0); vColor = aColor; }`;
  const fs = `precision mediump float; varying vec3 vColor; void main(){ gl_FragColor = vec4(vColor,1.0); }`;
  function compile(src,type){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) {console.error(gl.getShaderInfoLog(s)); return null} return s }
  const p = gl.createProgram(); const sv=compile(vs,gl.VERTEX_SHADER); const sf=compile(fs,gl.FRAGMENT_SHADER); gl.attachShader(p,sv); gl.attachShader(p,sf); gl.linkProgram(p); gl.useProgram(p);
  const verts = new Float32Array([ 0,0.6, 1,0,0,  -0.55,-0.3, 0,1,0,  0.55,-0.3, 0,0,1 ]);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(p,'aPos'); const aColor = gl.getAttribLocation(p,'aColor');
  gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,5*4,0);
  gl.enableVertexAttribArray(aColor); gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,5*4,2*4);
  const uRot = gl.getUniformLocation(p,'uRot');
  let raf=0; let angle=0; function render(){ gl.viewport(0,0,canvas.width,canvas.height); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uRot, angle); gl.drawArrays(gl.TRIANGLES,0,3); angle += 0.02; raf = requestAnimationFrame(render) }
  function start(){ if(!raf) render() }
  function stop(){ if(raf){ cancelAnimationFrame(raf); raf=0 } }
  canvas.addEventListener('pointerenter', start); canvas.addEventListener('pointerleave', stop);
})();
