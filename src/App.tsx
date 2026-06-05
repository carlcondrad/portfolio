import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lanyard from './components/ui/Lanyard'
import GooeyNav from './components/ui/GooeyNav'
import LightRays from './components/ui/LightRays'
import MetallicPaint from './components/ui/MetallicPaint'
import Noise from './components/ui/Noise'
import ProfileCard from './components/ui/ProfileCard'
import BorderGlow from './components/ui/BorderGlow'
import InfiniteGlowLine from './components/ui/InfiniteGlowLine'
import InfiniteGlowLineVertical from './components/ui/InfiniteGlowLineVertical'
import StarBorder from './components/ui/StarBorder'
import TrueFocus from './components/ui/TrueFocus'
import ProjectSlider from './components/ui/ProjectSlider'

gsap.registerPlugin(ScrollTrigger)

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function App() {
  const [aboutVisible, setAboutVisible] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [isClosingProjects, setIsClosingProjects] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const aboutRef = useRef<HTMLElement>(null);
  const homeRef = useRef<HTMLElement>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: 1,
      title: 'Real Estate',
      client: 'Personal Project',
      role: 'UI/UX Design',
      year: '2026',
      image: '/RealEstate.png',
    },
    {
      id: 2,
      title: 'Coffee Shop',
      client: 'Personal Project',
      role: 'UI/UX Design · Branding',
      year: '2026',
      image: '/SQUINNY.png',
    },
    {
      id: 3,
      title: 'Web Development',
      client: 'Capstone Project',
      role: 'Web Development - OJT MONITORING SYSTEM WITH CHAT SUPPORT FUNCTION',
      year: '2026',
      image: '/Web-Development/Dashboard.jpg',
      gallery: [
        '/Web-Development/Dashboard.jpg',
        '/Web-Development/Admin-dashboard.jpg',
        '/Web-Development/Loginsystem.jpg',
      ]
    },
    {
      id: 4,
      title: 'Coming Soon',
      client: 'TBA',
      role: 'TBA',
      year: '2026',
      image: '',
    },
  ];

  useEffect(() => {
    // Trigger intro animation on mount
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger animation when entering view
          if (entry.isIntersecting) {
            setAboutVisible(true);
          } else {
            // Reset animation when leaving view
            setAboutVisible(false);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  // GSAP Horizontal Scroll Animation for About -> Projects transition
  useEffect(() => {
    if (!aboutRef.current) return;

    const horizontalSections = gsap.utils.toArray('.horizontal-slide-section');
    
    const scrollTween = gsap.to(horizontalSections, {
      xPercent: -100 * (horizontalSections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.horizontal-scroll-container',
        pin: true,
        scrub: 1,
        snap: 1 / (horizontalSections.length - 1),
        end: () => "+=" + (window.innerHeight * 2),
        anticipatePin: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress * 100);
        }
      }
    });

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, []);

  return (
    <div className="relative w-full bg-black text-white overflow-x-hidden" style={{ minHeight: '100vh' }}>
      {/* Light Rays Background - Fixed for entire page */}
      <div className="fixed inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={0.3}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={0.8}
          saturation={0.3}
        />
      </div>

      {/* Noise Grain Overlay - Fixed for entire page */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <Noise
          patternSize={300}
          patternScaleX={2}
          patternScaleY={1}
          patternRefreshInterval={1}
          patternAlpha={15}
        />
      </div>

      {/* Home Section */}
      <section ref={homeRef} id="home" className={`relative w-full h-screen overflow-hidden ${showProjects ? 'hidden' : ''}`}>
        <style>{`
          @keyframes introFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes logoSlideDown {
            from {
              opacity: 0;
              transform: translateY(-60px);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          @keyframes navSlideDown {
            from {
              opacity: 0;
              transform: translateY(-40px) scale(0.9);
              filter: blur(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes myLabelFade {
            from {
              opacity: 0;
              transform: translateY(20px);
              filter: blur(5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          @keyframes portfolioReveal {
            from {
              opacity: 0;
              transform: translateX(-100px) scale(0.9);
              filter: blur(20px);
              letter-spacing: 0.3em;
            }
            to {
              opacity: 0.9;
              transform: translateX(0) scale(1);
              filter: blur(0);
              letter-spacing: 0.02em;
            }
          }

          @keyframes badgePopIn {
            from {
              opacity: 0;
              transform: scale(0) rotate(-180deg);
              filter: blur(8px);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0);
            }
          }

          @keyframes labelSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
              filter: blur(5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          @keyframes lineExpand {
            from {
              opacity: 0;
              transform: scaleX(0);
            }
            to {
              opacity: 1;
              transform: scaleX(1);
            }
          }

          @keyframes lanyardFadeIn {
            from {
              opacity: 0;
              filter: blur(15px);
            }
            to {
              opacity: 1;
              filter: blur(0);
            }
          }

          .intro-logo {
            animation: logoSlideDown 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .intro-nav {
            animation: navSlideDown 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            animation-delay: 0.2s;
            opacity: 0;
          }

          .intro-my-label {
            animation: myLabelFade 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            animation-delay: 0.4s;
            opacity: 0;
          }

          .intro-portfolio {
            animation: portfolioReveal 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            animation-delay: 0.5s;
            opacity: 0;
          }

          .intro-badge {
            animation: badgePopIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            animation-delay: 1.2s;
            opacity: 0;
          }

          .intro-label-left {
            animation: labelSlideIn 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            animation-delay: 1.4s;
            opacity: 0;
          }

          .intro-line {
            animation: lineExpand 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            animation-delay: 1.5s;
            opacity: 0;
            transform-origin: left;
          }

          .intro-label-right {
            animation: labelSlideIn 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            animation-delay: 1.6s;
            opacity: 0;
          }

          .intro-lanyard {
            animation: lanyardFadeIn 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            animation-delay: 0.3s;
            opacity: 0;
          }
        `}</style>

        {/* Navigation Header with Logo and GooeyNav */}
        <div className="absolute top-0 left-0 right-0 z-20 py-4 md:py-8 px-4 md:px-8">
          <div className="flex justify-between items-start">
            {/* Logo on the left */}
            <div className={`w-40 h-12 md:w-56 md:h-16 lg:w-72 lg:h-20 ${introComplete ? 'intro-logo' : ''}`}>
              <MetallicPaint
                imageSrc="/logo.svg"
                seed={42}
                scale={4}
                patternSharpness={1}
                noiseScale={0.5}
                speed={0.3}
                liquid={0.75}
                mouseAnimation={false}
                brightness={2}
                contrast={0.5}
                refraction={0.01}
                blur={0.015}
                chromaticSpread={2}
                fresnel={1}
                angle={0}
                waveAmplitude={1}
                distortion={1}
                contour={0.2}
                lightColor="#ffffff"
                darkColor="#000000"
                tintColor="#feb3ff"
              />
            </div>
            
            {/* Navigation in the center */}
            <div className={`scale-75 sm:scale-90 md:scale-100 ${introComplete ? 'intro-nav' : ''}`}>
              <GooeyNav
                items={navItems}
                particleCount={15}
                particleDistances={[90, 10]}
                particleR={100}
                initialActiveIndex={0}
                animationTime={600}
                timeVariance={300}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              />
            </div>
            
            {/* Empty space on the right for balance */}
            <div className="w-40 h-12 md:w-56 md:h-16 lg:w-72 lg:h-20"></div>
          </div>
        </div>

        {/* Large Portfolio Text with Labels */}
        <div className="absolute left-8 md:left-32 top-1/2 -translate-y-1/2 z-10 max-w-[90vw] md:max-w-none">
          <div className="relative">
            {/* MY Label */}
            <div className={`absolute -top-8 md:-top-12 left-0 pointer-events-none ${introComplete ? 'intro-my-label' : ''}`}>
              <p className="text-white text-sm md:text-lg font-light">MY</p>
            </div>

            {/* Main Portfolio Text with Magnetic Letters */}
            <div className="relative group">
              <style>{`
                .magnetic-letter {
                  display: inline-block;
                  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                  will-change: transform, text-shadow;
                  position: relative;
                }
              `}</style>
              <div 
                className="portfolio-container"
                onMouseMove={(e) => {
                  const container = e.currentTarget;
                  const letters = container.querySelectorAll('.magnetic-letter');
                  const mouseX = e.clientX;
                  const mouseY = e.clientY;

                  letters.forEach((letter) => {
                    const letterRect = letter.getBoundingClientRect();
                    const letterCenterX = letterRect.left + letterRect.width / 2;
                    const letterCenterY = letterRect.top + letterRect.height / 2;
                    
                    const deltaX = mouseX - letterCenterX;
                    const deltaY = mouseY - letterCenterY;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    
                    const maxDistance = 250;
                    const strength = Math.max(0, 1 - distance / maxDistance);
                    
                    if (distance < maxDistance) {
                      // Magnetic movement with stretch
                      const moveX = (deltaX / distance) * strength * 50;
                      const moveY = (deltaY / distance) * strength * 50;
                      const scaleX = 1 + strength * 0.5;
                      const scaleY = 1 - strength * 0.2;
                      const rotate = (deltaX / distance) * strength * 5;
                      (letter as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
                      
                      // Instant glow effect - no transition, appears immediately
                      const glowIntensity = strength * 1.2; // Increased intensity
                      const glowSize = 25 + (glowIntensity * 35);
                      (letter as HTMLElement).style.textShadow = `
                        0 0 ${glowSize * 0.4}px rgba(255, 255, 255, ${glowIntensity * 0.9}),
                        0 0 ${glowSize * 0.8}px rgba(255, 255, 255, ${glowIntensity * 0.7}),
                        0 0 ${glowSize * 1.2}px rgba(255, 255, 255, ${glowIntensity * 0.5}),
                        0 0 ${glowSize * 1.8}px rgba(255, 255, 255, ${glowIntensity * 0.3})
                      `;
                    } else {
                      (letter as HTMLElement).style.transform = 'translate(0px, 0px) scale(1, 1) rotate(0deg)';
                      (letter as HTMLElement).style.textShadow = 'none';
                    }
                  });
                }}
                onMouseLeave={(e) => {
                  const letters = e.currentTarget.querySelectorAll('.magnetic-letter');
                  
                  letters.forEach((letter) => {
                    (letter as HTMLElement).style.transform = 'translate(0px, 0px) scale(1, 1) rotate(0deg)';
                    (letter as HTMLElement).style.textShadow = 'none';
                  });
                }}
              >
                {/* Portfolio text with magnetic letters and glow */}
                <h1 
                  className={`text-5xl sm:text-7xl md:text-8xl lg:text-[12rem] font-black leading-none text-white/90 cursor-default relative z-[1] ${introComplete ? 'intro-portfolio' : ''}`}
                  style={{ 
                    fontFamily: '"Titan One", "Fredoka", "Righteous", cursive',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {'PORTFOLIO'.split('').map((letter, index) => (
                    <span 
                      key={index} 
                      className="magnetic-letter"
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>

              {/* Year Badge */}
              <div className={`absolute -top-2 md:-top-4 right-0 bg-orange-500 px-3 py-1 md:px-6 md:py-2 rounded-full pointer-events-none ${introComplete ? 'intro-badge' : ''}`}>
                <span className="text-black font-bold text-sm md:text-xl">2026</span>
              </div>
            </div>

            {/* Bottom Labels */}
            <div className="flex justify-between items-center mt-2 md:mt-4 pointer-events-none">
              <p className={`text-white text-xs md:text-lg font-light ${introComplete ? 'intro-label-left' : ''}`}>UI/UX Design</p>
              <div className={`flex-1 mx-4 md:mx-8 ${introComplete ? 'intro-line' : ''}`}>
                <InfiniteGlowLine
                  color="#ffffff"
                  glowColor="#ffffff"
                  height={1}
                  speed={3}
                  glowIntensity={15}
                />
              </div>
              <p className={`text-white text-xs md:text-lg font-light ${introComplete ? 'intro-label-right' : ''}`}>Carl Condrad</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Mouse Icon */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative w-6 h-9 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5 hover:border-white/60 transition-all duration-300 cursor-pointer"
            aria-label="Scroll down"
          >
            {/* Scroll wheel indicator */}
            <div className="w-0.5 h-1.5 bg-orange-500 rounded-full animate-scroll-wheel"></div>
          </button>
          
          <style>{`
            @keyframes scroll-wheel {
              0% {
                opacity: 1;
                transform: translateY(0);
              }
              50% {
                opacity: 0.5;
                transform: translateY(6px);
              }
              100% {
                opacity: 0;
                transform: translateY(9px);
              }
            }
            
            .animate-scroll-wheel {
              animation: scroll-wheel 1.5s ease-in-out infinite;
            }
          `}</style>
        </div>

        {/* Lanyard Component */}
        <div className="absolute inset-0 z-[5]">
          <Lanyard position={[0, 0, 12]} gravity={[0, -40, 0]} fov={35} />
        </div>
      </section>

      {/* Horizontal Scroll Container - About & View Projects */}
      <div className={`horizontal-scroll-container relative w-full overflow-hidden ${showProjects ? 'hidden' : ''}`}>
        <div className="flex w-[200vw]">
          {/* About Me Section - Slide 1 */}
          <section 
            ref={aboutRef}
            id="about" 
            className="horizontal-slide-section relative w-screen h-screen flex-shrink-0 flex items-center justify-center px-4 md:px-8 overflow-y-auto"
            style={{ perspective: '2000px' }}
          >
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.98);
              filter: blur(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px) rotateY(-8deg);
              filter: blur(3px);
            }
            to {
              opacity: 1;
              transform: translateX(0) rotateY(0deg);
              filter: blur(0);
            }
          }

          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(50px) rotateY(8deg);
              filter: blur(3px);
            }
            to {
              opacity: 1;
              transform: translateX(0) rotateY(0deg);
              filter: blur(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.85) rotateZ(-2deg);
              filter: blur(5px) brightness(0.7);
            }
            to {
              opacity: 1;
              transform: scale(1) rotateZ(0deg);
              filter: blur(0) brightness(1);
            }
          }

          @keyframes lineGrow {
            from {
              height: 0;
              opacity: 0;
              filter: blur(2px);
            }
            to {
              height: 22rem;
              opacity: 1;
              filter: blur(0);
            }
          }

          @keyframes titleReveal {
            from {
              opacity: 0;
              transform: translateX(60px) scale(0.95);
              filter: blur(6px);
              letter-spacing: 0.2em;
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
              filter: blur(0);
              letter-spacing: normal;
            }
          }

          @keyframes skillPop {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.9);
              filter: blur(2px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes glowPulse {
            0%, 100% {
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1);
            }
            50% {
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1);
            }
          }

          @keyframes sectionFadeIn {
            from {
              opacity: 0;
              transform: translateY(60px) scale(0.95);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes homeFadeIn {
            from {
              opacity: 0;
              transform: translateY(-60px) scale(0.95);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 1.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .animate-fade-in-left {
            animation: fadeInLeft 1.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .animate-fade-in-right {
            animation: fadeInRight 1.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .animate-scale-in {
            animation: scaleIn 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .animate-line-grow {
            animation: lineGrow 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .animate-title-reveal {
            animation: titleReveal 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .animate-skill-pop {
            animation: skillPop 1.2s cubic-bezier(0.25, 1, 0.3, 1) forwards;
          }

          .animate-glow-pulse {
            animation: glowPulse 3s ease-in-out infinite;
          }

          .animate-section-fade-in {
            animation: sectionFadeIn 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .animate-home-fade-in {
            animation: homeFadeIn 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          /* Smooth transition for reset */
          .opacity-0 {
            transition: opacity 0.3s ease-out;
          }
        `}</style>

        <div ref={aboutRef} className={`relative z-10 w-full max-w-6xl mx-auto sticky top-0 ${aboutVisible ? 'animate-section-fade-in' : 'opacity-0'}`}>
          <div ref={aboutContentRef} style={{ transformStyle: 'preserve-3d' }}>
            {/* About Me Title - Centered and Large */}
            <TrueFocus
              sentence="About Me"
              separator=" "
              manualMode={false}
              blurAmount={5}
              borderColor="#FF7F1F"
              glowColor="rgba(255, 127, 31, 0.6)"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white text-center mb-12 md:mb-16"
              style={{
                fontFamily: '"Titan One", "Fredoka", "Righteous", cursive',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                perspective: '1000px',
              }}
            />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-8 lg:gap-12">
            {/* Profile Card */}
            <div 
              className={`flex-shrink-0 ${aboutVisible ? 'animate-scale-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.1s' }}
            >
              <ProfileCard
                name="Carl Condrad"
                title="UI/UX Designer"
                handle="carlcondrad"
                status="Available for work"
                contactText="Contact Me"
                avatarUrl="/main.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                behindGlowEnabled={true}
                onContactClick={() => console.log('Contact clicked')}
              />
            </div>

            {/* Vertical Line Separator */}
            <div 
              className={`hidden lg:flex items-center justify-center ${aboutVisible ? 'animate-line-grow' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s', height: '22rem' }}
            >
              <InfiniteGlowLineVertical
                color="#ffffff"
                glowColor="#ffffff"
                width={1}
                speed={3}
                glowIntensity={15}
                height="22rem"
              />
            </div>

            {/* About Content */}
            <div className="flex-1 text-white w-full lg:max-w-xl">
              <div className="space-y-3 text-base md:text-lg text-white/80 leading-relaxed">
                <p 
                  className={`${aboutVisible ? 'animate-fade-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.4s', perspective: '1000px' }}
                >
                  Hi! I'm Carl Condrad, a professional Front-End Developer passionate about creating visually compelling and user-centered digital experiences.
                </p>
                <p 
                  className={`${aboutVisible ? 'animate-fade-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.55s', perspective: '1000px' }}
                >
                  With a strong eye for detail and a focus on clean, modern design, I specialize in developing intuitive interfaces that combine aesthetics with functionality to deliver seamless user experiences.
                </p>
                <p 
                  className={`${aboutVisible ? 'animate-fade-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.7s', perspective: '1000px' }}
                >
                  In addition to front-end development, I work as a UI/UX Designer, Graphic Designer, and Video Editor, bringing creative concepts to life through responsive web development, compelling visual design, and engaging visual storytelling.
                </p>
                <p 
                  className={`${aboutVisible ? 'animate-fade-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.85s', perspective: '1000px' }}
                >
                  I am committed to using design and development as strategic tools to solve problems, enhance usability, and create meaningful connections between users and technology.
                </p>
              </div>

              {/* Skills */}
              <div 
                className={`mt-6 ${aboutVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '1s' }}
              >
                <h3 className="text-xl font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {['UI Design', 'UX Research', 'Graphic Design', 'Prototyping', 'Figma', 'Adobe XD', 'Front-End Development', 'React', 'WordPress', 'Webflow', 'Video Editing'].map((skill, index) => (
                    <div
                      key={skill}
                      className={`${aboutVisible ? 'animate-skill-pop' : 'opacity-0'}`}
                      style={{ 
                        animationDelay: `${1.15 + index * 0.06}s`,
                        perspective: '1000px'
                      }}
                    >
                      <BorderGlow
                        edgeSensitivity={30}
                        glowColor="200 80 70"
                        backgroundColor="rgba(0, 0, 0, 0.3)"
                        borderRadius={20}
                        glowRadius={20}
                        glowIntensity={0.8}
                        coneSpread={25}
                        animated={false}
                        colors={['#c084fc', '#f472b6', '#38bdf8']}
                        fillOpacity={0.3}
                      >
                        <span className="px-4 py-2 text-sm font-medium block">
                          {skill}
                        </span>
                      </BorderGlow>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>

        </div>
      </section>

          {/* View Projects Section - Slide 2 */}
          <section 
            className="horizontal-slide-section relative w-screen h-screen flex-shrink-0 flex items-center justify-center px-8"
          >
            {/* Image on the left side - Show on all screen sizes but smaller on mobile */}
            <div className="absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-96 lg:w-[32rem] xl:w-[40rem] opacity-60 md:opacity-80 hover:opacity-100 transition-opacity duration-300">
              <style>{`
                @keyframes float {
                  0%, 100% {
                    transform: scaleX(-1) translateY(0px);
                  }
                  50% {
                    transform: scaleX(-1) translateY(-20px);
                  }
                }
              `}</style>
              <img 
                src="/image-removebg-preview.png" 
                alt="Project illustration"
                className="w-full h-auto object-contain"
                style={{
                  filter: 'brightness(0) invert(1)',
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
            </div>

            {/* Center content */}
            <div className="flex flex-col items-center justify-center z-10 px-4 ml-auto mr-auto md:ml-0 md:mr-0 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight">
                Are you done enough reading?
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 text-center mb-6 sm:mb-8 md:mb-12">
                Let's go to my projects
              </p>
              <button
                onClick={() => setShowProjects(true)}
                className="group relative px-6 py-3 md:px-8 md:py-4 text-base sm:text-lg md:text-xl font-bold uppercase tracking-wider text-white overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 md:gap-3">
                  View Projects
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-2 transition-transform sm:w-5 sm:h-5 md:w-6 md:h-6">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                {/* Animated border */}
                <span className="absolute inset-0 border-2 border-orange-500 rounded-lg"></span>
                {/* Hover background */}
                <span className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg -z-10"></span>
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Projects Slider - Full Screen */}
      {showProjects && (
        <div 
          className={`fixed inset-0 z-[100] ${isClosingProjects ? 'animate-fade-out' : 'animate-fade-in'}`}
        >
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            @keyframes fadeOut {
              from {
                opacity: 1;
                transform: scale(1);
              }
              to {
                opacity: 0;
                transform: scale(0.95);
              }
            }
            
            .animate-fade-in {
              animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            .animate-fade-out {
              animation: fadeOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <ProjectSlider 
            projects={projects} 
            onClose={() => {
              setIsClosingProjects(true);
              setTimeout(() => {
                setShowProjects(false);
                setIsClosingProjects(false);
              }, 300);
            }} 
          />
        </div>
      )}

      {/* Remove old Projects Section Trigger */}
      {/* Remove old Projects Section Trigger */}

      {/* Scroll Progress Indicator - Always visible in horizontal scroll sections */}
      {!showProjects && scrollProgress > 0 && (
        <div className="fixed bottom-4 md:bottom-8 left-0 right-0 z-50 pointer-events-none">
          <div className="flex items-center justify-between px-4 md:px-12">
            {/* Left side - SCROLL text */}
            <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-medium">
              Scroll
            </span>

            {/* Center - Progress bar with gradient */}
            <div className="flex-1 mx-4 md:mx-12 h-[1.5px] md:h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              {/* Background glow */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[6px] md:h-[8px] blur-md transition-all duration-300 ease-out"
                style={{ 
                  width: `${scrollProgress}%`,
                  background: 'linear-gradient(90deg, #FF7F1F 0%, #F97316 50%, #FF8C00 100%)'
                }}
              />
              {/* Solid progress line */}
              <div 
                className="absolute left-0 top-0 h-full transition-all duration-300 ease-out rounded-full"
                style={{ 
                  width: `${scrollProgress}%`,
                  background: 'linear-gradient(90deg, #FF7F1F 0%, #F97316 50%, #FF8C00 100%)'
                }}
              />
            </div>

            {/* Right side - Progress percentage */}
            <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-medium min-w-[30px] md:min-w-[40px] text-right">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      <section className="relative w-full flex items-center justify-center px-4 md:px-8 py-0">
      </section>
    </div>
  )
}

export default App
