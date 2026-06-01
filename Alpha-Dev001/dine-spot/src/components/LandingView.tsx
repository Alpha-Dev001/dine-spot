import React, { useState, useEffect } from "react";
import "../index.css"; // global styles
// Note: assets are referenced relative to the public folder (Restaurent website) – adjust paths if needed.

const slides = [
  {
    id: 1,
    bg: "./assets/images/hero-slider-1.jpg",
    subtitle: "Tradition & Hygiene",
    title: "For the passion of\nDelicious Meal",
    description: "Come with friends & feel the joy of delicious food",
  },
  {
    id: 2,
    bg: "./assets/images/hero-slider-2.jpg",
    subtitle: "Delightful Experience",
    title: "Welcome to the Lex <br /> Restaurant",
    description: "Come with family & vibe the happiness of mouth‑watering food",
  },
  {
    id: 3,
    bg: "./assets/images/hero-slider-3.jpg",
    subtitle: "Amazing & Delicious",
    title: "Where every flavor <br /> tells a story",
    description: "Come with family & feel the joy of mouth‑watering food",
  },
];

const LandingView: React.FC = () => {
  const [active, setActive] = useState(0);

  // Auto‑cycle slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setActive((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActive((prev) => (prev + 1) % slides.length);

  return (
    <>
      {/* Top Bar – glassmorphism */}
      <div className="topbar" style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.4)" }}>
        <div className="container flex justify-between items-center gap-4">
          <address className="topbar-item flex items-center gap-2 text-sm">
            <div className="icon">
              <ion-icon name="location-outline" aria-hidden="true"></ion-icon>
            </div>
            <span className="span">Lex, Kigali city, Kigali kk225, RW</span>
          </address>
          <div className="separator"></div>
          <div className="topbar-item item-2 flex items-center gap-2 text-sm">
            <div className="icon">
              <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
            </div>
            <span className="span">Daily: 6.00 am – 12.00 pm</span>
          </div>
          <a href="tel:+250793373953" className="topbar-item link flex items-center gap-2 text-sm">
            <div className="icon">
              <ion-icon name="call-outline" aria-hidden="true"></ion-icon>
            </div>
            <span className="span">+250 793 373 953</span>
          </a>
          <div className="separator"></div>
          <a href="mailto:iamshemaleandre@gmail.com" className="topbar-item link flex items-center gap-2 text-sm">
            <div className="icon">
              <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
            </div>
            <span className="span">iamshemaleandre@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Header / Navigation – sticky with glass effect */}
      <header className="header" id="header" style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.6)" }}>
        <div className="container flex justify-between items-center">
          <a href="#" className="logo flex items-center">
            <img src="./assets/images/logo.png" width={60} height={40} alt="Lex Home" loading="lazy" />
          </a>
          <nav className="navbar" data-navbar>
            <button className="close-btn" aria-label="close menu" data-nav-toggler>
              <ion-icon name="close-outline" aria-hidden="true"></ion-icon>
            </button>
            <a href="#" className="logo">
              <img src="./assets/images/logo.png" width={60} height={40} alt="Lex – Home" loading="lazy" />
            </a>
            <ul className="navbar-list flex flex-col gap-4">
              <li className="navbar-item">
                <a href="#home" className="navbar-link hover-underline active">
                  <div className="separator"></div>
                  <span className="span">Home</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="#menu" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">Menus</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="#about" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">About Us</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="Login.html" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">Login</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="UserDetails.html" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">Register</span>
                </a>
              </li>
            </ul>
            <div className="text-center mt-6">
              <p className="headline-1 navbar-title">Visit Us</p>
              <address className="body-4">
                Lex, Kigali City,<br />
                Kigali, RW
              </address>
              <p className="body-4 navbar-text">Open: 9.30 am – 2.30 pm</p>
              <a href="mailto:iamshemaleandre@gmail.com" className="body-4 sidebar-link">iamshemaleandre@gmail.com</a>
              <div className="separator my-4"></div>
              <p className="contact-label">Booking Request</p>
              <a href="tel:+250793373953" className="body-1 contact-number hover-underline">
                +250 793 373 953
              </a>
            </div>
            <a href="#" className="btn btn-secondary mt-4">
              <span className="text text-1">Find A Table</span>
              <span className="text text-2" aria-hidden="true">Find A Table</span>
            </a>
            <button className="nav-open-btn" aria-label="open menu" data-nav-toggler>
              <span className="line line-1"></span>
              <span className="line line-2"></span>
              <span className="line line-3"></span>
            </button>
            <div className="overlay" data-nav-toggler data-overlay></div>
          </nav>
        </div>
      </header>

      {/* Hero Slider */}
      <section className="hero text-center" aria-label="home" id="home">
        <ul className="hero-slider" data-hero-slider>
          {slides.map((slide, idx) => (
            <li
              key={slide.id}
              className={`slider-item ${idx === active ? "active" : ""}`}
              data-hero-slider-item
            >
              <div className="slider-bg">
                <img
                  src={slide.bg}
                  width={1880}
                  height={950}
                  alt=""
                  className="img-cover"
                  loading="lazy"
                />
              </div>
              <p className="label-2 section-subtitle slider-reveal">{slide.subtitle}</p>
              <h1 className="display-1 hero-title slider-reveal" dangerouslySetInnerHTML={{ __html: slide.title }} />
              <p className="body-2 hero-text slider-reveal">{slide.description}</p>
              <a href="#menu" className="btn btn-primary slider-reveal">
                <span className="text text-1">View Our Menu</span>
                <span className="text text-2" aria-hidden="true">
                  View Our Menu
                </span>
              </a>
            </li>
          ))}
        </ul>
        <button className="slider-btn prev" aria-label="slide to previous" data-prev-btn onClick={goPrev}>
          <ion-icon name="chevron-back"></ion-icon>
        </button>
        <button className="slider-btn next" aria-label="slide to next" data-next-btn onClick={goNext}>
          <ion-icon name="chevron-forward"></ion-icon>
        </button>
        <a href="#reservation" className="hero-btn has-after">
          <img src="./assets/images/hero-icon.png" width={48} height={48} alt="booking icon" loading="lazy" />
          <span className="label-2 text-center span">Book A Table</span>
        </a>
      </section>

      {/* Features – Why Choose Us */}
      <section className="section features text-center" aria-label="features">
        <div className="container">
          <p className="section-subtitle label-2">Why Choose Us</p>
          <h2 className="headline-1 section-title">Our Strength</h2>
          <ul className="grid-list grid-cols-2 md:grid-cols-4 gap-8">
            <li className="feature-item">
              <div className="feature-card p-6 bg-black-10 rounded-lg hover:shine transition-all duration-300">
                <div className="card-icon mb-4">
                  <img src="./assets/images/features-icon-1.png" width={100} height={80} loading="lazy" alt="Hygienic Food" />
                </div>
                <h3 className="title-2 card-title">Hygienic Food</h3>
                <p className="label-1 card-text">We offer well‑prepared meals.</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-card p-6 bg-black-10 rounded-lg hover:shine transition-all duration-300">
                <div className="card-icon mb-4">
                  <img src="./assets/images/features-icon-2.png" width={100} height={80} loading="lazy" alt="Fresh Environment" />
                </div>
                <h3 className="title-2 card-title">Fresh Environment</h3>
                <p className="label-1 card-text">Our environment is clean and secure.</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-card p-6 bg-black-10 rounded-lg hover:shine transition-all duration-300">
                <div className="card-icon mb-4">
                  <img src="./assets/images/features-icon-3.png" width={100} height={80} loading="lazy" alt="Skilled Chefs" />
                </div>
                <h3 className="title-2 card-title">Skilled Chefs</h3>
                <p className="label-1 card-text">We have experienced chefs preparing meals.</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-card p-6 bg-black-10 rounded-lg hover:shine transition-all duration-300">
                <div className="card-icon mb-4">
                  <img src="./assets/images/features-icon-4.png" width={100} height={80} loading="lazy" alt="Event & Party" />
                </div>
                <h3 className="title-2 card-title">Event & Party</h3>
                <p className="label-1 card-text">We have night clubs from Monday up to Sunday.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default LandingView;
