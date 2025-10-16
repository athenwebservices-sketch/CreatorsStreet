'use client';

const Tickets = ({ isHovering, setIsHovering }) => {
  return (
    <section id="tickets" className="relative bg-[#3c0052] pt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                Limited Time Offer
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Join the Ultimate Pop-Culture Experience at Creators Street 2025
            </h2>

            <div className="space-y-4 text-gray-300 text-lg">
              <p className="flex items-start space-x-3">
                <span className="text-yellow-400 text-xl mt-1"></span>
                <span>Get exclusive access to all <strong>4 experience zones Animation, VFX, Film, and OTT</strong></span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="text-yellow-400 text-xl mt-1"></span>
                <span>Meet top <strong>creators, artists, and industry leaders</strong> from across India</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="text-yellow-400 text-xl mt-1"></span>
                <span>Participate in <strong>gaming tournaments, cosplay shows,</strong> and workshops</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="text-yellow-400 text-xl mt-1"></span>
                <span>Experience <strong>masterclasses, live performances,</strong> and panel sessions</span>
              </p>
            </div>

            <p className="text-yellow-400 font-semibold text-lg">
              Early Bird Offer — Limited Seats Only!
            </p>

            <div className="flex">
              <button
                className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 hover:shadow-2xl overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {/* Replace "For Tickets" with a ticket logo */}
                  <span className="text-2xl">🎟️</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-purple-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl overflow-hidden border-2 border-white/20">
              <div className="aspect-square w-full flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <div className="text-6xl">🎪</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Creators Street 2025</h3>
                    <p className="text-gray-300">Your adventure awaits!</p>
                    <div className="flex justify-center space-x-2 text-2xl">
                      <span>🎨</span>
                      <span>🎮</span>
                      <span>🎭</span>
                      <span>🏆</span>
                      {/* Ticket with Glow Animation */}
                      <span className="relative inline-block ticket-glow group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500">
                        <span className="absolute inset-0 blur-md bg-yellow-400 opacity-0 group-hover:opacity-60 rounded-full transition-opacity duration-500"></span>
                        <span className="relative z-10">🎟</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="absolute inset-0 w-full h-full">
              <img src="/2024/4.png" alt="Creators Street 2025" className="object-cover w-full h-full rounded-2xl" />
            </div>

            {/* Floating badges */}
            <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold animate-float z-20">
              Early Bird
            </div>
            <div className="absolute bottom-4 right-4 bg-purple-400 text-white px-4 py-2 rounded-full text-sm font-bold animate-float z-20">
              Limited Seats
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tickets;