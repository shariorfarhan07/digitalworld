"use client";

import { useEffect, useRef } from "react";

const VERTEX_SRC = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;

    // Deep charcoal base
    vec3 color1 = vec3(0.0627, 0.0745, 0.1020); // #10131a
    // Electric Blue / Indigo glow
    vec3 color2 = vec3(0.302, 0.557, 1.0);   // #4d8eff
    vec3 color3 = vec3(0.196, 0.196, 0.753); // #3131c0

    float dist = distance(uv, vec2(0.5) + 0.1 * vec2(cos(u_time * 0.15), sin(u_time * 0.25)));
    float mouseDist = distance(uv, m);

    float glow = smoothstep(0.9, 0.0, dist);
    float mouseGlow = smoothstep(0.5, 0.0, mouseDist) * 0.4;

    vec3 finalColor = mix(color1, color2, glow * 0.12);
    finalColor = mix(finalColor, color3, mouseGlow);

    float n = noise(uv * u_time * 0.001);
    finalColor += n * 0.015;

    gl_FragColor = vec4(finalColor, 1.0);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("ShaderBackground: shader compile error", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("ShaderBackground: program link error", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    function onMouseMove(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    }
    if (!reducedMotion) window.addEventListener("mousemove", onMouseMove);

    gl.clearColor(0.0627, 0.0745, 0.102, 1);

    let raf = 0;
    function draw(t: number) {
      if (!gl || !canvas) return;
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function render(t: number) {
      draw(t);
      raf = requestAnimationFrame(render);
    }

    if (reducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full bg-surface ${className}`}
    />
  );
}
