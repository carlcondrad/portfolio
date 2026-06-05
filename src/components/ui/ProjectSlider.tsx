import { useState, useEffect, useRef } from 'react';
import Prism from './Prism';
import ShinyText from './ShinyText';

interface Project {
  id: number;
  title: string;
  client: string;
  role: string;
  year: string;
  image: string;
  gallery?: string[];
}

interface ProjectSliderProps {
  projects: Project[];
  onClose?: () => void;
}

export default function ProjectSlider({ projects, onClose }: ProjectSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [showListView, setShowListView] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelTimeoutRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (wheelTimeoutRef.current || isAnimatingRef.current) {
        return;
      }
      
      const direction = e.deltaY > 0 ? 1 : -1;
      
      setCurrentIndex(prevIndex => {
        let newIndex = prevIndex + direction;
        
        // Allow wrapping around
        if (newIndex < 0) {
          newIndex = projects.length - 1;
        } else if (newIndex >= projects.length) {
          newIndex = 0;
        }
        
        return newIndex;
      });
      
      setIsAnimating(true);
      
      wheelTimeoutRef.current = window.setTimeout(() => {
        wheelTimeoutRef.current = null;
        setIsAnimating(false);
      }, 600);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
        if (wheelTimeoutRef.current) {
          window.clearTimeout(wheelTimeoutRef.current);
        }
      };
    }
  }, [projects.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = currentIndex + 1;
        const finalIndex = newIndex >= projects.length ? 0 : newIndex;
        setIsAnimating(true);
        setCurrentIndex(finalIndex);
        setTimeout(() => setIsAnimating(false), 900);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = currentIndex - 1;
        const finalIndex = newIndex < 0 ? projects.length - 1 : newIndex;
        setIsAnimating(true);
        setCurrentIndex(finalIndex);
        setTimeout(() => setIsAnimating(false), 900);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating, projects.length]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart === null || isAnimating) return;
      
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart - touchEnd;
      
      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        const newIndex = currentIndex + direction;
        
        // Allow wrapping around
        let finalIndex = newIndex;
        if (newIndex < 0) {
          finalIndex = projects.length - 1;
        } else if (newIndex >= projects.length) {
          finalIndex = 0;
        }
        
        setIsAnimating(true);
        setCurrentIndex(finalIndex);
        setTimeout(() => setIsAnimating(false), 900);
      }
      
      setTouchStart(null);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentIndex, touchStart, isAnimating, projects.length]);

  const tiltX = (mousePos.x - 0.5) * 4;
  const tiltY = (mousePos.y - 0.5) * -4;
  const panX = (mousePos.x - 0.5) * -18;
  const panY = (mousePos.y - 0.5) * -18;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 100 }}
    >
      {/* Prism Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-[-20px]" style={{ filter: 'blur(8px)' }}>
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={4}
            noise={0}
            glow={1}
          />
        </div>
      </div>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-8 z-30 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors group"
        aria-label="Close projects"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-90 duration-300">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* List View Toggle */}
      <button
        onClick={() => setShowListView(!showListView)}
        className="absolute top-1/2 -translate-y-1/2 left-20 z-30 px-4 py-2 text-white/80 hover:text-white text-xs uppercase tracking-wider transition-all duration-300 relative group"
      >
        {/* Corner brackets - smaller */}
        <span className="absolute -top-2 -left-2 w-2 h-2 border-t border-l border-white/40 group-hover:border-orange-500 transition-colors"></span>
        <span className="absolute -top-2 -right-2 w-2 h-2 border-t border-r border-white/40 group-hover:border-orange-500 transition-colors"></span>
        <span className="absolute -bottom-2 -left-2 w-2 h-2 border-b border-l border-white/40 group-hover:border-orange-500 transition-colors"></span>
        <span className="absolute -bottom-2 -right-2 w-2 h-2 border-b border-r border-white/40 group-hover:border-orange-500 transition-colors"></span>
        
        {showListView ? 'Gallery' : 'List'}
      </button>

      {/* Ambient glow */}
      <div 
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[60vh] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(255, 127, 31, 0.15) 0%, transparent 55%)',
        }}
      />

      {/* Crosshair cursor follower */}
      <div 
        className="absolute w-8 h-8 pointer-events-none z-50 opacity-30 transition-opacity duration-300"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="absolute w-full h-px bg-white/40 top-1/2 -translate-y-1/2"></div>
        <div className="absolute h-full w-px bg-white/40 left-1/2 -translate-x-1/2"></div>
      </div>

      {/* Counter (top-left) */}
      <div className="absolute top-32 left-20 flex items-baseline gap-2 font-bold z-20">
        <span className="text-4xl text-white">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <span className="text-sm text-white/40">/</span>
        <span className="text-sm text-white/40">
          {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      {/* Decorative corners */}
      <div className="absolute inset-16 pointer-events-none z-10">
        <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/20"></span>
        <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/20"></span>
        <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/20"></span>
        <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/20"></span>
      </div>

      {/* Images container */}
      {!showListView && (
        <div 
          className="absolute top-1/2 left-1/2 w-[50vw] h-[58vh] -translate-x-1/2 -translate-y-[55%]"
          style={{ perspective: '1000px' }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{
                transform: index === currentIndex 
                  ? `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`
                  : 'none',
                transition: 'transform 0.1s ease-out, opacity 0.7s ease',
              }}
            >
              {project.image ? (
                <>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setShowFullImage(true)}
                    style={{
                      transform: index === currentIndex 
                        ? `translate(${panX}px, ${panY}px) scale(1.08)`
                        : 'scale(1.08)',
                      transition: 'transform 0.1s ease-out',
                    }}
                  />
                  {/* View Full Image button */}
                  {index === currentIndex && (
                    <button
                      onClick={() => setShowFullImage(true)}
                      className="absolute top-6 right-6 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 z-20 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View Full Image
                    </button>
                  )}
                </>
              ) : (
                // Coming Soon placeholder
                <div 
                  className="w-full h-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 127, 31, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
                    transform: index === currentIndex 
                      ? `translate(${panX}px, ${panY}px) scale(1.08)`
                      : 'scale(1.08)',
                    transition: 'transform 0.1s ease-out',
                  }}
                >
                  {/* Grid pattern */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255, 127, 31, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 127, 31, 0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '50px 50px',
                    }}
                  />
                  <div className="text-white/40 text-6xl font-black uppercase tracking-wider">
                    Coming Soon
                  </div>
                </div>
              )}
              {/* Holographic border */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(255, 127, 31, 0.2)',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Title */}
      {!showListView && (
        <div className="absolute bottom-[12vh] left-0 right-0 text-center z-20 pointer-events-none px-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ${
                index === currentIndex 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                position: index === currentIndex ? 'relative' : 'absolute',
                height: 'clamp(3.5rem, 9vw, 12rem)',
              }}
            >
              <h2 
                className="font-black uppercase tracking-tight"
                style={{
                  fontSize: 'clamp(3.5rem, 9vw, 12rem)',
                  fontFamily: '"Impact", "Arial Black", "Helvetica Neue", Arial, sans-serif',
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                }}
              >
                <ShinyText
                  text={project.title}
                  speed={3}
                  delay={0.5}
                  color="#8B4513"
                  shineColor="#FF8C00"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </h2>
            </div>
          ))}
        </div>
      )}

      {/* Underline */}
      {!showListView && (
        <div 
          className="absolute bottom-[calc(12vh-0.5rem)] left-1/2 -translate-x-1/2 w-[60vw] h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent z-20"
        />
      )}

      {/* Info (bottom-left) */}
      {!showListView && (
        <div className="absolute bottom-4 left-14 z-20">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`transition-all duration-500 ${
                index === currentIndex 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 absolute'
              }`}
              style={{ position: index === currentIndex ? 'relative' : 'absolute' }}
            >
              <p className="text-white text-sm font-medium uppercase tracking-wider">
                {project.client}
              </p>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                {project.role}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Year (bottom-right) */}
      {!showListView && (
        <div className="absolute bottom-6 right-14 z-20">
          {projects.map((project, index) => (
            <span
              key={project.id}
              className={`text-white/60 text-sm font-medium tracking-wider transition-all duration-500 ${
                index === currentIndex 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 absolute'
              }`}
              style={{ position: index === currentIndex ? 'relative' : 'absolute' }}
            >
              {project.year}
            </span>
          ))}
        </div>
      )}

      {/* Dial indicator (right) */}
      {!showListView && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 h-60 w-12 overflow-hidden z-20">
          <div 
            className="flex flex-col items-end gap-1.5 transition-transform duration-700"
            style={{
              transform: `translateY(${currentIndex * -56}px)`,
            }}
          >
            {Array.from({ length: 120 }).map((_, i) => (
              <span
                key={i}
                className="block h-px"
                style={{
                  width: i % 8 === 0 ? '40px' : i % 4 === 0 ? '26px' : '16px',
                  opacity: i % 8 === 0 ? 0.6 : i % 4 === 0 ? 0.35 : 0.18,
                  background: i % 8 === 0 ? '#FF7F1F' : 'white',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll hint */}
      {!showListView && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs uppercase tracking-widest z-20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-70">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Scroll</span>
        </div>
      )}

      {/* List View */}
      {showListView && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-20 overflow-hidden">
          <div className="w-full max-w-6xl">
            <div className="space-y-1">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowListView(false);
                  }}
                  onMouseEnter={() => setCurrentIndex(index)}
                  className="w-full group relative"
                >
                  <div className="flex items-center justify-between py-8 border-b border-white/10 hover:border-orange-500/40 transition-all duration-300">
                    {/* Number */}
                    <span className="text-white/40 text-2xl font-bold w-20 group-hover:text-orange-500 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    {/* Title */}
                    <h3 
                      className="flex-1 text-left text-4xl md:text-6xl font-black uppercase text-white/80 group-hover:text-white transition-all duration-300 group-hover:translate-x-4"
                      style={{
                        fontFamily: '"Titan One", "Fredoka", "Righteous", cursive',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {project.title}
                    </h3>
                    
                    {/* Info */}
                    <div className="text-right w-64 hidden md:block">
                      <p className="text-white/60 text-sm uppercase tracking-wider">
                        {project.client}
                      </p>
                      <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
                        {project.year}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="ml-8 text-white/40 group-hover:text-orange-500 group-hover:translate-x-2 transition-all"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  {/* Hover image preview - Fixed positioning */}
                  {project.image && (
                    <div 
                      className="fixed top-1/2 right-20 -translate-y-1/2 w-[500px] h-[350px] rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50"
                      style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      }}
                    >
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Orange border glow */}
                      <div 
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          boxShadow: 'inset 0 0 0 2px rgba(255, 127, 31, 0.4)',
                        }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Lightbox with Gallery */}
      {showFullImage && projects[currentIndex]?.image && (
        <div 
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-8"
          onClick={() => {
            setShowFullImage(false);
            setGalleryIndex(0);
          }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setShowFullImage(false);
              setGalleryIndex(0);
            }}
            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors group z-10"
            aria-label="Close full image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-90 duration-300">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Gallery Navigation - Left Arrow */}
          {projects[currentIndex].gallery && projects[currentIndex].gallery!.length > 1 && galleryIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex(prev => Math.max(0, prev - 1));
              }}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors group z-10"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:-translate-x-1 transition-transform">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* Gallery Navigation - Right Arrow */}
          {projects[currentIndex].gallery && projects[currentIndex].gallery!.length > 1 && galleryIndex < projects[currentIndex].gallery!.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex(prev => Math.min(projects[currentIndex].gallery!.length - 1, prev + 1));
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors group z-10"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* Full image */}
          <img
            src={projects[currentIndex].gallery ? projects[currentIndex].gallery![galleryIndex] : projects[currentIndex].image}
            alt={`${projects[currentIndex].title} - Image ${galleryIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 25px 100px rgba(0,0,0,0.5)',
            }}
          />

          {/* Image info */}
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-2xl font-bold mb-2">{projects[currentIndex].title}</h3>
            <p className="text-white/60 text-sm">
              {projects[currentIndex].client} · {projects[currentIndex].year}
              {projects[currentIndex].gallery && ` · ${galleryIndex + 1} of ${projects[currentIndex].gallery.length}`}
            </p>
          </div>

          {/* Hint */}
          <div className="absolute bottom-8 right-8 text-white/40 text-xs uppercase tracking-wider">
            {projects[currentIndex].gallery && projects[currentIndex].gallery!.length > 1 
              ? 'Use arrows to navigate · Click to close' 
              : 'Click anywhere to close'}
          </div>
        </div>
      )}
    </div>
  );
}
