import React from "react";

const About = () => {
  const teamMembers = [
    {
      name: "Vishnu Vardhan Reddy K",
      role: "CEO & Co-Founder",
      image: "assets/about/vishnu_vardhan_reddy_k.jpg",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/vishnu-vardhan-reddy-k-3b707930/" },
      ],
      description: [
        "Vishnu Vardhan Reddy K is a seasoned Animator, Creative Director, and Storyteller with over a decade of experience in the animation industry. A graduate of Vancouver Film School (VFS), he has honed his skills in 3D animation, storytelling, and creative direction, working with some of the renowned names in the industry.",
        "Throughout his career, Vishnu has contributed to studios, including Technicolor, Rockstar Games, Green Gold Animation, and channels like Netflix, Nickelodeon, Cartoon Network and Pogo, taking on key roles in animation, creative supervision, and production leadership. His expertise spans narrative development, pipeline optimization, and end-to-end content creation, making him an integral part impactful animated project.",
        "As the Founder of Studio Jatayu, he is committed to redefining Indian animation by crafting original, high-quality content that blends rich storytelling with global production standards. With a passion for pushing creative boundaries, Vishnu continues to lead innovative projects that leave a lasting impression.",
      ],
    },
    {
      name: "Debalina Dasgupta",
      role: "COO / Co-Founder",
      image: "assets/about/debalina_dasgupta.jpg",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/debalina-dasgupta-31902419/" },
      ],
      description: [
        "Debalina Dasgupta is a highly accomplished Concept Artist & Color Concept Designer with 15+ years of experience in the animation. She has played a pivotal role in shaping the visual aesthetics of numerous projects across Animated feature films & animated series.",
        "Her journey includes working with renowned studios such as Utv Motion Pictures, Prime Focus, Green Gold Animation, and Rocket Science VFX, contributing to content for platforms like Netflix, Amazon Prime, Pogo, and Nickelodeon.",
        "At Studio Jatayu, she continues to bring her artistic expertise to life, crafting captivating worlds, compelling character designs, and immersive color palettes that define the studio's unique storytelling approach.",
      ],
    },
    {
      name: "Jayadyuti De",
      role: "Design Head",
      image: "assets/about/jayadyuti.jpeg",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/jayadyuti-de-39771047/" },
      ],
      description: [
        "Jayadyuti De is a highly accomplished Story artist, Illustrator, Character designer and Comic book artist with 13+ years of experience in the Animation,VFX, Comic book industry. He has played a significant role in shaping the visual narrative and aesthetics of numerous projects across feature films, animated series and comics.",
        "His journey includes working with renowned studios such as Pandora film, DNEG, Redefine, Green Gold, Cosmos Maya, Wackytoon Studio, Paperboat Design Studio, 27ink",
      ],
    },
    {
      name: "Oindrilla Ash",
      role: "Creative Writer",
      image: "assets/about/oindrilla_ash.jpg",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/oindrila-ash-820495157/" },
      ],
      description: [
        "Oindrila Ash kicked off her writing adventures as head writer on Mighty Little Bheem, later leading the spinoff Mighty Bheem's Playtime. She's the author of Mr. Froginson's Opera House and co-writer of the mythic mayhem that is Academy of Gods. She lives for strange ideas and odd characters.",
      ],
    },
    {
      name: "Shravan Kumar P",
      role: "Director / Finance",
      image: "assets/about/shravan_kumar.jpg",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/shravan-kumar-b1683558/" },
      ],
      description: [
        "Shravan Kumar P is one of the key pillars behind the establishment of Studio Jatayu. A qualified Chartered Accountant since 2012, Shravan brings a wealth of experience in finance, auditing, and compliance to the team.",
        "He began his professional journey with one of the Big Four audit firms, where he spent over 4.5 years handling statutory and tax audits for a diverse portfolio of SEBI-listed and private companies. His expertise spans critical areas such as statutory audits, IFC (Internal Financial Controls) testing, and IND AS (Indian Accounting Standards) implementation.",
        "At Studio Jatayu, Shravan plays an instrumental role in ensuring robust financial governance, operational compliance, and strategic financial planning, contributing significantly to the studio’s growth and long-term vision.",
      ],
    },
    {
      name: "Ajay Krishna",
      role: "CSO / Growth & Strategy",
      image: "assets/about/ajay_krishna.jpg",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/ajay%F0%9F%A7%99%F0%9F%8F%BB-krishna-730906162/" },
      ],
      description: [
        "Ajay Krishna has significantly contributed to the AVGC (Animation, Visual Effects, Gaming, and Comics) and Web3 sectors through his visionary work in creating immersive digital universes. As the creator of Forbidden Verse and Flavorville comic universes, Ajay has successfully blended storytelling with advanced blockchain technology, driving innovation in the NFT space. With a decade of experience in blockchain and over five years of full-time involvement in the Web3 industry, Ajay's expertise spans cryptography, secure electronic commerce, and smart contract development. He has pioneered the creation of dynamic, interactive NFTs, revolutionizing how users engage with digital content. Additionally, Ajay's deep knowledge of game development and design has allowed him to craft unique gaming experiences that leverage blockchain's transparency and security. His contributions have played a vital role in the evolution of both the AVGC industry and the Web3 landscape, paving the way for new forms of interactive entertainment.",
      ],
    },
    {
      name: "B.S. Srinivas",
      role: "Director / Business Development",
      image: "assets/about/bs_srinivas.jpeg",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/srinivas-sribhakta-11299a14/" },
      ],
      description: [
        "Srinivas Sribhakta has been a pioneering force in the Media & Entertainment industry for over 25 years, playing a crucial role in establishing and leading animation, VFX, and gaming training centers. As the Director of Arena Animation centers in Bengaluru and CEO of VedAtma Animation Studios, he has trained more than 20,000 students globally. He has also served as the Secretary of ABAI, Karnataka’s key industry association supporting the AVGC (Animation, VFX, Gaming, and Comics) sector for over 8 years, focusing on skill development and startup support. Srinivas is the Co-chair of Bengaluru GAFX — Asia’s largest AVGC event — and has actively contributed to feature film production, media startups, and even acting in South Indian regional cinema. He is also the founder of VedAtma College of Design, Technology & Management, a state-of-the-art design education campus affiliated with Bengaluru City University.",
        "Currently, as the Director & Head of Business Development at Studio Jatayu, Srinivas is driving strategic collaborations, market expansion, and creative innovation. He plays a vital role in shaping the studio’s growth trajectory by aligning its vision with emerging trends while nurturing talent and partnerships that strengthen Studio Jatayu’s position as a culturally rooted and globally aspirational creative force.",
      ],
    },
  ];

  return (
    <>
      <style>{`
        .about-container {
          background-color: #000;
          color: #fff;
          min-height: 100vh;
          padding: 80px 0;
        }
        .about-content {
          max-width: 1212px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .about-header {
          text-align: center;
          margin-bottom: 98px;
        }
        .about-header h1 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .about-header p {
          font-size: 18px;
          line-height: 1.6;
          max-width: 1212px;
          margin: 0 auto;
          text-align: left;
        }
        .team-section {
          margin-top: 98px;
        }
        .team-section h2 {
          font-size: 42px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 108px;
        }
        .team-member {
          margin-bottom: 64px;
        }
        .team-member-content {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .team-member-profile {
          width: 383px;
          flex-shrink: 0;
        }
        .profile-image {
          margin-bottom: 15px;
        }
        .profile-image img {
          width: 100%;
          height: 447px;
          object-fit: cover;
        }
        .team-member-info {
          flex: 1;
        }
        .profile-info {
          margin-bottom: 24px;
        }
        .profile-info h3 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .profile-info .role {
          font-size: 18px;
          color: #888;
          margin-bottom: 12px;
        }
        .social-links {
          display: flex;
          gap: 16px;
        }
        .social-links a {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .social-links a:hover {
          transform: scale(1.1);
        }
        .social-icon {
          width: 16px;
          height: 16px;
          filter: brightness(0) invert(1);
          transition: filter 0.3s ease;
        }
        .social-links a:hover .social-icon {
          filter: brightness(0) invert(0.8);
        }
        .team-member-description p {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .team-member-description p:last-child {
          margin-bottom: 0;
        }
        @media (max-width: 1024px) {
          .team-member-content {
            flex-direction: column;
            gap: 24px;
          }
          .team-member-profile {
            width: 100%;
            max-width: 383px;
            margin: 0 auto;
          }
          .team-member-info {
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          .about-container {
            padding: 40px 0;
          }
          .about-header h1,
          .team-section h2 {
            font-size: 32px;
          }
          .about-header p,
          .team-member-description p {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="about-container">
        <div className="about-content">
          <div className="about-header">
            <h1>ABOUT STUDIO JATAYU</h1>
            <p>
              Studio Jatayu Pvt. Ltd. an animation studio dedicated to crafting
              original, culturally rooted stories with global appeal. Founded by
              Vishnu Vardhan Reddy and Debalina Dasgupta—both seasoned
              professionals with over a decade of experience in the animation
              and visual storytelling industry—the studio brings together a
              unique blend of artistic vision and production expertise.
            </p>
            <br />
            <p>
              With specialization in high-quality 2D and 3D animation, comics,
              and visual development, Studio Jatayu delivers content across both
              digital and broadcast platforms. The team has previously
              contributed to numerous projects for major broadcasters and
              production houses, including Netflix, Amazon Prime, Nickelodeon,
              Pogo, and more.
            </p>
            <br />
            <p>
              Rooted in Indian mythology, folklore, and contemporary themes,
              Studio Jatayu aims to bridge tradition and innovation—creating
              powerful narratives and immersive visual worlds that resonate with
              audiences of all ages.
            </p>
          </div>

          <div className="team-section">
            <h2>OUR TEAM</h2>
            {teamMembers.map((member, index) => (
              <div className="team-member" key={index}>
                <div className="team-member-content">
                  <div className="team-member-profile">
                    <div className="profile-image">
                      <img src={member.image} alt={member.name} />
                    </div>
                  </div>
                  <div className="team-member-info">
                    <div className="profile-info">
                      <h3>{member.name}</h3>
                      <p className="role">{member.role}</p>
                      {member.socialLinks && (
                        <div className="social-links">
                          {member.socialLinks.map((link, i) => (
                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={`assets/icons/${link.platform}.svg`}
                                alt={link.platform}
                                className="social-icon"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="team-member-description">
                      {member.description.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
