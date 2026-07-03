"use client";

import { useEffect, useRef } from "react";

/*
 * Coming-soon shader. Black room, bone smoke. The logo assembles itself out
 * of chaos ink over the first ~3s, then breathes, melts, and ripples away
 * from the cursor. Every few seconds a short analog glitch tears through it.
 * On unlock, bone ink floods the whole screen as the transition into the shop.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uForm;    // 0 -> chaos, 1 -> legible logo
uniform float uGlitch;  // impulse, decays fast
uniform float uUnlock;  // 0 -> 1 ink flood
uniform sampler2D uLogo;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

float logoInk(vec2 s, float mask) {
  vec4 tex = texture2D(uLogo, vec2(mix(0.06, 0.94, s.x), mix(0.28, 0.72, s.y)));
  return tex.a * (1.0 - tex.r) * mask;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;

  // glitch tears horizontal bands across the WHOLE frame
  float band = floor(gl_FragCoord.y / (uRes.y * 0.022));
  uv.x += (hash(vec2(band, floor(uTime * 24.0))) - 0.5) * 0.09 * uGlitch;

  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.05;

  vec3 black = vec3(0.05, 0.05, 0.048);
  vec3 bone = vec3(0.945, 0.937, 0.914);

  // bone smoke crawling through the dark
  vec2 q = vec2(fbm(p * 1.5 + t * 0.7), fbm(p * 1.5 - t * 0.5 + 4.2));
  float smoke = fbm(p * 2.0 + q * 1.8 - vec2(0.0, t * 0.6));
  vec3 col = black + bone * smoothstep(0.45, 1.1, smoke) * 0.085;

  // cursor pokes the ink
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float md = distance(p, m);
  float ripple = exp(-md * md * 12.0);
  vec2 poke = (p - m) / max(md, 0.001) * ripple * 0.022
    * sin(uTime * 2.4 - md * 30.0);

  // logo quad (word region of the texture is ~2:1)
  float breathe = 1.0 + 0.015 * sin(uTime * 0.45);
  float quadW = min(0.78 * aspect, 1.72) * breathe;
  float quadH = quadW * 0.5;
  vec2 center = vec2(0.5 * aspect, 0.60);
  vec2 luv = (p - center) / vec2(quadW, quadH) + 0.5;

  // heavy warp while forming, settles to a gentle melt
  float amp = mix(0.42, 0.05, uForm);
  vec2 warp = (vec2(
    fbm(luv * 2.8 + t + (1.0 - uForm) * 3.0),
    fbm(luv * 2.8 - t + 7.3)
  ) - 0.5) * amp + poke;

  vec2 s = luv + warp;

  vec2 edge = smoothstep(0.0, 0.02, s) * smoothstep(0.0, 0.02, 1.0 - s);
  float mask = edge.x * edge.y * smoothstep(0.05, 0.9, uForm);

  float ink = logoInk(s, mask);

  // chromatic split, only alive during a glitch (off = identical samples)
  float off = 0.007 * uGlitch;
  float inkR = logoInk(s + vec2(off, 0.0), mask);
  float inkB = logoInk(s - vec2(off, 0.0), mask);

  col = mix(col, bone, ink * 0.97);
  col.r += (inkR - ink) * 0.85;
  col.b += (inkB - ink) * 0.85;

  // vignette
  col *= 1.0 - 0.5 * pow(length(uv - vec2(0.5, 0.55)), 1.9);

  // unlock: ink floods outward from the logo
  float floodR = uUnlock * uUnlock * 2.8;
  float flood = 1.0 - smoothstep(floodR - 0.45, floodR,
    distance(p, center) + fbm(p * 3.5 + t * 3.0) * 0.35);
  col = mix(col, bone, clamp(flood, 0.0, 1.0));

  // grain
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.06;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function TeaserShader({
  unlocking,
  onFlooded,
  onGlitch,
}: {
  unlocking: boolean;
  onFlooded: () => void;
  onGlitch?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const unlockingRef = useRef(unlocking);
  const onFloodedRef = useRef(onFlooded);
  const onGlitchRef = useRef(onGlitch);
  unlockingRef.current = unlocking;
  onFloodedRef.current = onFlooded;
  onGlitchRef.current = onGlitch;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      form: gl.getUniformLocation(program, "uForm"),
      glitch: gl.getUniformLocation(program, "uGlitch"),
      unlock: gl.getUniformLocation(program, "uUnlock"),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let ready = false;
    let glitch = 0;
    let unlock = 0;
    let flooded = false;
    let last = performance.now();
    let nextGlitch = last + 3000 + Math.random() * 4000;
    const start = last;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      resize();

      const elapsed = (now - start) / 1000;
      const f = Math.min(1, elapsed / 3.2);
      const form = f * f * (3 - 2 * f);

      if (now > nextGlitch && form >= 1) {
        glitch = 1;
        nextGlitch = now + 3500 + Math.random() * 4500;
        onGlitchRef.current?.();
      }
      glitch *= Math.pow(0.0025, dt); // ~150ms decay

      if (unlockingRef.current) {
        unlock = Math.min(1, unlock + dt / 1.3);
        if (unlock >= 1 && !flooded) {
          flooded = true;
          onFloodedRef.current();
        }
      }

      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, elapsed);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.form, reducedMotion ? 1 : form);
      gl.uniform1f(u.glitch, reducedMotion ? 0 : glitch);
      gl.uniform1f(u.unlock, unlock);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };

    const img = new Image();
    img.src = "/brand/hngry-logo.png";
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ready = true;
      if (reducedMotion && !unlockingRef.current) {
        frame(performance.now()); // single still frame
      } else {
        raf = requestAnimationFrame(loop);
      }
    };

    // reduced motion still needs the flood loop once unlocking starts
    const unlockWatcher = setInterval(() => {
      if (reducedMotion && ready && unlockingRef.current && !raf) {
        raf = requestAnimationFrame(loop);
      }
    }, 200);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(unlockWatcher);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-label="HNGRŸ — Drop 001 coming 20.07.2026, 20:15"
    />
  );
}
