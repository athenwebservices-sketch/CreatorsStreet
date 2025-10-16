'use client';

const Hero = ({ isHovering, setIsHovering, mousePosition, fluidColors, currentColorIndex }) => {
  return (
    <section
      className="relative w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-visible pb-24"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      id="hero"
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #3c0052 0%, ${fluidColors[(currentColorIndex + 1) % fluidColors.length]} 40%, ${fluidColors[(currentColorIndex + 2) % fluidColors.length]} 80%, transparent)`,
          opacity: isHovering ? 0.75 : 0.5,
          transform: `scale(${isHovering ? 1.1 : 1})`,
          filter: 'brightness(1.2) saturate(1.5)',
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
        style={{
          background: `conic-gradient(from ${mousePosition.x * 0.1}deg at ${mousePosition.x}px ${mousePosition.y}px, #3c0052, transparent, ${fluidColors[(currentColorIndex + 2) % fluidColors.length]})`,
          opacity: isHovering ? 0.35 : 0.25,
          transform: `scale(${isHovering ? 1.1 : 1})`,
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-16 w-40 h-40 sm:w-72 sm:h-72 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-500 pointer-events-none" />
      <div className="absolute top-32 right-20 w-40 h-40 sm:w-72 sm:h-72 bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-1500 pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-40 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2500 pointer-events-none" />

      {/* Content wrapper with margin top to move content down */}
      <div className="relative z-10 w-full max-w-7xl px-6 py-12 flex flex-col items-center mt-12">

        {/* Logo Section */}
        <div className="w-72 sm:w-96 flex flex-col items-center justify-center mb-6 mt-8 relative z-20" style={{ pointerEvents: 'auto' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-500 rounded-xl blur-2xl opacity-80 animate-pulse" />
          <div className="relative w-full flex flex-col items-center justify-center py-4">
            <img
              src="/Logo1.png"
              alt="Logo"
              className="h-20 sm:h-28 brightness-125 transform scale-110 transition-transform duration-300 hover:scale-115"
              style={{ filter: 'drop-shadow(0 0 25px white)' }}
            />
            <p className="font-b612 text-lg sm:text-xl md:text-2xl text-white-200 mb-6 mt-6 text-center whitespace-nowrap tracking-[3.5%] leading-[120%]">
              India's Biggest Celebration of Creativity
            </p>

            <p className="font-b612 text-sm sm:text-xl text-lg font-semibold text-yellow-300 group-hover:text-yellow-400 transition-colors whitespace-nowrap">
              Oct 31st – 2nd Nov 2025 | Hyderabad | HICC Novotel
            </p>
          </div>
        </div>

        {/* Gradient grid */}
        <div className="w-full mb-6 px-4">
          <div className="bg-yellow-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: "Awards", gradient: "from-purple-500 to-pink-500", textColor: "text-pink-400", image: "776ab53715aa8dfc1de1a96dc55b740b6e536e84.png" },
                { name: "Celebrity Announcements", gradient: "from-blue-500 to-indigo-500", textColor: "text-indigo-400", image: "97312e3cb9c5c70b9c85dd66b852d34946ebdea9.jpg" },
                { name: "Expo", gradient: "from-green-500 to-teal-500", textColor: "text-teal-400", image: "a785e33d9d3edf95bf6e35b05c06c4f0741d1492.jpg" },
                { name: "KeyNotes", gradient: "from-red-500 to-orange-500", textColor: "text-orange-400", image: "be034e805aeafe0dbf416f594961adf62ad43466.jpg" },
                { name: "Cosplay", gradient: "from-yellow-500 to-amber-500", textColor: "text-amber-400", image: "c8e8c933bdf438d5183b8bba2a38bb05b3da2978.jpeg" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center aspect-square rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-500 hover:scale-110 group shadow-lg hover:shadow-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <p className={`text-white mt-2 text-sm sm:text-lg font-b612 font-semibold text-black drop-shadow-md`}>
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;