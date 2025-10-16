// src/components/ExperienceZones.tsx

import React, { useState } from 'react';

interface Zone {
  name: string;
  description: string;
  color: string;
  image: string;
}

interface ExperienceZonesProps {
  experienceZones: Zone[];
}
const temp = [
  {
    name: "Comic Street",
    color: "#FFC107",
    description: "Publishers, Comics, Manga, Webtoons, Graphic Novels",
    image: "/2024/4.png"  // Replace with your image URL
  },
  {
    name: "Anime Street",
    color: "#F44336",
    description: "Anime Studios, Screenings, Merchandise",
    image: "/coming_soon.jpg"  // Replace with your image URL
  },
  {
    name: "Play Street",
    color: "#00BCD4",
    description: "Gaming, Board Games, Esports, AR/VR Fan Zones",
    image: "/coming_soon.jpg"  // Replace with your image URL
  },
  {
    name: "Innovation Street",
    color: "#4CAF50",
    description: "Blockchain, AI, Creator Economy, Startups & Emerging Tech",
    image: "/coming_soon.jpg"  // Replace with your image URL
  }
];
const ExperienceZones: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section id="Exhibit With Us" className="relative bg-[#3c0052] py-20 overflow-hidden">
  {/* Background Orbs */}
    <div className="relative z-10 container mx-auto px-6 py-10 sm:py-14 md:py-16 overflow-hidden">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
        Experience Zones
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {temp.map((zone, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-xl bg-white/10 transition-all duration-300"
            style={{
              backgroundColor: `${zone.color}20`,
              minHeight: '350px',
              height: 'auto',
              padding: '1rem',
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Inner Content */}
            <div className="relative z-10 p-6 flex flex-col justify-between rounded-xl border border-white/20">
              {/* Icon Container */}
              <div className="aspect-square rounded-lg mb-4 overflow-hidden bg-gradient-to-br from-white/10 to-white/20">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-white">{zone.name}</h3>
              <p className="text-gray-300 text-sm leading-relaxed" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                {zone.description}
              </p>
            </div>
            
            {/* Bottom Accent */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
              style={{ backgroundColor: zone.color }}
            ></div>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default ExperienceZones;
