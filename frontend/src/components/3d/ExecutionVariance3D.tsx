"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface ExecutionVariance3DProps {
  flakinessRate?: number;
  testName?: string;
  className?: string;
}

export function ExecutionVariance3D({
  flakinessRate = 18.2,
  testName = "TestAsyncConnectionPoolDrainUnderLoad",
  className,
}: ExecutionVariance3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"PHASE_SPACE" | "CONVERGED">("PHASE_SPACE");
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let attractorTorus: THREE.Mesh;
    let pointsPass: THREE.Points;
    let pointsFail: THREE.Points;

    try {
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 240;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(2.6, 2.2, 3.2);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);

      container.appendChild(renderer.domElement);

      // 1. Graphite Coordinate Grid Floor
      const gridHelper = new THREE.GridHelper(2.4, 6, 0x222424, 0x17191A);
      gridHelper.position.y = -0.8;
      scene.add(gridHelper);

      // 2. Stable Attractor Basin (Muted Silver Torus loop)
      const torusGeom = new THREE.TorusGeometry(0.85, 0.02, 12, 48);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xC5C7C1,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      attractorTorus = new THREE.Mesh(torusGeom, torusMat);
      attractorTorus.rotation.x = Math.PI / 2.8;
      scene.add(attractorTorus);

      // 3. Execution Data Points in Phase Space (50 runs)
      const passPositions: number[] = [];
      const passCount = 41;
      for (let i = 0; i < passCount; i++) {
        const angle = (i / passCount) * Math.PI * 2;
        const r = 0.85 + (Math.random() - 0.5) * 0.2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = (Math.random() - 0.5) * 0.25;
        passPositions.push(x, y, z);
      }
      const passGeom = new THREE.BufferGeometry();
      passGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(passPositions, 3)
      );
      const passMat = new THREE.PointsMaterial({
        color: 0x7EB49A,
        size: 0.08,
        transparent: true,
        opacity: 0.9,
      });
      pointsPass = new THREE.Points(passGeom, passMat);
      scene.add(pointsPass);

      // Fail Points (Rose)
      const failPositions: number[] = [];
      const failCount = 9;
      for (let i = 0; i < failCount; i++) {
        const angle = Math.PI * 0.2 + (i / failCount) * 0.8;
        const r = 1.35 + (i * 0.06);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = 0.35 + (i * 0.05);
        failPositions.push(x, y, z);
      }
      const failGeom = new THREE.BufferGeometry();
      failGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(failPositions, 3)
      );
      const failMat = new THREE.PointsMaterial({
        color: 0xE47777,
        size: 0.11,
        transparent: true,
        opacity: 0.95,
      });
      pointsFail = new THREE.Points(failGeom, failMat);
      scene.add(pointsFail);

      // Divergence trajectory spline in warm ivory
      const curvePoints = [
        new THREE.Vector3(0.6, 0.0, 0.6),
        new THREE.Vector3(0.9, 0.15, 0.85),
        new THREE.Vector3(1.2, 0.35, 1.1),
        new THREE.Vector3(1.45, 0.5, 1.3),
      ];
      const spline = new THREE.CatmullRomCurve3(curvePoints);
      const splineGeom = new THREE.TubeGeometry(spline, 24, 0.012, 6, false);
      const splineMat = new THREE.MeshBasicMaterial({
        color: 0xF0EEE8,
        transparent: true,
        opacity: 0.4,
      });
      const splineMesh = new THREE.Mesh(splineGeom, splineMat);
      scene.add(splineMesh);

      // Mouse drag rotation controls
      let isDragging = false;
      let prevMousePos = { x: 0, y: 0 };
      let spherical = { theta: 0.9, phi: 1.1, radius: 4.2 };

      const updateCamera = () => {
        camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        camera.position.y = spherical.radius * Math.cos(spherical.phi);
        camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        camera.lookAt(0, 0, 0);
      };

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        prevMousePos = { x: e.clientX, y: e.clientY };

        spherical.theta -= deltaX * 0.01;
        spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.01));
        updateCamera();
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const dom = renderer.domElement;
      dom.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      // Render loop
      let clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        if (attractorTorus) {
          attractorTorus.rotation.z = elapsed * 0.15;
        }

        if (!isDragging) {
          spherical.theta += 0.003;
          updateCamera();
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", handleResize);
        dom.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      setWebglSupported(false);
    }
  }, [viewMode]);

  return (
    <div
      className={cn(
        "surface-solid rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-2xl",
        className
      )}
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)] gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#F0EEE8]" />
            <h3 className="text-xs font-semibold text-[#F0EEE8] uppercase tracking-wider font-mono">
              Phase-space execution variance topology
            </h3>
          </div>
          <p className="text-[11px] text-[#A8AAA5] mt-0.5">
            50 repeated runs mapped across thread delay (X) and duration (Z)
          </p>
        </div>

        {/* State Toggle */}
        <div className="flex items-center space-x-1 bg-[#0B0C0D] p-1 rounded-xl border border-[rgba(226,226,218,0.13)] text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setViewMode("PHASE_SPACE")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
              viewMode === "PHASE_SPACE"
                ? "bg-[#222424] text-[#F0EEE8] border border-[rgba(235,235,228,0.22)] font-medium"
                : "text-[#A8AAA5] hover:text-[#F0EEE8]"
            )}
          >
            Bifurcation ({flakinessRate}%)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("CONVERGED")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
              viewMode === "CONVERGED"
                ? "bg-[rgba(126,180,154,0.12)] text-[#7EB49A] border border-[rgba(126,180,154,0.3)] font-medium"
                : "text-[#A8AAA5] hover:text-[#F0EEE8]"
            )}
          >
            Converged
          </button>
        </div>
      </div>

      {/* 3D Canvas / Fallback Container */}
      <div className="relative h-[220px] w-full my-3 bg-[#0B0C0D] rounded-xl border border-[rgba(226,226,218,0.10)] overflow-hidden flex items-center justify-center">
        {webglSupported ? (
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          <div className="w-full h-full p-4 flex flex-col justify-between font-mono text-xs text-[#A8AAA5]">
            <div className="flex items-center justify-between text-[11px]">
              <span>2D Scatter Fallback (Thread Jitter vs Execution Time)</span>
              <span className="text-[#F0EEE8]">9 Bifurcations Detected</span>
            </div>
            <div className="relative flex-1 my-2 border-l border-b border-[rgba(226,226,218,0.13)] flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                <circle cx="120" cy="65" r="4" fill="#7EB49A" opacity="0.8" />
                <circle cx="125" cy="60" r="4" fill="#7EB49A" opacity="0.8" />
                <circle cx="130" cy="70" r="4" fill="#7EB49A" opacity="0.8" />
                <circle cx="115" cy="55" r="4" fill="#7EB49A" opacity="0.8" />
                <circle cx="135" cy="62" r="4" fill="#7EB49A" opacity="0.8" />
                {viewMode === "PHASE_SPACE" && (
                  <>
                    <path
                      d="M 135 62 Q 180 40 240 25"
                      fill="none"
                      stroke="#C5C7C1"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx="210" cy="35" r="5" fill="#E47777" />
                    <circle cx="230" cy="28" r="5" fill="#E47777" />
                    <circle cx="250" cy="22" r="5" fill="#E47777" />
                  </>
                )}
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#777A76]">
              <span>0ms Delay</span>
              <span className="text-[#F0EEE8]">Critical Boundary: 18ms Delay</span>
              <span>50ms Delay &rarr;</span>
            </div>
          </div>
        )}

        {/* Phase Space Legend Overlays */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-3 text-[10px] font-mono bg-[#17191A]/90 px-2.5 py-1 rounded-lg border border-[rgba(226,226,218,0.13)]">
          <span className="flex items-center space-x-1 text-[#7EB49A]">
            <span className="w-2 h-2 rounded-full bg-[#7EB49A]" />
            <span>Pass basin (41)</span>
          </span>
          {viewMode === "PHASE_SPACE" && (
            <span className="flex items-center space-x-1 text-[#E47777]">
              <span className="w-2 h-2 rounded-full bg-[#E47777]" />
              <span>Divergent races (9)</span>
            </span>
          )}
        </div>
      </div>

      {/* Engineering Diagnostic Takeaway */}
      <div className="pt-2.5 border-t border-[rgba(226,226,218,0.10)] text-[11px] font-mono text-[#A8AAA5] flex items-center justify-between">
        <span>Bifurcation trigger: Scheduler delay &gt; 18.5ms</span>
        <span className="text-[#F0EEE8]">Interactive orbit</span>
      </div>
    </div>
  );
}
