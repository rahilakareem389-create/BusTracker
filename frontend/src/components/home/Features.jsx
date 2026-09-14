import React from "react";
import { Link } from "react-router-dom";

import {
  FaBus,
  FaCreditCard,
  FaLeaf,
  FaRoute,
  FaTicketAlt,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBus />,
    title: "Online Registration",
    desc: "Register your bus in real-time with precision. Never miss your ride again with accurate arrival predictions.",
  },
  {
    icon: <FaCreditCard />,
    title: "Digital Payments",
    desc: "Seamless cashless transactions with multiple payment options. Quick, secure, and convenient.",
  },
  {
    icon: <FaLeaf />,
    title: "Eco-Friendly",
    desc: "Reduce your carbon footprint with our modern, fuel-efficient fleet. Travel green, travel smart.",
  },
  {
    icon: <FaRoute />,
    title: "Smart Routes",
    desc: "Complete bus system at your fingertips. Plan routes, book tickets, and manage your trips easily.",
  },
  {
    icon: <FaTicketAlt />,
    title: "Smart Ticketing",
    desc: "Digital tickets with QR codes. No more paper tickets or lost receipts. Everything in your phone.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    desc: "Round-the-clock customer support to assist you with any queries or issues you might face.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-black text-white py-16 px-4 md:px-10">

      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-400 mb-12">
        Why Travel With Us
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {features.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 
            hover:border-orange-500 hover:shadow-lg hover:scale-[1.03] transition duration-300"
          >
            {/* ICON */}
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

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">

        <Link
          to="/contact"
          className="px-7 py-3 rounded-lg font-semibold text-black 
          bg-gradient-to-r from-orange-500 to-yellow-400 
          hover:from-yellow-400 hover:to-orange-500 
          transition duration-300 text-center shadow-lg"
        >
          Get in Touch
        </Link>

        <Link
          to="/services"
          className="px-7 py-3 rounded-lg font-semibold text-white 
          border border-orange-500 
          hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-400 
          hover:text-black transition duration-300 text-center"
        >
          See More Services
        </Link>

      </div>

    </section>
  );
}