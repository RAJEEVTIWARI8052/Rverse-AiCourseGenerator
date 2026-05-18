"use client";

import React, { useEffect, useRef } from 'react';

export default function CursorEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;

    let points = [];
    const maxPoints = 40;
    
    // Track the real mouse position
    let target = { x: width / 2, y: height / 2 };
    
    // Track the interpolated smooth position
    let current = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate current position towards target (lerp)
      current.x += (target.x - current.x) * 0.25; // 0.25 is the smoothing factor
      current.y += (target.y - current.y) * 0.25;

      // Continuously add the smooth point
      points.push({ x: current.x, y: current.y, age: 0 });

      // Draw the trailing line
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        
        // Add a neon glow to the line
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)'; // Purple 600
        ctx.lineWidth = 1.5; // Thinner line
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(236, 72, 153, 0.8)'; // Pink 500
        ctx.stroke();
      }

      // Update points age to create the fading/erasable effect
      for (let i = 0; i < points.length; i++) {
        points[i].age += 1;
      }
      
      // Keep only recent points (the "tail" of the line)
      points = points.filter(p => p.age < 20);
      if (points.length > maxPoints) {
        points.splice(0, points.length - maxPoints);
      }

      // Draw the main cursor pointer circle right on the smooth position
      ctx.beginPath();
      ctx.arc(current.x, current.y, 4, 0, Math.PI * 2); // Thinner head
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(147, 51, 234, 1)';
      ctx.fill();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
