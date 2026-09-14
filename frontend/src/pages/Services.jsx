import React from "react";
import { Link } from "react-router-dom";
import {
  FaBus,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaCreditCard,
  FaClock,
  FaPhoneAlt,
  FaGlobe,
  FaRoute,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBus />,
    title: "Luxury Bus Fleet",
    desc: "Travel in comfort with modern, fully equipped luxury buses for all routes.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Real-Time Tracking",
    desc: "Track your bus live with accurate GPS updates anytime, anywhere.",
  },
  {
    icon: <FaTicketAlt />,
    title: "Instant Ticket Booking",
    desc: "Book tickets instantly with fast, simple and secure process.",
  },
  {
    icon: <FaCreditCard />,
    title: "Secure Payments",
    desc: "Multiple safe payment options including cards and digital wallets.",
  },
  {
    icon: <FaClock />,
    title: "On-Time Guarantee",
    desc: "We ensure punctual departures and arrivals for stress-free travel.",
  },
  {
    icon: <FaPhoneAlt />,
    title: "24/7 Customer Support",
    desc: "Our team is always available to help you anytime.",
  },
  {
    icon: <FaGlobe />,
    title: "Online Booking System",
    desc: "Book your trips online easily without any physical hassle.",
  },
  {
    icon: <FaRoute />,
    title: "Smart Route Planning",
    desc: "Optimized routes for faster and smoother travel experience.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Safety First Travel",
    desc: "High safety standards with trained drivers and secure buses.",
  },
];

const PricingSection = () => (
  <section className="py-16 px-4 md:px-10 bg-gradient-to-b from-gray-900 to-black">
    <div className="max-w-4xl mx-auto">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl text-white flex flex-col justify-center mx-auto max-w-2xl">

        <h2 className="text-3xl font-bold text-center mb-6">
          Pricing Plans
        </h2>

        <ul className="space-y-4 text-sm md:text-base text-gray-300">
          <li className="flex justify-between border-b border-white/10 pb-2">
            <span>City Tour</span>
            <span className="text-orange-400 font-semibold">$30 / Rs. 8,500</span>
          </li>
          <li className="flex justify-between border-b border-white/10 pb-2">
            <span>Trip Tour</span>
            <span className="text-orange-400 font-semibold">$70 / Rs. 20,000</span>
          </li>
          <li className="flex justify-between border-b border-white/10 pb-2">
            <span>Group Tour</span>
            <span className="text-orange-400 font-semibold">$120 / Rs. 34,000</span>
          </li>
          <li className="flex justify-between border-b border-white/10 pb-2">
            <span>Family Tour</span>
            <span className="text-orange-400 font-semibold">$150 / Rs. 42,000</span>
          </li>
          <li className="flex justify-between border-b border-white/10 pb-2">
            <span>Daily Tour</span>
            <span className="text-orange-400 font-semibold">$20/day / Rs. 5,500</span>
          </li>
          <li className="flex justify-between pb-2">
            <span>Weekly Package</span>
            <span className="text-orange-400 font-semibold">$100/week / Rs. 28,000</span>
          </li>
        </ul>

        <div className="mt-6 text-sm text-gray-400 space-y-2">
          <p>✔ 10% Discount on Group Booking</p>
          <p>✔ Free Guide for Family Tours</p>
          <p>✔ 24/7 Customer Support</p>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            to="/services"
            className="relative px-6 py-3 bg-orange-500 text-white font-semibold rounded-full overflow-hidden group text-center"
          >
            <span className="absolute inset-0 bg-orange-600 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-full"></span>
            <span className="relative z-10">Order Now</span>
            <span className="absolute inset-0 blur-md opacity-30 bg-orange-400 group-hover:opacity-70 transition"></span>
          </Link>

          <Link
            to="/contact"
            className="relative px-6 py-3 border border-white/30 text-white font-semibold rounded-full overflow-hidden group text-center hover:border-orange-500"
          >
            <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-full"></span>
            <span className="relative z-10">Get in Touch</span>
          </Link>

        </div>

      </div>
    </div>
  </section>
);

const FeaturesSection = () => {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-400 mb-12">
        Why Travel With Us
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500 hover:shadow-lg hover:scale-[1.03] transition duration-300"
          >
            <div className="text-3xl text-orange-400 mb-3">
              {item.icon}
            </div>

            <h3 className="text-xl font-semibold text-orange-400 mb-2">
              {item.title}
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

function Services() {
  return (
    <div>
      <FeaturesSection />
      <PricingSection />
    </div>
  );
}

export default Services;