import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";
import backgroundImage from "../../assets/background_image.jpg";

const HeroSection = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section
        className="
          relative
          w-full
          h-[85vh]
          bg-cover
          bg-center
          bg-no-repeat
          flex
          items-center
        "
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 w-full px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Journey in Comfort,
                <br />
                <span className="text-yellow-400">Travel in Style</span>
              </h1>

              <p className="text-lg md:text-xl mb-8 text-gray-200">
                Experience luxury redefined with every mile. Book your next
                journey with Nepal's premium bus service for comfort, safety,
                and reliability.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition "
                >
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <Link
                  to="/routes"
                  className="
      inline-flex
      items-center
      justify-center
      px-8
      py-3
      rounded-lg
      border
      border-white
      text-white
      font-semibold
      hover:bg-white/10
      transition
    "
                >
                  View Routes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION (NO BACKGROUND IMAGE) */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Shield className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">100%</div>
              <div className="text-gray-600">Safety Record</div>
            </div>

            <div>
              <Users className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>

            <div>
              <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-gray-600">Daily Trips</div>
            </div>

            <div>
              <Shield className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
