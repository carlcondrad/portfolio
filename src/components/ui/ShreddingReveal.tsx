import React, { useEffect, useRef, useState } from 'react';

interface ShreddingRevealProps {
  children: React.ReactNode;
  strips?: number;
  className?: string;
}

const ShreddingReveal: React.FC<ShreddingRevealProps> = ({ 
  children, 
  strips = 20,
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || hasTriggered) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger when section is 60% into viewport
      const triggerPoint = windowHeight * 0.6;
      
      if (rect.top <= triggerPoint) {
        setHasTriggered(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTriggered]);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      {/* Shredding strips overlay - only animates once */}
      {!hasTriggered && (
        <div className="absolute inset-0 z-10 pointer-events-none flex">
          {Array.from({ length: strips }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-black"
              style={{
                borderRight: i < strips - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
              }}
            />
          ))}
        </div>
      )}

      {hasTriggered && (
        <div className="absolute inset-0 z-10 pointer-events-none flex">
          {Array.from({ length: strips }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-black"
              style={{
                transform: 'translateY(-100%)',
                transition: `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.03}s`,
                borderRight: i < strips - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
              }}
            />
          ))}
        </div>
      )}

      {/* Content - fades in after shredding */}
      <div 
        className="relative z-0"
        style={{
          opacity: hasTriggered ? 1 : 0,
          transform: hasTriggered ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 1s ease-out 0.4s, transform 1s ease-out 0.4s'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ShreddingReveal;
