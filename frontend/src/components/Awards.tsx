'use client';

const Awards = ({ isHovering, setIsHovering }) => {
  const awards = [
    {
      name: "Comics Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfwYAJwoOi7jWKvV2sW6z2TV80uoV4CU5OOiFmdXjsLlFDBEA/viewform?usp=header",
      color: "from-[#3c0052] to-[#3c0052]",
    },
    {
      name: "Animation Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdhQ_ecD4jqbEpl25O4fa5PKUY7H6mNjcjoNicrKR2wOAcQBA/viewform?usp=header",
      color: "from-[#3c0052] to-[#3c0052]",
    },
    {
      name: "Gaming Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdhQ_ecD4jqbEpl25O4fa5PKUY7H6mNjcjoNicrKR2wOAcQBA/viewform?usp=header",
      color: "from-[#3c0052] to-[#3c0052]",
    },
    {
      name: "Special Carogery Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdWxEblCh_nEGUJ5HSefC70Q0aigC_yGUo7WHDcQDPHbUeLFg/viewform?usp=header",
      color: "from-[#3c0052] to-[#3c0052]",
    }
  ];

  return (
    <section id="Awards" className="relative bg-[#3c0052] py-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#3c0052] via-[#3c0052] to-[#3c0052] rounded-full mix-blend-multiply filter blur-[160px] opacity-30 animate-blob-one animation-delay-500 pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-[#3c0052] via-[#3c0052] to-[#3c0052] rounded-full mix-blend-multiply filter blur-[160px] opacity-30 animate-blob-two animation-delay-1500 pointer-events-none" />

      {/* Section Content */}
      <div className="relative z-20 container mx-auto px-6 py-10 sm:py-14 md:py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          Creator Street Awards
        </h2>

        {/* Adjust Grid to have 4 cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {awards.map((award, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/10 backdrop-blur-md shadow-xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-2xl"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Hover Gradient Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${award.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-20 p-6 text-center flex flex-col justify-between h-full">
                {/* Title */}
                <h3 className="text-2xl font-semibold text-white mb-3 drop-shadow-md">
                  {award.name}
                </h3>

                {/* Button */}
                <a
                  href={award.link}
                  className="inline-block px-5 py-2 mt-2 text-sm font-semibold text-yellow-300 border border-yellow-400 rounded-full shadow-md hover:bg-yellow-400 hover:text-indigo-900 transition-all duration-300 relative z-30"
                >
                  Register Now→
                </a>
              </div>

              {/* Bottom Accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${award.color}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;