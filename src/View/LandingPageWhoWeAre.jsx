import React, { useEffect, useState } from "react";
import "../scss/WhoWeAre.css";

const LandingPageWhoWeAre = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="who-we-are">
      <header className="hero-section">
        <h1 className="title">Who We Are</h1>
        <p className="subtitle">Empowering Your Financial Future</p>
      </header>

      <section className="introduction">
        <div className="intro-text">
          <p>
            We are a leading fintech company revolutionizing the financial
            industry through innovative technology and customer-centric
            services. Our mission is to empower people with better financial
            tools that enhance transparency, security, and accessibility for
            all.
          </p>
        </div>
      </section>

      <section className="core-values">
        <div className={`value ${scrollY > 200 ? "fade-in" : ""}`}>
          <h3>Innovation</h3>
          <p>
            Driving forward with cutting-edge financial solutions that reshape
            how businesses and individuals manage their finances.
          </p>
        </div>
        <div className={`value ${scrollY > 400 ? "fade-in" : ""}`}>
          <h3>Trust</h3>
          <p>
            Believing in transparency and reliability, ensuring our customers
            have full control over their financial data.
          </p>
        </div>
        <div className={`value ${scrollY > 600 ? "fade-in" : ""}`}>
          <h3>Customer Focus</h3>
          <p>
            Clients are at the heart of everything we do. We continuously
            innovate to improve user experience and satisfaction.
          </p>
        </div>
      </section>

      <section className="impact">
        <h2>Our Impact in Numbers</h2>
        <div className="statistics">
          <div className="stat">
            <h3>10K+</h3>
            <p>Users worldwide</p>
          </div>
          <div className="stat">
            <h3>₹10M</h3>
            <p>Transactions processed</p>
          </div>
          <div className="stat">
            <h3>500+</h3>
            <p>Business clients</p>
          </div>
          <div className="stat">
            <h3>99.9%</h3>
            <p>Uptime guarantee</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageWhoWeAre;
