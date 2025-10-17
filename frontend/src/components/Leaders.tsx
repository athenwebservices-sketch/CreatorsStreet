'use client';

const Leaders = ({ isHovering, setIsHovering }) => {
  const leaders = [
    {
      name: "Mr. Vikas Tiwari",
      description: "President, MP- AVGC-XR Association",
      color: "#FFC107",
      image: "/Vikas.png"  // Replace with your image URL
    },
    {
      name: "Mr. Sanjay Khimsera",
      description: "President, Asifa",
      color: "#F44336",
      image: "/Sanjay.png"  // Replace with your image URL
    },
    {
      name: "Mr. Himanshu Chaturvedi",
      description: "Founder and Director of MotionGility",
      color: "#00BCD4",
      image: "/Jury3.jpeg"  // Replace with your image URL
    }
  ];

  return (
    <section id="Leaders" className="relative bg-[#3c0052] py-10 overflow-hidden flex items-center justify-center min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#3c0052] via-[#3c0052] to-[#3c0052] rounded-full mix-blend-multiply filter blur-[160px] opacity-30 animate-blob-one animation-delay-500 pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-[#3c0052] via-[#3c0052] to-[#3c0052] rounded-full mix-blend-multiply filter blur-[160px] opacity-30 animate-blob-two animation-delay-1500 pointer-events-none" />

      {/* Section Content */}
      <div className="relative z-10 container mx-auto px-6 py-10 sm:py-14 md:py-16 overflow-hidden flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
          Jury
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center max-w-6xl mx-auto">
          {leaders.map((zone, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl bg-white/10 transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: `${zone.color}20`,
                minHeight: '380px', // Increased min-height to accommodate the new aspect ratio
                height: 'auto',
                padding: '0.75rem',
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Inner Content */}
              <div className="relative z-10 p-4 flex flex-col justify-between rounded-xl border border-white/20 h-full">
                {/* Icon Container - Changed aspect ratio and image object fit */}
                <div className="aspect-[4/5] rounded-lg mb-3 overflow-hidden bg-gradient-to-br from-white/10 to-white/20 flex justify-center items-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={zone.image}
                      alt={zone.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 text-white">{zone.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed" style={{ maxHeight: '80px', overflow: 'hidden' }}>
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

export default Leaders;