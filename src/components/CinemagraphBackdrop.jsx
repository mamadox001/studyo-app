import React, { useEffect, useRef } from 'react';

export default function CinemagraphBackdrop({ mode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!mode || mode === 'none' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle setups
    let particles = [];
    if (mode === 'rain') {
      const count = 120;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 8 + 12,
          length: Math.random() * 20 + 10,
          opacity: Math.random() * 0.25 + 0.1,
        });
      }
    } else if (mode === 'stars') {
      const count = 150;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.7 + 0.2,
        });
      }
    } else if (mode === 'embers') {
      const count = 70;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 100,
          size: Math.random() * 2 + 1,
          speedY: Math.random() * 1.2 + 0.6,
          speedX: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.6 + 0.3,
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === 'rain') {
        ctx.strokeStyle = 'rgba(186, 215, 255, 0.25)';
        ctx.lineWidth = 1;
        particles.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 1;
          if (p.y > canvas.height) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (mode === 'stars') {
        particles.forEach(p => {
          ctx.fillStyle = `rgba(240, 245, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y -= p.speed;
          if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (mode === 'embers') {
        particles.forEach(p => {
          ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y -= p.speedY;
          p.x += p.speedX;
          if (p.y < 0) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [mode]);

  if (!mode || mode === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65,
        display: 'block'
      }}
    />
  );
}
