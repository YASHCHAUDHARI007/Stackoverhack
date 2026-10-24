"use client";

import React, { useEffect, useRef, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Sparkles, Radio, Activity, Eye, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlakinessOrbit3DProps {
  className?: string;
  flakinessRate?: number;
  testName?: string;
}

export function FlakinessOrbit3D({
  className,
  flakinessRate = 18.0,
  testName = "TestAsyncConnectionPoolDrainUnderLoad",
}: FlakinessOrbit3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"DIVERGENT" | "CONVERGED">("DIVERGENT");
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Respect reduced motion: display fallback immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let isDisposed = false;
    let cleanup = () => {};

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isDisposed) return;
        observer.disconnect();

        void (async () => {
          const T = await import("three");
          if (isDisposed || !element) return;

          let renderer: InstanceType<typeof T.WebGLRenderer>;
          try {
            renderer = new T.WebGLRenderer({
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            });
          } catch {
            return;
          }

          // Cap DPR to 1.5 to eliminate fill-rate bottlenecks
          const maxDpr = window.innerWidth < 768 ? 1.2 : 1.5;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
          renderer.setSize(element.clientWidth, element.clientHeight);
          renderer.outputColorSpace = T.SRGBColorSpace;
          element.appendChild(renderer.domElement);
          setReady(true);

          const scene = new T.Scene();
          const camera = new T.PerspectiveCamera(
            42,
            element.clientWidth / Math.max(element.clientHeight, 1),
            0.1,
            50
          );
          camera.position.set(0, 0, 7.5);

          const group = new T.Group();
          scene.add(group);

          const geometries: Array<
            InstanceType<typeof T.BufferGeometry>
          > = [];
          const materials: Array<
            InstanceType<typeof T.Material>
          > = [];

          // 1. Central Core Node (State Invariant Kernel)
          const coreGeo = new T.IcosahedronGeometry(0.85, 2);
          const coreMat = new T.MeshStandardMaterial({
            color: 0x050811,
            roughness: 0.2,
            metalness: 0.9,
            wireframe: false,
          });
          geometries.push(coreGeo);
          materials.push(coreMat);
          const coreMesh = new T.Mesh(coreGeo, coreMat);
          group.add(coreMesh);

          // Wireframe cage over core
          const cageGeo = new T.IcosahedronGeometry(0.92, 1);
          const cageMat = new T.MeshBasicMaterial({
            color: 0x00e5ff,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
          });
          geometries.push(cageGeo);
          materials.push(cageMat);
          const cageMesh = new T.Mesh(cageGeo, cageMat);
          group.add(cageMesh);

          // 2. Invariant State Trajectory (Deterministic baseline loop)
          const baselineCurve = new T.TorusKnotGeometry(1.6, 0.024, 128, 16, 2, 3);
          const baselineMat = new T.MeshBasicMaterial({
            color: 0x10f596,
            wireframe: false,
            transparent: true,
            opacity: 0.85,
          });
          geometries.push(baselineCurve);
          materials.push(baselineMat);
          const baselineMesh = new T.Mesh(baselineCurve, baselineMat);
          group.add(baselineMesh);

          // 3. Divergent State Vectors (Off-axis flaky trajectories)
          const divergentPaths: InstanceType<typeof T.Line>[] = [];
          const divergentPoints: InstanceType<typeof T.Mesh>[] = [];
          const countDivergent = 6;

          for (let i = 0; i < countDivergent; i++) {
            const angle = (i / countDivergent) * Math.PI * 2;
            const points: InstanceType<typeof T.Vector3>[] = [];
            const steps = 30;
            const perturbAmp = 0.6 + (i % 3) * 0.4;

            for (let s = 0; s <= steps; s++) {
              const t = s / steps;
              const theta = t * Math.PI * 2 + angle;
              const r = 2.1 + Math.sin(t * Math.PI * 4) * 0.3;
              const x = Math.cos(theta) * r;
              const y = Math.sin(theta) * r;
              const z = (Math.sin(t * Math.PI * 3 + i) * perturbAmp) * (i % 2 === 0 ? 1 : -1);
              points.push(new T.Vector3(x, y, z));
            }

            const pathGeo = new T.BufferGeometry().setFromPoints(points);
            const pathMat = new T.LineBasicMaterial({
              color: i % 2 === 0 ? 0xf43f5e : 0xfbbf24,
              transparent: true,
              opacity: 0.45,
            });
            geometries.push(pathGeo);
            materials.push(pathMat);
            const pathLine = new T.Line(pathGeo, pathMat);
            group.add(pathLine);
            divergentPaths.push(pathLine);

            // Seed Particle on divergent trajectory
            const pGeo = new T.SphereGeometry(0.06, 8, 8);
            const pMat = new T.MeshBasicMaterial({
              color: i % 2 === 0 ? 0xf43f5e : 0xfbbf24,
            });
            geometries.push(pGeo);
            materials.push(pMat);
            const pMesh = new T.Mesh(pGeo, pMat);
            group.add(pMesh);
            divergentPoints.push(pMesh);
          }

          // 4. Gimbal Telemetry Ring (Scheduler Coordinates)
          const gimbalGeo = new T.TorusGeometry(2.7, 0.012, 16, 100);
          const gimbalMat = new T.MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.25,
          });
          geometries.push(gimbalGeo);
          materials.push(gimbalMat);
          const gimbalMesh = new T.Mesh(gimbalGeo, gimbalMat);
          gimbalMesh.rotation.x = Math.PI / 2.5;
          group.add(gimbalMesh);

          // Lighting
          scene.add(new T.AmbientLight(0xffffff, 0.9));
          const cyanLight = new T.PointLight(0x00e5ff, 5, 10);
          cyanLight.position.set(2, 3, 4);
          scene.add(cyanLight);
          const limeLight = new T.PointLight(0x10f596, 4, 10);
          limeLight.position.set(-3, -2, 2);
          scene.add(limeLight);

          // Interaction & Render Loop
          let pointerX = 0;
          let pointerY = 0;
          let targetX = 0;
          let targetY = 0;
          let frameId = 0;
          let visible = true;
          let lastTime = 0;

          const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            const rect = element.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            targetX = x * 0.6;
            targetY = y * 0.4;
          };

          const onResize = () => {
            if (!element) return;
            const w = element.clientWidth;
            const h = element.clientHeight;
            camera.aspect = w / Math.max(h, 1);
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          };

          const clock = new T.Clock();

          const tick = (now: number) => {
            if (!visible || document.hidden || isDisposed) return;

            // Frame throttle: cap at ~45fps desktop (22ms)
            if (now - lastTime < 22) {
              frameId = requestAnimationFrame(tick);
              return;
            }
            lastTime = now;

            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            // Smooth pointer damping
            pointerX += (targetX - pointerX) * 0.08;
            pointerY += (targetY - pointerY) * 0.08;

            const isDivergent = modeRef.current === "DIVERGENT";

            // Rotate core
            coreMesh.rotation.y += delta * 0.3;
            cageMesh.rotation.y -= delta * 0.2;
            cageMesh.rotation.x += delta * 0.15;

            // Group rotation with pointer parallax
            group.rotation.y = elapsed * 0.18 + pointerX;
            group.rotation.x = Math.sin(elapsed * 0.15) * 0.12 - pointerY;

            // Animate baseline trajectory
            baselineMesh.rotation.z += delta * 0.25;

            // Divergent path breathing / collapse
            divergentPaths.forEach((path, i) => {
              const targetOpacity = isDivergent ? 0.45 : 0.08;
              const mat = path.material as InstanceType<typeof T.LineBasicMaterial>;
              mat.opacity += (targetOpacity - mat.opacity) * 0.1;
              path.rotation.z += delta * (0.1 + i * 0.02);
            });

            // Animate divergent seed particles along arcs
            divergentPoints.forEach((p, i) => {
              const speed = 0.8 + i * 0.2;
              const angle = elapsed * speed + i * 1.5;
              const r = isDivergent ? 2.1 + Math.sin(angle * 2) * 0.3 : 1.6;
              const zSpread = isDivergent ? Math.cos(angle * 3) * 0.7 : 0;
              p.position.set(Math.cos(angle) * r, Math.sin(angle) * r, zSpread);
              p.visible = isDivergent;
            });

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(tick);
          };

          // Observers & Listeners
          const visibilityObserver = new IntersectionObserver((entries) => {
            visible = Boolean(entries[0]?.isIntersecting);
            if (visible) {
              lastTime = performance.now();
              frameId = requestAnimationFrame(tick);
            } else {
              cancelAnimationFrame(frameId);
            }
          });

          const onVisibilityChange = () => {
            if (document.hidden) {
              cancelAnimationFrame(frameId);
            } else if (visible) {
              lastTime = performance.now();
              frameId = requestAnimationFrame(tick);
            }
          };

          visibilityObserver.observe(element);
          document.addEventListener("visibilitychange", onVisibilityChange);
          window.addEventListener("resize", onResize);
          element.addEventListener("pointermove", onPointerMove, { passive: true });

          frameId = requestAnimationFrame(tick);

          cleanup = () => {
            cancelAnimationFrame(frameId);
            visibilityObserver.disconnect();
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("resize", onResize);
            element.removeEventListener("pointermove", onPointerMove);
            geometries.forEach((g) => g.dispose());
            materials.forEach((m) => m.dispose());
            renderer.dispose();
            renderer.domElement.remove();
          };
        })();
      },
      { rootMargin: "150px" }
    );

    observer.observe(element);

    return () => {
      isDisposed = true;
      observer.disconnect();
      cleanup();
    };
  }, []);

  return (
    <GlassPanel
      hasCorners
      glow="cyan"
      className={cn("p-5 flex flex-col justify-between overflow-hidden relative group", className)}
    >
      {/* 3D Header & Status */}
      <div className="flex items-start justify-between z-10">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest text-[11px]">
              State-Space Invariant Lattice
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-sans mt-0.5">
            Non-Deterministic Trajectory Bifurcation
          </h4>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Empirical 3D simulation of test run divergence under scheduler jitter
          </p>
        </div>

        {/* Toggle Mode Control */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setMode("DIVERGENT")}
            className={cn(
              "px-2 py-1 rounded-lg transition-colors cursor-pointer",
              mode === "DIVERGENT"
                ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30"
                : "text-slate-400 hover:text-white"
            )}
          >
            Chaos Flake ({flakinessRate}%)
          </button>
          <button
            type="button"
            onClick={() => setMode("CONVERGED")}
            className={cn(
              "px-2 py-1 rounded-lg transition-colors cursor-pointer",
              mode === "CONVERGED"
                ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            )}
          >
            Converged (Clean)
          </button>
        </div>
      </div>

      {/* 3D Canvas Host Container with Non-WebGL Fallback */}
      <div
        ref={containerRef}
        className="w-full h-[220px] relative my-2 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Lightweight Non-WebGL / SSR / Reduced-Motion Fallback */}
        {!ready && (
          <div className="flex flex-col items-center justify-center space-y-3 font-mono text-xs text-slate-400 animate-pulse">
            <svg
              className="w-16 h-16 text-cyan-400/40"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="50" cy="50" r="40" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="24" strokeWidth="2" className="text-emerald-400" />
              <path
                d="M50 10 L50 90 M10 50 L90 50"
                strokeWidth="0.5"
                strokeOpacity="0.5"
              />
              <circle cx="70" cy="30" r="4" fill="#f43f5e" />
              <circle cx="30" cy="70" r="4" fill="#fbbf24" />
            </svg>
            <span className="text-[11px] text-cyan-300">
              State-Space Radar [Fallback Active]
            </span>
          </div>
        )}
      </div>

      {/* Legend & Telemetry Bar */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-400 z-10">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10f596]" />
            <span className="text-slate-300">Passing Invariant</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            <span className="text-slate-300">Divergent Seeds</span>
          </span>
        </div>

        <span className="text-[10px] text-slate-500 hidden sm:inline">
          Interactive Parallax (Hover &amp; Drag)
        </span>
      </div>
    </GlassPanel>
  );
}
