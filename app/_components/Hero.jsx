"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Hero() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isMobile) return; // Skip canvas on mobile for performance
    const ctx = canvas.getContext("2d");
    let animId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Fewer particles for better performance
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  const features = [
    { icon: "⚡", title: "AI Course Builder", desc: "Generate full courses in seconds" },
    { icon: "🎥", title: "Video Intelligence", desc: "YouTube → Study notes & MCQs" },
    { icon: "📊", title: "Smart Analytics", desc: "Track your learning progress" },
    { icon: "🌐", title: "Works Everywhere", desc: "Web, iOS & Android ready" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060612] flex flex-col">

      {/* Star canvas — desktop only */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
        style={{ zIndex: 0 }}
      />

      {/* CSS background orbs — lightweight on mobile */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full bg-purple-700/20 blur-[80px] md:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-pink-600/15 blur-[60px] md:blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-24 text-center">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 glow-pulse" />
          <span className="text-xs font-semibold text-gray-300 tracking-widest uppercase">AI-Powered Learning Platform</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-5 leading-none slide-up"
          style={{ animationDelay: '0.1s' }}>
          <span className="gradient-text block">Rverse AI</span>
          <span className="block text-white/80 text-2xl sm:text-4xl md:text-5xl mt-3 font-bold">
            Generate. Learn. Master.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed slide-up"
          style={{ animationDelay: '0.2s' }}>
          Build complete AI courses from a single prompt. Video lessons, notes,
          flashcards & MCQs — ready in under 10 seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none justify-center slide-up"
          style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => router.push("/dashboard")}
            className="relative group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base shadow-[0_0_30px_rgba(147,51,234,0.4)] active:scale-95 transition-transform duration-150 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            🚀 Get Started Free
          </button>

          <button
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-bold text-base active:scale-95 transition-transform duration-150"
          >
            ✦ Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-3 sm:gap-6 max-w-sm sm:max-w-lg w-full mx-auto slide-up"
          style={{ animationDelay: '0.4s' }}>
          {[
            { num: "10K+", label: "Courses" },
            { num: "98%", label: "Accuracy" },
            { num: "<10s", label: "Speed" },
          ].map((stat, i) => (
            <div key={i} className="text-center glass rounded-2xl p-3 sm:p-5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black gradient-text">{stat.num}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-10 px-5 pb-20 max-w-5xl mx-auto w-full">
        <h2 className="text-center text-2xl sm:text-3xl font-black text-white mb-8">
          Everything you need to <span className="gradient-text">learn smarter</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 border border-white/10 card-hover neon-border fade-in"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white text-sm sm:text-base">{f.title}</h3>
              <p className="text-gray-400 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
