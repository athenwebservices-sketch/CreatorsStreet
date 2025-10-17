'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { AlignCenter } from 'lucide-react';
import ExperienceZones from '../components/ExperienceZones';
import Gallery from '../components/Galley';
import Navbar from '../components/Navbar';
import Awards from '../components/Awards';
import Cosplay from '../components/Cosplay';
import Tickets from '../components/Tickets';
import Leaders from '../components/Leaders';
import Social from '../components/Social';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

export default function Home() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeYear, setActiveYear] = useState('2025');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedYear, setSelectedYear] = useState('2025');
  const [fluidColors, setFluidColors] = useState([
    'rgba(250, 204, 21, 0.4)',
    'rgba(236, 72, 153, 0.4)',
    'rgba(59, 130, 246, 0.4)',
    'rgba(34, 197, 94, 0.4)'
  ]);
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const isClient = typeof window !== 'undefined';
  
  // Show or hide the button based on scroll position
  const handleResize = () => {
    if (isClient) {
      setIsMobile(window.innerWidth <= 640); // Adjust based on your breakpoint
    }
  };

  // Handle scroll position
  const handleScroll = () => {
    if (isClient && window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      // Set initial mobile state
      setIsMobile(window.innerWidth <= 640);

      // Listen to window resize and scroll events
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);

      // Cleanup event listeners on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isClient]); // Empty dependency array ensures this runs once after mount

  // Scroll to top function
  const scrollToTop = () => {
    if (isClient) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  // Gallery slides data
  const gallerySlides = [
   
  ];

  // Experience zones data
  const experienceZones = [{
    name: "Comic Street",
    color: "#FFC107",
    description: "Publishers, Comics, Manga, Webtoons, Graphic Novels",
    image: "/2024/4.png"  // Replace with your image URL
  }];

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse movement for custom cursor and fluid background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % gallerySlides.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, gallerySlides.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % gallerySlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + gallerySlides.length) % gallerySlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentSlide(0);
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom Cursor */}
      <div
        className="fixed w-8 h-8 pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: cursorPosition.x - 16,
          top: cursorPosition.y - 16,
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#a855f7" strokeWidth="2" fill="none" />
          <circle cx="16" cy="16" r="8" fill="#7c3aed" />
        </svg>
      </div>

      {/* Navbar Component */}
      <Navbar  />

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed right-4 bottom-16 bg-yellow-400 text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-yellow-500 z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7-7-7 7" />
          </svg>
        </button>
      )}

      {/* Hero Section - Now using the imported Hero component */}
      <Hero 
        isHovering={isHovering} 
        setIsHovering={setIsHovering} 
        mousePosition={mousePosition} 
        fluidColors={fluidColors} 
        currentColorIndex={currentColorIndex} 
      />

      {/* Awards Section - Now using the imported Awards component */}
      <Awards isHovering={isHovering} setIsHovering={setIsHovering} />

      {/* Leaders Section - Now using the imported Leaders component */}
      <Leaders isHovering={isHovering} setIsHovering={setIsHovering} />

      {/* Cosplay Section - Now using the imported Cosplay component */}
      <Cosplay isHovering={isHovering} setIsHovering={setIsHovering} />

      {/* Interactive Experience Zones Section */}
      <ExperienceZones />

      {/* Gallery Section - Now using the imported Gallery component */}
      <Gallery />

      {/* Tickets Section - Now using the imported Tickets component */}
      <Tickets isHovering={isHovering} setIsHovering={setIsHovering} />

      {/* Social Section - Now using the imported Social component */}
      <Social isHovering={isHovering} setIsHovering={setIsHovering} />

      {/* Footer Section - Now using the imported Footer component */}
      <Footer isHovering={isHovering} setIsHovering={setIsHovering} />

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        body {
          cursor: none;
        }
        
        a, button, input, textarea, select {
          cursor: none;
        }
        
        * {
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
      `}</style>
    </div>
  );
}