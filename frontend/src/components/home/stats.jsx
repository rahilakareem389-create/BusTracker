import React from "react";

const stats = [
  { number: "500+", label: "Daily Passengers" },
  { number: "20+", label: "Active Routes" },
  { number: "98%", label: "On-Time Performance" },
  { number: "1M+", label: "Miles Traveled" },
];

export default function Stats() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-10">

      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white-400 mb-12">
        Our Impact
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center 
            hover:border-orange-500 hover:scale-105 transition duration-300"
          >
            <h3 className="text-3xl font-bold text-yellow-400 mb-2">
              {item.number}
            </h3>

            <p className="text-white-400 text-sm">
              {item.label}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}