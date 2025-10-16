import React from 'react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      name: 'Academy of Gods',
      image: '/assets/projects/academy-of-gods/title.png',
      path: '/projects/academy-of-gods',
    },
    {
      name: 'Balakanda',
      image: '/assets/projects/balakanda/title.png',
      path: '/projects/balakanda',
    },
    {
      name: 'Dino and Dyno',
      image: '/assets/projects/dino-and-dyno/title.png',
      path: '/projects/dino-and-dyno',
    },
    {
      name: 'Girl and the Monster',
      image: '/assets/projects/girl-and-the-monster/title.png',
      path: '/projects/girl-and-the-monster',
    },
    {
      name: 'Niko',
      image: '/assets/projects/niko/title.png',
      path: '/projects/niko',
    },
    {
      name: 'Bhag Zombie Bhag',
      image: '/assets/projects/bhag-zombie-bhag/title.png',
      path: '/projects/bhag-zombie-bhag',
    },
  ];

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background-color: #000; /* black background */
        }

        .projects-wrapper {
          background-color: #000; /* background for section */
          min-height: 100vh;
          padding: 80px 0;
        }

        .projects-container { 
          max-width: 1372px;
          margin: 0 auto;
          padding: 0 80px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .project-card {
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background-color: #111;
          border: 1px solid #333;
        }

        .project-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
        }

        .project-link {
          text-decoration: none;
          color: #fff;
          display: block;
        }

        .project-image {
          position: relative;
          padding-bottom: 56.25%;
          overflow: hidden;
        }

        .project-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #000;
        }

        .project-info {
          text-align: center;
          padding: 15px 0;
        }

        .project-info h3 {
          font-size: 22px;
          font-weight: 500;
          margin: 0;
          color: #fff;
        }

        @media (max-width: 1024px) {
          .projects-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            padding: 0 40px;
          }
        }

        @media (max-width: 768px) {
          .projects-container {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 0 20px;
          }

          .project-info h3 {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="projects-wrapper">
        <div className="projects-container">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card"
              onClick={() => navigate(project.path)}
            >
              <div className="project-link">
                <div className="project-image">
                  <img src={project.image} alt={project.name} />
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;