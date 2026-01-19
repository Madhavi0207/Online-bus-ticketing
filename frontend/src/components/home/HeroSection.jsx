import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-linear-to-r from-primary-900 to-primary-700 text-white items-center">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative section-container">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Journey in Comfort,
            <br />
            <span className="text-luxury-gold">Travel in Style</span>
          </h1>
          <p className="text-xl mb-8 text-black-200">
            Experience luxury redefined with every mile. Book your next journey
            with Nepal's premium bus service for comfort, safety, and
            reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/booking"
              className="btn-primary bg-luxury-gold hover:bg-yellow-600 flex items-center justify-center space-x-2"
            >
              <span>Book Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/routes"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              View Routes
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="h-8 w-8 text-luxury-gold mx-auto mb-2" />
              <div className="text-3xl font-bold">100%</div>
              <div className="text-gray-300">Safety Record</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-luxury-gold mx-auto mb-2" />
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-luxury-gold mx-auto mb-2" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-gray-300">Daily Trips</div>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-luxury-gold mx-auto mb-2" />
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
