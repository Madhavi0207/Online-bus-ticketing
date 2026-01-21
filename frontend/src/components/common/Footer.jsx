import { Link } from "react-router-dom";
import {
  Bus,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  const popularRoutes = [
    "Kathmandu - Pokhara",
    "Pokhara - Chitwan",
    "Kathmandu - Chitwan",
    "Pokhara - Lumbini",
  ];

  const supportLinks = [
    "FAQ",
    "Booking Guide",
    "Cancellation Policy",
    "Help Center",
  ];

  return (
    <footer className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 ">
              <Bus className="h-8 w-8 text-luxury-gold" />
              <h2 className="text-2xl font-bold">LuxuryRide</h2>
            </div>
            <p className="text-white-400 mb-6">
              Your trusted partner for comfortable and safe bus travel across
              Nepal. Experience the difference in every journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white-400 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Routes</h3>
            <ul className="space-y-2">
              {popularRoutes.map((route) => (
                <li key={route} className="text-white-400">
                  {route}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2 mb-6">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white-400 hover:text-black">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-luxury-gold" />
                <span className="text-white-400">Pokhara, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-luxury-gold" />
                <span className="text-white-400">+977 9800000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-luxury-gold" />
                <span className="text-white-400">info@luxuryride.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-white-400">
            © 2024 LuxuryRide Bus Services. All rights reserved. Designed with
            ❤️ in Nepal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
