'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = ({ isHovering, setIsHovering }) => {
  return (
    <footer className="relative bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="col-span-4 flex justify-center mt-8">
              <img src="/Logo1.png" alt="Creators Street Logo" className="h-12" />
            </div>
            <p className="text-gray-400 text-sm">
              India's Biggest Celebration of Creativity
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { text: 'About Us', id: 'hero' },
                { text: 'Events', id: 'Events' },
                { text: 'Tickets', id: 'tickets' }
              ].map(({ text, id }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {[
                { name: 'Instagram', icon: faInstagram, link: 'https://www.instagram.com/creatorsstreet.official' },
                { name: 'LinkedIn', icon: faLinkedin, link: 'https://www.linkedin.com/company/creators-street/' },
                { name: 'WhatsApp', icon: faWhatsapp, link: 'https://chat.whatsapp.com/FsOZBOVFstj4PPSJjHZT4v' },
              ].map(({ name, icon, link }) => (
                <a
                  key={name}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={icon} className="text-white text-xl" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Email: info@creatorsstreet.in</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Creators Street. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;