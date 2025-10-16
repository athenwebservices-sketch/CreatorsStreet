import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .footer {
          background-color: #000;
          color: #fff;
          width: 100%;
          position: relative;
          bottom: 0;
          left: 0;
          right: 0;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 40px 80px;
          width: 100%;
          box-sizing: border-box;
        }

        .footer-logo {
          width: 185px;
        }

        .footer-logo img {
          width: 98px;
          height: 174px;
        }

        .footer-links {
          display: flex;
          gap: 154px;
        }

        .links-section,
        .projects-section {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .links-section h3,
        .projects-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .links,
        .projects {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .links a,
        .projects a {
          color: #fff;
          text-decoration: none;
          font-size: 16px;
          transition: opacity 0.3s ease;
          cursor: pointer;
        }

        .links a:hover,
        .projects a:hover {
          opacity: 0.8;
        }

        .social-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .social-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .footer-divider {
          height: 1px;
          background-color: #fff;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 80px;
          width: 100%;
          box-sizing: border-box;
        }

        .footer-bottom a {
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          transition: opacity 0.3s ease;
          cursor: pointer;
        }

        .footer-bottom a:hover {
          opacity: 0.8;
        }

        .footer-bottom p {
          margin: 0;
          font-size: 14px;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .footer-links {
            gap: 80px;
          }
        }

        @media (max-width: 768px) {
          .footer {
            position: relative;
            width: 100%;
          }

          .footer-content {
            padding: 40px 20px;
            align-items: center;
          }

          .footer-content {
            flex-direction: column;
            gap: 40px;
            text-align: center;
          }

          .footer-logo {
            display: flex;
            justify-content: center;
          }

          .footer-links {
            flex-direction: column;
            gap: 40px;
            align-items: center;
          }

          .links-section,
          .projects-section {
            align-items: center;
          }

          .social-links {
            justify-content: center;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
            padding: 20px;
          }

          .footer-bottom p {
            order: 1;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <a onClick={() => navigateTo("/")} className="logo">
              <img src="assets/logo/logo.svg" alt="Studio Jatayu Logo" />
            </a>
          </div>

          <div className="footer-links">
            <div className="links-section">
              <h3>QUICK LINKS</h3>
              <div className="links">
                <a onClick={() => navigateTo("/about")}>About</a>
                <a onClick={() => navigateTo("/gallery")}>Gallery</a>
                <a onClick={() => navigateTo("/projects")}>Projects</a>
                <a onClick={() => navigateTo("/store")}>Store</a>
              </div>
            </div>

            <div className="projects-section">
              <h3>PROJECTS</h3>
              <div className="projects">
                <a onClick={() => navigateTo("/projects/academy-of-gods")}>Academy of Gods</a>
                <a onClick={() => navigateTo("/projects/balakanda")}>Balakanda</a>
                <a onClick={() => navigateTo("/projects/girl-and-the-monster")}>Girl and the Monster</a>
                <a onClick={() => navigateTo("/projects/dino-and-dyno")}>Dino and Dyno</a>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a
              href="https://www.linkedin.com/company/studio-jatayu-pvt-ltd/"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="assets/icons/linkedin.svg" alt="LinkedIn" />
            </a>
            <a
              href="#"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="assets/icons/facebook.svg" alt="Facebook" />
            </a>
            <a
              href="https://chat.whatsapp.com/JHV3MB2DnfFB0UpySEWQNJ"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="assets/icons/whatsapp.svg" alt="WhatsApp" />
            </a>
            <a
              href="https://www.youtube.com/@StudioJatayu"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="assets/icons/youtube.svg" alt="YouTube" />
            </a>
            <a
              href="https://www.instagram.com/studio_jatayu/"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="assets/icons/instagram.svg" alt="Instagram" />
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", margin: "10px 0" }}>
          Email: contact@studiojatayu.com
        </p>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <a onClick={() => navigateTo("/privacy-policy")}>Privacy Policy</a>
          <p>Copyright © {currentYear} Studio Jatayu</p>
          <a onClick={() => navigateTo("/terms-and-conditions")}>
            Terms & Conditions
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
