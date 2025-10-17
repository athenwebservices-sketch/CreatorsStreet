'use client';

const Awards = ({ isHovering, setIsHovering }) => {
  const awards = [
    {
      name: "Comics Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfwYAJwoOi7jWKvV2sW6z2TV80uoV4CU5OOiFmdXjsLlFDBEA/viewform?usp=header",
      imageSeed: "/Awards.jpg"
    },
    {
      name: "Animation Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdhQ_ecD4jqbEpl25O4fa5PKUY7H6mNjcjoNicrKR2wOAcQBA/viewform?usp=header",
      imageSeed: "/Awards.jpg"
    },
    {
      name: "Gaming Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdhQ_ecD4jqbEpl25O4fa5PKUY7H6mNjcjoNicrKR2wOAcQBA/viewform?usp=header",
      imageSeed: "/Awards.jpg"
    },
    {
      name: "Special Cataogery Awards 2025",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdWxEblCh_nEGUJ5HSefC70Q0aigC_yGUo7WHDcQDPHbUeLFg/viewform?usp=header",
      imageSeed: "/Awards.jpg"
    }
  ];

  return (
    <section id="Awards" className="relative bg-[#3c0052] py-20">
      <div className="container mx-auto px-6 py-10 sm:py-14 md:py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          Creator Street Awards
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((award, index) => (
            <div
              key={index}
              className="rounded-lg border border-white/20 bg-white/10 overflow-hidden flex flex-col h-[450px] transition-transform duration-300 hover:scale-105"
            >
              {/* Image Container with matching background */}
              <div className="h-64 bg-[#3c0052] flex items-center justify-center p-4">
                <img
                  src={award.imageSeed}
                  alt={award.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-center flex-grow flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {award.name}
                </h3>

                <a
                  href={award.link}
                  className="inline-block px-5 py-2 text-sm font-semibold text-yellow-300 border border-yellow-400 rounded-full hover:bg-yellow-400 hover:text-indigo-900 transition-colors duration-300"
                >
                  Register Now→
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;