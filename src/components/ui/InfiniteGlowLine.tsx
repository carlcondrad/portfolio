import { useEffect, useRef } from 'react';

interface InfiniteGlowLineProps {
  color?: string;
  glowColor?: string;
  height?: number;
  speed?: number;
  glowIntensity?: number;
}

export default function InfiniteGlowLine({
  color = '#ffffff',
  glowColor = '#ffffff',
  height = 2,
  speed = 2,
  glowIntensity = 20,
}: InfiniteGlowLineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const segmentWidth = 100;
      const gapWidth = 50;
      const totalWidth = segmentWidth + gapWidth;

      // Move offset for infinite scroll effect
      offset += speed;
      if (offset >= totalWidth) {
        offset = 0;
      }

      // Draw multiple segments to fill the canvas
      const numSegments = Math.ceil(canvas.width / totalWidth) + 2;

      for (let i = -1; i < numSegments; i++) {
        const x = i * totalWidth - offset;

        // Create gradient for each segment
        const gradient = ctx.createLinearGradient(x, 0, x + segmentWidth, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'transparent');

        // Draw the line segment
        ctx.strokeStyle = gradient;
        ctx.lineWidth = height;
        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(x + segmentWidth, centerY);
        ctx.stroke();

        // Draw glow effect
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = glowColor;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = height;
        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(x + segmentWidth, centerY);
        ctx.stroke();

        // Reset shadow for next iteration
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, glowColor, height, speed, glowIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height * 4}px` }}
    />
  );
}
