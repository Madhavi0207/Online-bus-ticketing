import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">LuxuryRide</h3>
            <p className="text-gray-400">
              Your trusted partner for comfortable and safe bus travel across
              Nepal. Experience the difference in every journey.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                "Home",
                "Services",
                "Contact",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Popular Routes</h4>
            <ul className="space-y-2">
              {[
                "Kathmandu - Pokhara",
                "Pokhara - Chitwan",
                "Kathmandu - Chitwan",
                "Pokhara - Lumbini",
              ].map((route) => (
                <li key={route}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    {route}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Customer Support</h4>
            <ul className="space-y-2">
              {[
                "FAQ",
                "Booking Guide",
                "Cancellation Policy",
                "Help Center",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 LuxuryRide Bus Services. All rights reserved.
            <span className="ml-2">Designed with ❤️ in Nepal</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
