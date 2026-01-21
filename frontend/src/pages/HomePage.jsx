import HeroSection from "../components/home/HeroSection";
import ServiceSection from "../components/home/ServiceSection";
import RoutesSection from "../components/home/RoutesSection";
import Footer from "../components/common/Footer";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <ServiceSection />
      <RoutesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
