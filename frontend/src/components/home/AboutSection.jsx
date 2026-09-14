import React from "react";
import { Link } from "react-router-dom";

export default function AboutSection() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-10">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

        {/* LEFT SIDE - TEXT */}
        <div className="flex-1">

          <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-4">
            About UniRide
          </h2>

          <p className="text-white-400 leading-relaxed mb-6">
            UniRide is a smart transportation system designed to make your travel
            easier, faster, and more reliable. We focus on providing safe routes,
            modern buses, and a seamless digital experience for every passenger.
          </p>

          <p className="text-white-500 text-sm mb-6">
            From online booking to real-time tracking, everything is built to
            improve your daily commute experience.
          </p>

          {/* BUTTON */}
          <Link
            to="/about"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 
            text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-500 
            transition duration-300"
          >
            About Us
          </Link>
        </div>

        {/* RIGHT SIDE - IMAGE + ANIMATION */}
        <div className="flex-1 flex justify-center">

          <div className="relative">

            {/* floating animation */}
            <img
              src="/bus_icon.png"
              alt="Bus"
              className="w-72 md:w-96 animate-bounce"
            />

            {/* glow effect */}
            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full"></div>

          </div>

        </div>

      </div>
    </section>
  );
}