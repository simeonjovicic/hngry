"use client";

import { useEffect, useRef } from "react";

/*
 * Liquid logo hero. Renders the HNGRY logo as a WebGL texture and melts it
 * with domain-warped noise; the cursor pokes ripples into the ink.
 * Bone/ink palette only — intentionally quiet, the motion is the statement.
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

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.06;

  vec3 bone = vec3(0.945, 0.937, 0.914);
  vec3 ink = vec3(0.05, 0.05, 0.05);

  // faint ink wash drifting in the background
  vec2 q = vec2(fbm(p * 1.3 + t * 0.6), fbm(p * 1.3 - t * 0.4 + 3.7));
  float wash = fbm(p * 1.7 + q * 1.4);
  vec3 col = mix(bone, ink, smoothstep(0.52, 1.05, wash) * 0.10);

  // mouse ripple field
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float mdist = distance(p, m);
  float ripple = exp(-mdist * mdist * 14.0);
  vec2 dir = (p - m) / max(mdist, 0.001);
  vec2 poke = dir * ripple * 0.016 * sin(uTime * 2.2 - mdist * 34.0);

  // logo quad — word region of the square texture is roughly 2:1
  float breathe = 1.0 + 0.012 * sin(uTime * 0.5);
  float quadW = min(0.74 * aspect, 1.7) * breathe;
  float quadH = quadW * 0.5;
  vec2 center = vec2(0.5 * aspect, 0.55);
  vec2 luv = (p - center) / vec2(quadW, quadH) + 0.5;

  // liquid melt
  vec2 warp = (vec2(
    fbm(luv * 2.6 + t),
    fbm(luv * 2.6 - t + 7.3)
  ) - 0.5) * 0.045 + poke;

  vec2 s = luv + warp;
  vec2 tuv = vec2(mix(0.06, 0.94, s.x), mix(0.28, 0.72, s.y));
  // png background is transparent — ink lives where alpha is high and rgb dark
  vec4 tex = texture2D(uLogo, tuv);
  float logoDark = tex.a * (1.0 - tex.r);

  vec2 edge = smoothstep(0.0, 0.02, s) * smoothstep(0.0, 0.02, 1.0 - s);
  logoDark *= edge.x * edge.y;

  col = mix(col, ink, logoDark * 0.97);

  // grain
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.045;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // fullscreen triangle
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

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");

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
    const parent = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
    };
    parent?.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let ready = false;
    let inView = true;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const start = performance.now();

    const frame = () => {
      resize();
      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };

    const maybeStart = () => {
      cancelAnimationFrame(raf);
      if (!ready) return;
      if (reducedMotion) {
        frame(); // single still frame
      } else if (inView) {
        loop();
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      maybeStart();
    });
    io.observe(canvas);

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
      maybeStart();
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      parent?.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-label="HNGRŸ"
    />
  );
}
