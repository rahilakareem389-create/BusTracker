import React from "react";
import { Link } from "react-router-dom";

export default function AboutHero() {
  return (
    <section className="bg-black text-white min-h-[80vh] flex items-center px-4 md:px-10">

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-10">

        {/* LEFT SIDE */}
        <div className="max-w-lg"> {/* 👈 important */}

          {/* HEADING */}
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            About Our Travel Agency
          </h1>

          {/* TEXT */}
          <p className="mt-4 leading-relaxed text-sm md:text-base text-gray-300">
            We provide safe, modern and affordable travel solutions.
            Our goal is to make your journey smooth, comfortable and reliable
            with professional support and smart booking system.
          </p>

          {/* BUTTON */}
          <Link
            to="/contact"
            className="inline-block mt-5 px-5 py-2.5 bg-orange-500 text-black font-medium rounded-lg
            hover:bg-yellow-400 transition"
          >
            Contact Us
          </Link>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center md:justify-end">

          <div className="relative w-full max-w-md"> {/* 👈 control image size */}

            <img
              src="/slide2.jpg"
              alt="Travel"
              className="w-full h-auto rounded-xl
              translate-y-2 hover:translate-y-0 transition duration-500"
            />

            <div className="absolute -inset-3 bg-orange-500/10 blur-2xl rounded-full -z-10"></div>

          </div>

        </div>

      </div>

    </section>
  );
}