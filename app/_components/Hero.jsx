"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/button";

function Hero() {
  const router = useRouter();
  const canvasRef = useRef(null);

  // Animated particle field for 3D depth effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Generate star particles at random 3D-like positions
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 3 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha * p.z * 0.5})`;
        ctx.shadowBlur = 8 * p.z;
        ctx.shadowColor = "rgba(236, 72, 153, 0.5)";
        ctx.fill();
      });
      // Connect close particles with lines (constellation effect)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060612] flex items-center">
      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Deep 3D background glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-purple-700/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-700/10 blur-[100px] pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(147,51,234,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-300 tracking-widest uppercase">AI-Powered Learning</span>
        </div>

        {/* Main title with 3D layered text */}
        <h1
          className="text-6xl sm:text-8xl font-black tracking-tight mb-6 leading-none"
          style={{ textShadow: "0 0 80px rgba(168,85,247,0.4), 0 4px 30px rgba(0,0,0,0.5)" }}
        >
          <span className="gradient-text block">Rverse AI</span>
          <span className="block text-white/90 text-4xl sm:text-5xl mt-3 font-bold">
            Generate. Learn. Master.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed">
          Build AI-curated full courses from a single prompt. Get video lessons, transcriptions, study notes, and MCQs — all generated in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <button
            onClick={() => router.push("/dashboard")}
            className="relative group px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_50px_rgba(147,51,234,0.8)] hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></span>
            🚀 Get Started Free
          </button>

          <button
            className="px-10 py-4 rounded-2xl bg-white/5 border border-white/20 text-white font-bold text-lg hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 backdrop-blur-md shadow-lg"
          >
            ✦ View Demo
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">
          {[
            { num: "10K+", label: "Courses Generated" },
            { num: "98%", label: "Accuracy Rate" },
            { num: "<10s", label: "Generation Time" },
          ].map((stat, i) => (
            <div key={i} className="text-center glass rounded-2xl p-4 card-hover border border-white/10">
              <div className="text-3xl font-black gradient-text">{stat.num}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
