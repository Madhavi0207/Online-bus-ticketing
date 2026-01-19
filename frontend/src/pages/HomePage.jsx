import React from "react";
import NavBar from "../components/common/NavBar";
import HeroSection from "../components/home/HeroSection";
import ServiceSection from "../components/home/ServiceSection";
import RoutesSection from "../components/home/RoutesSection";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Header />
      <HeroSection />
      <ServiceSection />
      <RoutesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
