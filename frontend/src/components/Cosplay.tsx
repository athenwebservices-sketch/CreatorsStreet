'use client';

const Cosplay = ({ isHovering, setIsHovering }) => {
  return (
    <section id="Cosplay" className="relative w-screen min-h-screen flex items-center justify-center bg-[#3c0052] overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255, 192, 203, 0.4), transparent 70%)`,
          filter: 'brightness(1.2) saturate(1.3)',
          transform: 'scale(1.1)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, rgba(255, 255, 255, 0.05), transparent, rgba(255, 255, 255, 0.05))`,
          opacity: 0.25,
        }}
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-32 left-20 w-96 h-96 bg-gradient-to-tr from-pink-400 via-yellow-300 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-1000 pointer-events-none" />
      <div className="absolute top-10 right-32 w-80 h-80 bg-gradient-to-tr from-purple-400 via-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-blue-400 via-green-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-3000 pointer-events-none" />

      {/* Content Block */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full px-6 max-w-6xl space-y-12 md:space-y-0">

        {/* Left Content */}
        <div className="text-left max-w-sm">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md mb-4">
            Cosplay Workshop
          </h2>
          <p className="text-lg md:text-2xl text-yellow-200 mb-6">
            Step Into Character
          </p>
          <a
            href=""
            className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-white/10 hover:bg-white/20 border-none rounded-full transition-all duration-300 relative z-30"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Register Now
          </a>
        </div>

        {/* Centered Cosplay Image */}
        <div className="relative z-10 w-full md:w-[28rem]">
          <img
            src="/no_bg_image_cosplay.png"
            alt="Cosplay Showcase"
            className="w-full rounded-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right Content */}
        <div className="text-right max-w-sm">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md mb-4">
            Join Our Cosplay Community
          </h2>

          <a
            href="https://chat.whatsapp.com/FsOZBOVFstj4PPSJjHZT4v"
            className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-white/10 hover:bg-white/20 border-none rounded-full transition-all duration-300 relative z-30"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Join Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Cosplay;