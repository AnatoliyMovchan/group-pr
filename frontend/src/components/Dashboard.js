import React, { useState, useEffect } from "react";
import useUserTracking from "../hooks/useUserTracking";

const Dashboard = () => {
  const [data, setData] = useState([]);
  useUserTracking();

  useEffect(() => {
    fetch("http://localhost:4000/analytics")
      .then((res) => res.json())
      .then((stats) => setData(stats))
      .catch((error) => console.error("Error fetching analytics:", error));
  }, []);

  return (
    <div>
      <header class="bg-primary text-white text-center py-5">
        <div class="container">
          <h1>Welcome</h1>
          <p class="lead">The perfect place to showcase your project</p>
          <a href="#features" class="btn btn-light btn-lg">
            Learn More
          </a>
        </div>
      </header>
      <section id="features" class="py-5">
        <div class="container">
          <h2 class="text-center mb-4">Features</h2>
          <div class="row text-center">
            <div class="col-md-4">
              <i class="bi bi-speedometer2 fs-1 text-primary"></i>
              <h4 class="mt-3">Fast</h4>
              <p>Our platform is optimized for speed and performance.</p>
            </div>
            <div class="col-md-4">
              <i class="bi bi-lock fs-1 text-primary"></i>
              <h4 class="mt-3">Secure</h4>
              <p>We take security seriously to protect your data.</p>
            </div>
            <div class="col-md-4">
              <i class="bi bi-brush fs-1 text-primary"></i>
              <h4 class="mt-3">Customizable</h4>
              <p>Easily tailor the experience to your needs.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="about" class="bg-light py-5">
        <div class="container">
          <h2 class="text-center mb-4">About Us</h2>
          <p class="lead text-center">
            We are a team of passionate individuals dedicated to providing the
            best solutions for our clients.
          </p>
          <div class="row">
            <div class="col-md-6">
              <img
                src="https://via.placeholder.com/500x300"
                alt="About us"
                class="img-fluid"
              />
            </div>
            <div class="col-md-6">
              <p>
                Founded in 2020, our company has grown from a small team of
                developers to a full-fledged technology company serving clients
                worldwide. We believe in quality, innovation, and customer
                satisfaction.
              </p>
              <p>
                Our mission is to help businesses grow by providing them with
                the tools and technologies they need to succeed in a competitive
                market.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" class="py-5">
        <div class="container">
          <h2 class="text-center mb-4">Contact Us</h2>
          <p class="lead text-center">
            We'd love to hear from you! Reach out to us anytime.
          </p>
          <form>
            <div class="row">
              <div class="col-md-6 mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Your Email"
                  required
                />
              </div>
            </div>
            <div class="mb-3">
              <textarea
                class="form-control"
                rows="5"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary btn-lg">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
