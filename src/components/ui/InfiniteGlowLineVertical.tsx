import { useEffect, useRef } from 'react';

interface InfiniteGlowLineVerticalProps {
  color?: string;
  glowColor?: string;
  width?: number;
  speed?: number;
  glowIntensity?: number;
  height?: string;
}

export default function InfiniteGlowLineVertical({
  color = '#ffffff',
  glowColor = '#ffffff',
  width = 2,
  speed = 2,
  glowIntensity = 20,
  height = '24rem',
}: InfiniteGlowLineVerticalProps) {
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

      const centerX = canvas.width / 2;
      const segmentHeight = 100;
      const gapHeight = 50;
      const totalHeight = segmentHeight + gapHeight;

      // Move offset for infinite scroll effect (going down)
      offset += speed;
      if (offset >= totalHeight) {
        offset = 0;
      }

      // Draw multiple segments to fill the canvas
      const numSegments = Math.ceil(canvas.height / totalHeight) + 2;

      for (let i = -1; i < numSegments; i++) {
        const y = i * totalHeight + offset; // Positive offset moves down

        // Create gradient for each segment (vertical)
        const gradient = ctx.createLinearGradient(0, y, 0, y + segmentHeight);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'transparent');

        // Draw the line segment
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(centerX, y);
        ctx.lineTo(centerX, y + segmentHeight);
        ctx.stroke();

        // Draw glow effect
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = glowColor;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(centerX, y);
        ctx.lineTo(centerX, y + segmentHeight);
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
  }, [color, glowColor, width, speed, glowIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full"
      style={{ width: `${width * 4}px`, height }}
    />
  );
}
