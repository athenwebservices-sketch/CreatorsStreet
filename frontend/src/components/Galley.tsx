'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Gallery: React.FC = () => {
  const [galleryYear, setGalleryYear] = useState('2025');
  const [gallerySlideIndex, setGallerySlideIndex] = useState(0);
  const [galleryIsHovering, setGalleryIsHovering] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const isClient = typeof window !== 'undefined';
  const THUMBNAILS_VISIBLE = 4;

  const galleryData = {
    '2024': [
      { title: 'Panel Discussion', description: 'Snowy mountains and cozy vibes', image: '/2024/1.png' },
      { title: 'Discussion Long', description: 'Snowy mountains and cozy vibes', image: '/2024/2.png' },
      { title: 'Guests of Honor', description: 'Snowy mountains and cozy vibes', image: '/2024/3.png' },
      { title: 'Prashanth Varma', description: 'Snowy mountains and cozy vibes', image: '/2024/4.png' },
      { title: 'Stall Sale', description: 'Snowy mountains and cozy vibes', image: '/2024/5.png' },
      { title: 'Old Man', description: 'Snowy mountains and cozy vibes', image: '/2024/6.png' },
      { title: 'Old Man Award', description: 'Snowy mountains and cozy vibes', image: '/2024/7.png' },
      { title: 'All Awards', description: 'Snowy mountains and cozy vibes', image: '/2024/8.png' },
    ],
    '2025': [
      { title: 'Award Presentation', description: 'Snowy mountains and cozy vibes', image: '/2025/9.png' },
      { title: 'Presenting Check', description: 'Snowy mountains and cozy vibes', image: '/2025/10.png' },
      { title: 'Character', description: 'Snowy mountains and cozy vibes', image: '/2025/11.png' },
      { title: 'Character 2', description: 'Snowy mountains and cozy vibes', image: '/2025/12.png' },
      { title: 'Championship', description: 'Snowy mountains and cozy vibes', image: '/2025/13.png' },
      { title: 'Batman', description: 'Snowy mountains and cozy vibes', image: '/2025/14.png' },
      { title: 'Ironman', description: 'Snowy mountains and cozy vibes', image: '/2025/15.png' },
    ],
  };

  const gallerySlides = galleryData[galleryYear];

  const handleResize = () => {
    if (isClient) {
      setIsMobile(window.innerWidth <= 640);
    }
  };

  useEffect(() => {
    if (isClient) {
      setIsMobile(window.innerWidth <= 640);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isClient]);

  useEffect(() => {
    const newStartIndex = Math.min(
      Math.max(0, gallerySlideIndex - Math.floor(THUMBNAILS_VISIBLE / 2)),
      gallerySlides.length - THUMBNAILS_VISIBLE
    );
    setThumbnailStartIndex(newStartIndex);
  }, [gallerySlideIndex, galleryYear]);

  const handleGalleryPrev = () => {
    setGallerySlideIndex((prev) => (prev === 0 ? gallerySlides.length - 1 : prev - 1));
  };

  const handleGalleryNext = () => {
    setGallerySlideIndex((prev) => (prev === gallerySlides.length - 1 ? 0 : prev + 1));
  };

  const handleGallerySlideChange = (index: number) => {
    setGallerySlideIndex(index);
  };

  const handleGalleryYearChange = (year: string) => {
    setGalleryYear(year);
    setGallerySlideIndex(0);
  };

  const handleThumbnailScrollLeft = () => {
    setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleThumbnailScrollRight = () => {
    setThumbnailStartIndex((prev) => Math.min(prev + 1, gallerySlides.length - THUMBNAILS_VISIBLE));
  };

  return (
    <section id="Events" className="relative bg-gradient-to-br from-[#3c0052] to-[#3c0052] py-16 sm:py-12">
      <div className="relative z-10 container mx-auto px-6 sm:px-4 lg:px-12 max-w-full sm:max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-10">Past Events</h2>

        {/* Year Selector */}
        <div className="flex justify-center space-x-4 mb-12">
          {['2024', '2025'].map((year) => (
            <button
              key={year}
              onClick={() => handleGalleryYearChange(year)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${galleryYear === year
                ? 'bg-yellow-400 text-black shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-full sm:max-w-3xl">
          <div className="relative mb-8">
            {/* Image Container */}
            <div className={`w-full relative overflow-hidden rounded-xl transition-all duration-300 ${galleryIsHovering ? 'scale-105' : ''} 
              ${isMobile ? 'h-auto' : 'h-[400px] sm:h-[500px] md:h-[600px]'}`}
            >
              <img
                src={gallerySlides[gallerySlideIndex].image}
                alt={gallerySlides[gallerySlideIndex].title}
                className="w-full h-full object-cover sm:object-contain transition-all duration-300"
                onMouseEnter={() => setGalleryIsHovering(true)}
                onMouseLeave={() => setGalleryIsHovering(false)}
              />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handleGalleryPrev}
              className="absolute left-4 sm:left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-2 rounded-full hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg z-10"
              onMouseEnter={() => setGalleryIsHovering(true)}
              onMouseLeave={() => setGalleryIsHovering(false)}
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleGalleryNext}
              className="absolute right-4 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-2 rounded-full hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg z-10"
              onMouseEnter={() => setGalleryIsHovering(true)}
              onMouseLeave={() => setGalleryIsHovering(false)}
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail Carousel */}
          <div className="flex items-center mb-8 space-x-2">
            <button
              onClick={handleThumbnailScrollLeft}
              className="bg-white/10 text-white hover:bg-white/20 p-2 rounded-full"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0 flex-1 overflow-hidden">
              {gallerySlides
                .slice(thumbnailStartIndex, thumbnailStartIndex + THUMBNAILS_VISIBLE)
                .map((slide, index) => {
                  const realIndex = index + thumbnailStartIndex;
                  return (
                    <div
                      key={realIndex}
                      onClick={() => handleGallerySlideChange(realIndex)}
                      className={`aspect-video overflow-hidden cursor-pointer transition-all duration-300 ${gallerySlideIndex === realIndex
                        ? 'scale-105'
                        : 'opacity-60 hover:opacity-100'
                        } rounded-lg`}
                      onMouseEnter={() => setGalleryIsHovering(true)}
                      onMouseLeave={() => setGalleryIsHovering(false)}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  );
                })}
            </div>

            <button
              onClick={handleThumbnailScrollRight}
              className="bg-white/10 text-white hover:bg-white/20 p-2 rounded-full"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {gallerySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleGallerySlideChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${gallerySlideIndex === index
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                onMouseEnter={() => setGalleryIsHovering(true)}
                onMouseLeave={() => setGalleryIsHovering(false)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
