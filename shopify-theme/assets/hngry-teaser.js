/* HNGRY password-page teaser: liquid logo shader, countdown, sound, glitch.
   Vanilla port of the Next.js TeaserShader/Teaser components. */

(function () {
  var root = document.querySelector("[data-hngry-teaser]");
  if (!root) return;

  var canvas = root.querySelector("canvas");
  var fallbackImg = root.querySelector("[data-teaser-fallback]");
  var logoSrc = root.getAttribute("data-logo-src");

  /* ---------------------------------------------------------- countdown */
  var dropDate = new Date(root.getAttribute("data-drop-date"));
  var cells = {
    days: root.querySelector("[data-count-days]"),
    hrs: root.querySelector("[data-count-hrs]"),
    min: root.querySelector("[data-count-min]"),
    sec: root.querySelector("[data-count-sec]"),
  };
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function tick() {
    var ms = Math.max(0, dropDate.getTime() - Date.now());
    var s = Math.floor(ms / 1000);
    if (cells.days) cells.days.textContent = pad(Math.floor(s / 86400));
    if (cells.hrs) cells.hrs.textContent = pad(Math.floor((s % 86400) / 3600));
    if (cells.min) cells.min.textContent = pad(Math.floor((s % 3600) / 60));
    if (cells.sec) cells.sec.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* -------------------------------------------------------------- sound */
  var audio = root.querySelector("audio");
  var soundBtn = root.querySelector("[data-sound-toggle]");
  var soundOn = true;
  function tryPlay() {
    if (audio && soundOn && audio.paused) {
      audio.volume = 0.3;
      audio.play().catch(function () {});
    }
  }
  if (audio) {
    tryPlay();
    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("keydown", tryPlay);
  }
  if (soundBtn) {
    soundBtn.addEventListener("click", function () {
      soundOn = !soundOn;
      soundBtn.textContent = "SOUND " + (soundOn ? "ON" : "OFF");
      if (!audio) return;
      if (soundOn) tryPlay();
      else audio.pause();
    });
  }

  /* ------------------------------------------------- form: shake + flood */
  var form = root.querySelector("form");
  var unlocking = false;
  if (form) {
    form.addEventListener("submit", function () {
      unlocking = true; // optimistic ink flood while the form posts
      if (audio) audio.pause();
    });
  }

  /* -------------------------------------------------------------- shader */
  var VERT =
    "attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}";

  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;",
    "uniform float uForm;uniform float uGlitch;uniform float uUnlock;",
    "uniform sampler2D uLogo;",
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);",
    "return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=0.5;}return v;}",
    "float logoInk(vec2 s,float mask){vec4 tex=texture2D(uLogo,vec2(mix(0.06,0.94,s.x),mix(0.28,0.72,s.y)));",
    "return tex.a*(1.0-tex.r)*mask;}",
    "void main(){",
    "vec2 uv=gl_FragCoord.xy/uRes;",
    "float band=floor(gl_FragCoord.y/(uRes.y*0.022));",
    "uv.x+=(hash(vec2(band,floor(uTime*24.0)))-0.5)*0.09*uGlitch;",
    "float aspect=uRes.x/uRes.y;",
    "vec2 p=vec2(uv.x*aspect,uv.y);",
    "float t=uTime*0.05;",
    "vec3 black=vec3(0.05,0.05,0.048);",
    "vec3 bone=vec3(0.945,0.937,0.914);",
    "vec2 q=vec2(fbm(p*1.5+t*0.7),fbm(p*1.5-t*0.5+4.2));",
    "float smoke=fbm(p*2.0+q*1.8-vec2(0.0,t*0.6));",
    "vec3 col=black+bone*smoothstep(0.45,1.1,smoke)*0.085;",
    "vec2 m=vec2(uMouse.x*aspect,uMouse.y);",
    "float md=distance(p,m);",
    "float ripple=exp(-md*md*12.0);",
    "vec2 poke=(p-m)/max(md,0.001)*ripple*0.022*sin(uTime*2.4-md*30.0);",
    "float breathe=1.0+0.015*sin(uTime*0.45);",
    "float quadW=min(0.78*aspect,1.72)*breathe;",
    "float quadH=quadW*0.5;",
    "vec2 center=vec2(0.5*aspect,0.60);",
    "vec2 luv=(p-center)/vec2(quadW,quadH)+0.5;",
    "float amp=mix(0.42,0.05,uForm);",
    "vec2 warp=(vec2(fbm(luv*2.8+t+(1.0-uForm)*3.0),fbm(luv*2.8-t+7.3))-0.5)*amp+poke;",
    "vec2 s=luv+warp;",
    "vec2 edge=smoothstep(0.0,0.02,s)*smoothstep(0.0,0.02,1.0-s);",
    "float mask=edge.x*edge.y*smoothstep(0.05,0.9,uForm);",
    "float ink=logoInk(s,mask);",
    "float off=0.007*uGlitch;",
    "float inkR=logoInk(s+vec2(off,0.0),mask);",
    "float inkB=logoInk(s-vec2(off,0.0),mask);",
    "col=mix(col,bone,ink*0.97);",
    "col.r+=(inkR-ink)*0.85;",
    "col.b+=(inkB-ink)*0.85;",
    "col*=1.0-0.5*pow(length(uv-vec2(0.5,0.55)),1.9);",
    "float floodR=uUnlock*uUnlock*2.8;",
    "float flood=1.0-smoothstep(floodR-0.45,floodR,distance(p,center)+fbm(p*3.5+t*3.0)*0.35);",
    "col=mix(col,bone,clamp(flood,0.0,1.0));",
    "col+=(hash(gl_FragCoord.xy+fract(uTime)*61.0)-0.5)*0.06;",
    "gl_FragColor=vec4(col,1.0);",
    "}",
  ].join("\n");

  function showFallback() {
    if (canvas) canvas.style.display = "none";
    if (fallbackImg) fallbackImg.style.display = "block";
  }

  if (!canvas) return;
  var gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl || gl.isContextLost()) {
    showFallback();
    return;
  }

  function compile(type, src) {
    var shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  }

  var vert = compile(gl.VERTEX_SHADER, VERT);
  var frag = compile(gl.FRAGMENT_SHADER, FRAG);
  var program = gl.createProgram();
  if (!vert || !frag || !program) {
    showFallback();
    return;
  }
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.useProgram(program);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var u = {
    res: gl.getUniformLocation(program, "uRes"),
    time: gl.getUniformLocation(program, "uTime"),
    mouse: gl.getUniformLocation(program, "uMouse"),
    form: gl.getUniformLocation(program, "uForm"),
    glitch: gl.getUniformLocation(program, "uGlitch"),
    unlock: gl.getUniformLocation(program, "uUnlock"),
  };

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.round(canvas.clientWidth * dpr);
    var h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener(
    "pointermove",
    function (e) {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    },
    { passive: true }
  );

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var glitch = 0;
  var unlock = 0;
  var last = performance.now();
  var nextGlitch = last + 3000 + Math.random() * 4000;
  var start = last;
  var glitchEls = root.querySelectorAll("[data-glitch-target]");

  function domGlitch() {
    glitchEls.forEach(function (el) {
      el.classList.remove("hngry-dom-glitch");
      void el.offsetWidth; // restart animation
      el.classList.add("hngry-dom-glitch");
    });
  }

  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    resize();

    var elapsed = (now - start) / 1000;
    var f = Math.min(1, elapsed / 3.2);
    var form01 = f * f * (3 - 2 * f);

    if (now > nextGlitch && form01 >= 1) {
      glitch = 1;
      nextGlitch = now + 3500 + Math.random() * 4500;
      domGlitch();
    }
    glitch *= Math.pow(0.0025, dt);

    if (unlocking) unlock = Math.min(1, unlock + dt / 1.3);

    mouse.x += (mouse.tx - mouse.x) * 0.07;
    mouse.y += (mouse.ty - mouse.y) * 0.07;

    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.time, elapsed);
    gl.uniform2f(u.mouse, mouse.x, mouse.y);
    gl.uniform1f(u.form, reducedMotion ? 1 : form01);
    gl.uniform1f(u.glitch, reducedMotion ? 0 : glitch);
    gl.uniform1f(u.unlock, unlock);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function loop(now) {
    frame(now);
    requestAnimationFrame(loop);
  }

  var img = new Image();
  img.onload = function () {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (reducedMotion) {
      frame(performance.now());
      // still needs the loop for the unlock flood
      form && form.addEventListener("submit", function () {
        requestAnimationFrame(loop);
      });
    } else {
      requestAnimationFrame(loop);
    }
  };
  img.src = logoSrc;
  if (img.complete && img.naturalWidth > 0) img.onload();
})();
