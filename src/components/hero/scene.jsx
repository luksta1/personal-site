import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const VERTEX = `
void main() {
  gl_Position = vec4(position, 1.0);
}`;

// ── Pass 1: Halo feedback shader (renders to FBO) ──────────────────
const HALO_FRAG = `
uniform vec2 iResolution;
uniform float iDpr;
uniform vec2 iMouse;
uniform float iTime;
uniform sampler2D iBuffer;
uniform vec3 baseColor;
uniform vec3 backgroundColor;
uniform float amplitudeFactor;
uniform float size;

vec4 j2hue(float c) {
  return .5 + .5 * cos(6.28 * c + vec4(0, -2.1, 2.1, 0));
}

void main() {
  vec2 res2 = iResolution.xy * iDpr;
  vec2 pixel = (gl_FragCoord.xy - 0.5 * res2) / res2.y;
  vec2 uv = gl_FragCoord.xy / res2;

  vec2 mouse2 = (iMouse * iDpr / res2 - 0.5) * vec2(1.0, -1.0);
  vec2 uvBig = (uv - 0.5) * 0.996 + 0.5;

  vec3 mixedColor = texture2D(iBuffer, uv).rgb - backgroundColor;

  vec2 offset = uv + vec2(
    (mixedColor.g - 0.2) * 0.01,
    (mixedColor.r - 0.2) * 0.01
  );

  float spinSpeed = 0.2 + 0.15 * cos(iTime * 0.5);
  float timeFrac = mod(iTime, 6.5);
  vec2 offset2 = uvBig + vec2(
    cos(timeFrac * spinSpeed) * 0.001,
    sin(timeFrac * spinSpeed) * 0.001
  );

  mixedColor = texture2D(iBuffer, offset).rgb * 0.4
    + texture2D(iBuffer, offset2).rgb * 0.6
    - backgroundColor;

  mixedColor = (mixedColor - 0.002) * 0.993;

  float angle = atan(pixel.x, pixel.y);
  float dist = length(pixel - mouse2 * 0.15) * 8.0 + sin(iTime) * 0.01;

  float flowerPeaks = 0.05 * amplitudeFactor * size;
  float edge = abs((dist + sin(angle * 7.0 + iTime * 0.5) * sin(iTime * 1.5) * flowerPeaks) * 0.65 / size);

  float rainbowInput = timeFrac * (0.75 + 0.05 * sin(iTime) * 1.5);
  vec4 rainbow = sqrt(j2hue(cos(rainbowInput))) + vec4(baseColor, 0.0) - 0.3;
  vec3 color = rainbow.rgb * smoothstep(1.0, 0.9, edge) * pow(edge, 20.0);

  gl_FragColor = vec4(
    backgroundColor + clamp(mixedColor + color, 0.0, 1.0),
    1.0
  );
}`;

// ── Pass 2: Composite — mountain displacement + halo blend ─────────
const COMPOSITE_FRAG = `
uniform sampler2D uImage;
uniform sampler2D uHalo;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform float uDpr;
uniform float uTime;
uniform float uHasImage;
uniform vec3 uBgColor;

void main() {
  vec2 res = uResolution * uDpr;
  vec2 uv = gl_FragCoord.xy / res;
  vec2 mouseNorm = uMouse * uDpr / res;

  vec3 base = uBgColor;

  if (uHasImage > 0.5) {
    // Cover-fit the image to viewport
    vec2 imgUV = uv;
    float viewAspect = uResolution.x / uResolution.y;
    float imgAspect = uImageSize.x / uImageSize.y;
    if (viewAspect > imgAspect) {
      imgUV.y = (uv.y - 0.5) * (viewAspect / imgAspect) + 0.5;
    } else {
      imgUV.x = (uv.x - 0.5) * (imgAspect / viewAspect) + 0.5;
    }

    // Cursor-driven displacement (rgbKineticSlider style)
    vec2 aspect = vec2(viewAspect, 1.0);
    float dist = distance(uv * aspect, mouseNorm * aspect);
    float strength = smoothstep(0.25, 0.0, dist) * 0.025;
    vec2 dir = normalize(uv - mouseNorm + 0.0001);
    imgUV -= dir * strength;

    // Subtle breathing motion
    imgUV += vec2(
      sin(uv.y * 8.0 + uTime * 0.4) * 0.0008,
      cos(uv.x * 8.0 + uTime * 0.3) * 0.0008
    );

    // RGB split / chromatic aberration around cursor
    float rgbShift = strength * 0.4;
    base.r = texture2D(uImage, imgUV + vec2(rgbShift, 0.0)).r;
    base.g = texture2D(uImage, imgUV).g;
    base.b = texture2D(uImage, imgUV - vec2(rgbShift, 0.0)).b;

    // Darken + slight desaturation for text readability
    base *= 0.32;
    float luma = dot(base, vec3(0.299, 0.587, 0.114));
    base = mix(vec3(luma), base, 0.65);
  }

  // Extract halo light from the feedback buffer
  vec3 haloRaw = texture2D(uHalo, uv).rgb;
  vec3 haloLight = max(haloRaw - uBgColor, 0.0);

  // Blend: image underneath, halo glow on top (additive)
  float haloIntensity = uHasImage > 0.5 ? 0.55 : 0.45;
  vec3 result = base + haloLight * haloIntensity;

  gl_FragColor = vec4(result, 1.0);
}`;

// ────────────────────────────────────────────────────────────────────

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function HaloEffect() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let width = container.offsetWidth;
    let height = container.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%';
    container.appendChild(renderer.domElement);

    const plane = new THREE.PlaneGeometry(2, 2);
    const camera = new THREE.Camera();
    camera.position.z = 1;

    // ── Halo scene (feedback loop) ─────────────────────────────────
    const rtOpts = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    };
    let bufferA = new THREE.WebGLRenderTarget(
      width * dpr, height * dpr, rtOpts
    );
    let bufferB = new THREE.WebGLRenderTarget(
      width * dpr, height * dpr, rtOpts
    );

    const bgColor = new THREE.Color(0x0a0a0a);

    const haloUniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(width, height) },
      iDpr: { value: dpr },
      iMouse: { value: new THREE.Vector2(width / 2, height / 2) },
      iBuffer: { value: bufferA.texture },
      baseColor: { value: new THREE.Color(0x7ec8a0) },
      backgroundColor: { value: bgColor.clone() },
      amplitudeFactor: { value: 1.0 },
      size: { value: 1.2 },
    };

    const haloMaterial = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: HALO_FRAG,
      uniforms: haloUniforms,
    });

    const haloScene = new THREE.Scene();
    haloScene.add(new THREE.Mesh(plane, haloMaterial));

    // ── Composite scene (mountain + halo blend) ────────────────────
    const compositeUniforms = {
      uHalo: { value: null },
      uImage: { value: null },
      uMouse: { value: haloUniforms.iMouse.value },
      uResolution: { value: haloUniforms.iResolution.value },
      uImageSize: { value: new THREE.Vector2(1, 1) },
      uDpr: { value: dpr },
      uTime: { value: 0 },
      uHasImage: { value: 0.0 },
      uBgColor: { value: bgColor.clone() },
    };

    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: COMPOSITE_FRAG,
      uniforms: compositeUniforms,
    });

    const compositeScene = new THREE.Scene();
    compositeScene.add(new THREE.Mesh(plane.clone(), compositeMaterial));

    // ── Load mountain image (optional — falls back gracefully) ─────
    const loader = new THREE.TextureLoader();
    loader.load(
      '/mountain-hero.jpg',
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        compositeUniforms.uImage.value = tex;
        compositeUniforms.uImageSize.value.set(
          tex.image.width,
          tex.image.height
        );
        compositeUniforms.uHasImage.value = 1.0;
      },
      undefined,
      () => {} // no image, halo-only mode
    );

    // ── Mouse tracking ─────────────────────────────────────────────
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseEaseX = mouseX;
    let mouseEaseY = mouseY;

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        mouseX = x;
        mouseY = y;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // ── Resize ─────────────────────────────────────────────────────
    const onResize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      renderer.setSize(width, height);
      haloUniforms.iResolution.value.set(width, height);
      bufferA.setSize(width * dpr, height * dpr);
      bufferB.setSize(width * dpr, height * dpr);
    };
    window.addEventListener('resize', onResize);

    // ── Render loop ────────────────────────────────────────────────
    let prevTime = performance.now();
    let t = 0;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min(Math.max((now - prevTime) / (1000 / 60), 0.2), 5);
      prevTime = now;
      t += delta;

      const timeVal = t * 0.016667;
      haloUniforms.iTime.value = timeVal;
      compositeUniforms.uTime.value = timeVal;

      mouseEaseX += (mouseX - mouseEaseX) * 0.05;
      mouseEaseY += (mouseY - mouseEaseY) * 0.05;
      haloUniforms.iMouse.value.set(mouseEaseX, mouseEaseY);

      // Pass 1: Halo feedback → FBO
      haloUniforms.iBuffer.value = bufferB.texture;
      renderer.setRenderTarget(bufferA);
      renderer.render(haloScene, camera);

      // Swap buffers
      const swap = bufferA;
      bufferA = bufferB;
      bufferB = swap;

      // Pass 2: Composite (mountain + halo) → screen
      compositeUniforms.uHalo.value = bufferB.texture;
      renderer.setRenderTarget(null);
      renderer.render(compositeScene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      bufferA.dispose();
      bufferB.dispose();
      haloMaterial.dispose();
      compositeMaterial.dispose();
      if (compositeUniforms.uImage.value) {
        compositeUniforms.uImage.value.dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
