import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <style>{`
        .home-container {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
        }

        .hero-section {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
          padding: 0;
        }

        .hero-link {
          display: block;
          cursor: pointer;
          transition: opacity 0.3s ease;
          width: 100%;
        }

        .hero-link:hover {
          opacity: 0.9;
        }

        .hero-section img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .projects-heading {
          font-size: 32px;
          margin-bottom: 20px;
          text-align: center;
          color: #fff;
          width: 100%;
        }

        .collage-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding-top: 48px;
          padding-right: 10%;
          padding-bottom: 36px;
          padding-left: 10%;
        }

        .collage-container {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
        }

        .image-grid {
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (min-width: 1200px) {
          .image-grid {
            flex-wrap: nowrap;
          }
        }

        .image-item {
          flex: 1;
          position: relative;
          height: 500px;
          min-width: 185px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-item a {
          display: block;
          height: 100%;
          width: 100%;
          position: relative;
          text-decoration: none;
        }

        .collage-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 15px;
          opacity: 0;
          transition: opacity 0.3s ease;
          text-align: center;
          z-index: 2;
        }

        .project-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
        }

        .image-item:hover .image-overlay {
          opacity: 1;
        }

        .image-item:hover .collage-image {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .collage-section {
            padding: 40px 10%;
          }

          .image-item {
            height: 400px;
          }
        }

        @media (max-width: 420px) {
          .collage-section {
            padding: 20px 10%;
          }

          .image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
          }

          .image-item {
            height: 300px;
            min-width: unset;
            width: 100%;
          }

          .collage-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .image-overlay {
            display: block;
            padding: 8px;
            font-size: 0.8rem;
          }

          .project-title {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <Link to="/projects/academy-of-gods" className="hero-link">
            <img src="assets/home/hero.png" alt="Studio Jatayu" />
          </Link>
        </section>

        {/* Collage Section */}
        <section className="collage-section">
          <h2 className="projects-heading">PROJECTS</h2>
          <div className="collage-container">
            <div className="image-grid">
              <div className="image-item">
                <Link to="/projects/bhag-zombie-bhag">
                  <img
                    src="assets/home/bhag-zombie-bhag.png"
                    alt="Bhag Zombie Bhag"
                    className="collage-image"
                  />
                  <div className="image-overlay">
                    <h3 className="project-title">Bhag Zombie Bhag</h3>
                  </div>
                </Link>
              </div>

              <div className="image-item">
                <Link to="/projects/niko">
                  <img
                    src="assets/home/niko.png"
                    alt="Fox character"
                    className="collage-image"
                  />
                  <div className="image-overlay">
                    <h3 className="project-title">Niko</h3>
                  </div>
                </Link>
              </div>

              <div className="image-item">
                <Link to="/projects/girl-and-the-monster">
                  <img
                    src="assets/home/girl-and-the-monster.png"
                    alt="Child with large green creature"
                    className="collage-image"
                  />
                  <div className="image-overlay">
                    <h3 className="project-title">Girl and the Monster</h3>
                  </div>
                </Link>
              </div>

              <div className="image-item">
                <Link to="/projects/balakanda">
                  <img
                    src="assets/home/balakanda.png"
                    alt="Warrior character"
                    className="collage-image"
                  />
                  <div className="image-overlay">
                    <h3 className="project-title">Balakanda</h3>
                  </div>
                </Link>
              </div>

              <div className="image-item">
                <Link to="/projects/dino-and-dyno">
                  <img
                    src="assets/home/dino-and-dyno.png"
                    alt="Girl with toy dinosaur"
                    className="collage-image"
                  />
                  <div className="image-overlay">
                    <h3 className="project-title">Dino and Dyno</h3>
                  </div>
                </Link>
              </div>

              <div className="image-item">
                <Link to="/projects/academy-of-gods">
                  <img
                    src="assets/home/academy-of-gods.png"
                    alt="Character in ornate clothing"
                    className="collage-image"
                  />
                  <div className="image-overlay">
                    <h3 className="project-title">Academy of Gods</h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
