// projects.js

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

// ============ Styled Components (CSS-in-JS) ===================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 🔹 Main Container with dark gradient background
const GalleryContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #0b0b0b 0%, #000 100%);
  color: #f5f5f5;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  position: relative;
  flex-direction: row;
  overflow-x: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
  }
`;

const SideNav = styled.nav`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 15, 15, 0.9);
  padding: 20px;
  border-radius: 10px;
  z-index: 100;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      justify-items: center;
    }

    @media (max-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  li {
    margin: 10px 0;
    cursor: pointer;
    color: #ddd;
    font-weight: 500;
    transition: color 0.3s, transform 0.3s;

    &:hover {
      color: #ff6b6b;
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      text-align: center;
      padding: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 5px;
      width: 100%;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 768px) {
    position: static;
    transform: none;
    width: 100%;
    border-radius: 0;
  }
`;

const GalleryContent = styled.main`
  flex: 1;
  margin-left: 220px;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 0;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 60px;

  h1 {
    font-size: 3.5rem;
    margin-bottom: 20px;
    color: #fff;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  }

  p {
    font-size: 1.2rem;
    color: #bbb;
  }
`;

const EventsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const EventSection = styled.section`
  margin-bottom: 80px;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeInUp} 0.6s ease forwards;

  h2 {
    font-size: 2rem;
    margin-bottom: 30px;
    color: #fff;
    text-align: center;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    display: inline-block;
    padding-bottom: 5px;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.8rem;
    }
  }
`;

const EventGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    width: 80%;
    margin: 0 10%;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Lightbox Styles
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(6px);
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 10px;
  }

  .caption {
    color: #fff;
    margin-top: 10px;
    text-align: center;
    font-size: 1rem;
    opacity: 0.85;
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  transform: translateY(-50%);
  z-index: 1001;

  &.prev {
    left: 20px;
  }
  &.next {
    right: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

// ============ Lightbox Component =============
const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  if (!images.length) return null;
  return (
    <LightboxOverlay onClick={onClose}>
      <LightboxContent onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex].src} alt={images[currentIndex].caption} />
        <div className="caption">{images[currentIndex].caption}</div>
        <NavButton className="prev" onClick={onPrev}>
          ❮
        </NavButton>
        <NavButton className="next" onClick={onNext}>
          ❯
        </NavButton>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </LightboxContent>
    </LightboxOverlay>
  );
};

// =================== Main Gallery Component ====================
const Gallery = () => {
  const events = [
    {
      id: "comicstreet",
      title: "Comic Street Hyderabad – 2025",
      folderPath: "comicstreet",
      images: Array.from({ length: 20 }, (_, i) => `comicstreet-${i + 1}.jpg`),
    },
    {
      
      id: "gafx",
      title: "GAFX Bengaluru – 2025",
      folderPath: "gafx",
      images: Array.from({ length: 14 }, (_, i) => `gafx-${i + 1}.jpg`),
    },
    {
      id: "iit-madras",
      title: "IIT Madras – 2025",
      folderPath: "iit-madras",
      images: Array.from({ length: 4 }, (_, i) => `iit-madras-${i + 1}.jpg`),
    },
    {
      id: "indiajoy",
      title: "India Joy Hyderabad – 2024",
      folderPath: "indiajoy",
      images: Array.from({ length: 6 }, (_, i) => `indiajoy-${i + 1}.jpg`),
    },
    {
      id: "tie",
      title: "TIE Global Summit Bengaluru – 2024",
      folderPath: "tie",
      images: Array.from({ length: 7 }, (_, i) => `tie-${i + 1}.jpg`),
    },
  ];

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const openLightbox = (eventId, imgIndex) => {
    const currentEvent = events.find((e) => e.id === eventId);
    if (!currentEvent) return;

    const imgs = currentEvent.images.map((img) => ({
      src: `assets/gallery/${currentEvent.folderPath}/${img}`,
      caption: `${currentEvent.title} - ${img}`,
    }));

    setLightboxImages(imgs);
    setCurrentIndex(imgIndex);
    setIsLightboxOpen(true);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? lightboxImages.length - 1 : prev - 1
    );
  };

  return (
    <GalleryContainer>
      <SideNav>
        <ul>
          {events.map((e) => (
            <li key={e.id} onClick={() => scrollToSection(e.id)}>
              {e.title}
            </li>
          ))}
        </ul>
      </SideNav>

      <GalleryContent>
        <HeroSection>
          <h1>OUR GALLERY</h1>
          <p>Explore our journey through events</p>
        </HeroSection>

        <EventsContainer>
          {events.map((event) => (
            <EventSection id={event.id} key={event.id}>
              <h2>{event.title}</h2>
              <EventGallery>
                {event.images.map((img, index) => (
                  <GalleryItem
                    key={index}
                    onClick={() => openLightbox(event.id, index)}
                  >
                    <img
                      src={`assets/gallery/${event.folderPath}/${img}`}
                      alt={img}
                      loading="lazy"
                    />
                  </GalleryItem>
                ))}
              </EventGallery>
            </EventSection>
          ))}
        </EventsContainer>
      </GalleryContent>

      {isLightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={currentIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </GalleryContainer>
  );
};

export default Gallery;



