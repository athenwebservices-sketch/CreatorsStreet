'use client';

import { FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Social = ({ isHovering, setIsHovering }) => {
  return (
    <section className="w-full bg-[#3c0052] py-16 px-6 text-center text-white relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wider">
          STAY TUNED ON SOCIAL
        </h2>

        {/* Subheading */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 text-xl md:text-2xl font-semibold">
          <span className="text-yellow-200">FOLLOW US ON</span>
        </div>

        {/* Social Icons and Email */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Social Icons */}
          <div className="flex gap-6">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/creatorsstreet.official"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black p-4 rounded-full hover:bg-[#E1306C] transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/creators-street/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black p-4 rounded-full hover:bg-[#0077b5] transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <FaLinkedinIn className="w-6 h-6 text-white" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://chat.whatsapp.com/FsOZBOVFstj4PPSJjHZT4v"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black p-4 rounded-full hover:bg-[#25D366] transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <FaWhatsapp className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Social;